'use client'

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faPause,
  faPlay,
  faRedo,
  faStepBackward,
  faStepForward,
  faUpload,
  faVolumeMute,
  faVolumeUp
} from '@fortawesome/free-solid-svg-icons'
import {
  type DragEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import * as Tone from 'tone'

import { parseMidiFile } from '@/lib/midi-parser'
import { BUILTIN_MANIFEST, type Track } from '@/lib/midi-tracks'

import styles from './MidiVisualizer.module.css'

// Lightweight FA renderer — avoids the CSS-injection setup the React component
// needs in Next.js Pages Router. Reads geometry directly from IconDefinition.
function Icon({
  icon,
  className,
  size = '1em'
}: {
  icon: IconDefinition
  className?: string
  size?: string
}) {
  const width = icon.icon[0]
  const height = icon.icon[1]
  const svgPathData = icon.icon[4]
  const path = Array.isArray(svgPathData) ? svgPathData[0] : svgPathData
  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      width={size}
      height={size}
      fill='currentColor'
      aria-hidden='true'
    >
      <path d={path} />
    </svg>
  )
}

const MIN_NOTE = 21 // A0
const MAX_NOTE = 108 // C8
const BLACK_KEY_SEMITONES = new Set([1, 3, 6, 8, 10])
const NOTE_NAMES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B'
]
const ANIMATION_DURATION_S = 12
const MAX_BAR_HEIGHT_RATIO = 1.5
const LOOKAHEAD_S = 0.05

const KEYBOARD_NOTES_MAP: Record<string, number> = {
  q: 60,
  '2': 61,
  w: 62,
  '3': 63,
  e: 64,
  r: 65,
  '5': 66,
  t: 67,
  '6': 68,
  y: 69,
  '7': 70,
  u: 71,
  i: 72,
  '9': 73,
  o: 74,
  '0': 75,
  p: 76,
  '[': 77,
  '=': 78,
  ']': 79
}

type KeyInfo = {
  note: number
  isBlack: boolean
  whiteIndex: number
  precedingWhiteIndex: number
}

function buildKeyInfo(): { keys: KeyInfo[]; whiteCount: number } {
  const keys: KeyInfo[] = []
  let whiteIndex = 0
  for (let note = MIN_NOTE; note <= MAX_NOTE; note++) {
    const isBlack = BLACK_KEY_SEMITONES.has(note % 12)
    if (!isBlack) {
      keys.push({ note, isBlack, whiteIndex, precedingWhiteIndex: whiteIndex })
      whiteIndex++
    } else {
      keys.push({
        note,
        isBlack,
        whiteIndex: -1,
        precedingWhiteIndex: whiteIndex - 1
      })
    }
  }
  return { keys, whiteCount: whiteIndex }
}

function noteName(note: number): string {
  return `${NOTE_NAMES[note % 12]}${Math.floor(note / 12) - 1}`
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

type ActiveBar = {
  id: number
  note: number
  isBlack: boolean
  startedAt: number
  releasedAt: number | null
}

type Props = { className?: string }

export function MidiVisualizer({ className }: Props) {
  const { keys, whiteCount } = useMemo(buildKeyInfo, [])
  const whiteKeyWidthPct = 100 / whiteCount

  const [pressed, setPressed] = useState<Record<number, boolean>>({})
  const [midiInputs, setMidiInputs] = useState<MIDIInput[]>([])
  const [selectedInputId, setSelectedInputId] = useState<string>('')
  const [midiStatus, setMidiStatus] = useState<
    'idle' | 'connecting' | 'connected' | 'unsupported' | 'denied'
  >('idle')

  const [tracks, setTracks] = useState<Track[]>([])
  const [selectedTrackId, setSelectedTrackId] = useState<string>('')
  const [isLoadingTracks, setIsLoadingTracks] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackTime, setPlaybackTime] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)

  const playfieldRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const pianoRef = useRef<HTMLDivElement | null>(null)
  const [pianoWidth, setPianoWidth] = useState(0)
  // Visible white key range refs — read by noteOn at fire time.
  const visibleRef = useRef({
    whiteStart: 0,
    fittedWhites: whiteCount,
    whiteWidthPct: 100 / whiteCount
  })

  const barsRef = useRef<Map<number, ActiveBar>>(new Map())
  const barElementsRef = useRef<Map<number, HTMLDivElement>>(new Map())
  const barIdRef = useRef(0)
  const activeNoteBarRef = useRef<Map<number, number>>(new Map())
  const heldKeysRef = useRef<Set<string>>(new Set())
  const clickedNoteRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const synthRef = useRef<Tone.PolySynth | null>(null)
  const synthVolumeRef = useRef<Tone.Volume | null>(null)

  const playbackRef = useRef<{
    track: Track | null
    startedAt: number
    pausedAt: number
    nextEventIdx: number
    scheduledOffs: Array<{ note: number; offTime: number }>
  }>({
    track: null,
    startedAt: 0,
    pausedAt: 0,
    nextEventIdx: 0,
    scheduledOffs: []
  })

  const selectedTrack = tracks.find((t) => t.id === selectedTrackId) ?? null

  // Lazy synth init. Tone needs a user gesture to start its AudioContext, so
  // construction is cheap but Tone.start() is called from noteOn / togglePlay.
  useEffect(() => {
    const vol = new Tone.Volume(0).toDestination()
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.005, decay: 0.15, sustain: 0.3, release: 0.9 }
    }).connect(vol)
    synth.maxPolyphony = 64
    synthVolumeRef.current = vol
    synthRef.current = synth
    return () => {
      synth.releaseAll()
      synth.dispose()
      vol.dispose()
      synthRef.current = null
      synthVolumeRef.current = null
    }
  }, [])

  // Push volume / mute into the synth's Volume node.
  useEffect(() => {
    const vol = synthVolumeRef.current
    if (!vol) return
    if (isMuted || volume <= 0) {
      vol.mute = true
    } else {
      vol.mute = false
      vol.volume.value = Tone.gainToDb(volume)
    }
  }, [volume, isMuted])

  const noteOn = useCallback(
    (note: number, velocity = 96) => {
      if (note < MIN_NOTE || note > MAX_NOTE) return
      // If this note is already sounding, release the prior instance first.
      // PolySynth.triggerRelease(freq) drops every voice at that pitch, so
      // without this a same-pitch retrigger would orphan the previous bar
      // (its id gets overwritten in activeNoteBarRef) and leak its voice.
      if (activeNoteBarRef.current.has(note)) {
        const prevId = activeNoteBarRef.current.get(note)!
        const prevBar = barsRef.current.get(prevId)
        if (prevBar && prevBar.releasedAt == null) {
          prevBar.releasedAt = performance.now()
        }
      }
      const synth = synthRef.current
      if (synth) {
        if (Tone.getContext().state !== 'running') void Tone.start()
        const freq = Tone.Frequency(note, 'midi').toFrequency()
        const v = Math.max(0, Math.min(1, velocity / 127))
        // Release any prior voice at this pitch before attacking again.
        if (activeNoteBarRef.current.has(note)) synth.triggerRelease(freq)
        synth.triggerAttack(freq, undefined, v)
      }
      setPressed((p) => (p[note] ? p : { ...p, [note]: true }))
      const id = ++barIdRef.current
      const isBlack = BLACK_KEY_SEMITONES.has(note % 12)
      const bar: ActiveBar = {
        id,
        note,
        isBlack,
        startedAt: performance.now(),
        releasedAt: null
      }
      barsRef.current.set(id, bar)
      activeNoteBarRef.current.set(note, id)

      const playfield = playfieldRef.current
      const vis = visibleRef.current
      if (playfield) {
        const el = document.createElement('div')
        el.className = styles.bar + (isBlack ? ' ' + styles.barBlack : '')
        const keyInfo = keys.find((k) => k.note === note)
        if (keyInfo) {
          const pos = getBarPosition(keyInfo, vis.whiteWidthPct, vis.whiteStart)
          if (pos) {
            el.style.left = `${pos.left}%`
            el.style.width = `${pos.width}%`
          } else {
            // Note is outside the visible piano range — hide it.
            el.style.display = 'none'
          }
        }
        el.style.height = '0px'
        el.style.transform = 'translateY(0px)'
        playfield.append(el)
        barElementsRef.current.set(id, el)
      }
      return id
    },
    [keys, whiteKeyWidthPct]
  )

  const noteOff = useCallback((note: number) => {
    setPressed((p) => {
      if (!p[note]) return p
      const next = { ...p }
      delete next[note]
      return next
    })
    const id = activeNoteBarRef.current.get(note)
    if (id != null) {
      const bar = barsRef.current.get(id)
      if (bar && bar.releasedAt == null) bar.releasedAt = performance.now()
      activeNoteBarRef.current.delete(note)
    }
    const synth = synthRef.current
    if (synth) {
      const freq = Tone.Frequency(note, 'midi').toFrequency()
      synth.triggerRelease(freq)
    }
  }, [])

  // rAF for bar animation + playback scheduling
  useEffect(() => {
    const tick = () => {
      const playfield = playfieldRef.current
      if (playfield) {
        const playHeight = playfield.clientHeight
        const pxPerMs = playHeight / (ANIMATION_DURATION_S * 1000)
        const now = performance.now()
        const maxHeight = playHeight * MAX_BAR_HEIGHT_RATIO
        const toRemove: number[] = []
        for (const [id, bar] of barsRef.current) {
          const el = barElementsRef.current.get(id)
          if (!el) continue
          const endTime = bar.releasedAt ?? now
          const heldMs = endTime - bar.startedAt
          const height = Math.min(heldMs * pxPerMs, maxHeight)
          let translateY = 0
          if (bar.releasedAt != null) {
            translateY = -((now - bar.releasedAt) * pxPerMs)
            if (Math.abs(translateY) > playHeight + height + 20) {
              toRemove.push(id)
              continue
            }
            // Add the released class once — drives the square→pill transition.
            const releasedClass = styles.barReleased ?? ''
            if (releasedClass && !el.classList.contains(releasedClass)) {
              el.classList.add(releasedClass)
            }
          }
          el.style.height = `${height}px`
          el.style.transform = `translateY(${translateY}px)`
        }
        for (const id of toRemove) {
          const el = barElementsRef.current.get(id)
          if (el && el.parentNode) el.remove()
          barElementsRef.current.delete(id)
          barsRef.current.delete(id)
        }
      }

      // Playback scheduler
      const pb = playbackRef.current
      if (pb.track && pb.startedAt > 0) {
        const elapsed = (performance.now() - pb.startedAt) / 1000
        const notes = pb.track.parsed.notes
        while (pb.nextEventIdx < notes.length) {
          const ev = notes[pb.nextEventIdx]
          if (!ev || ev.time > elapsed + LOOKAHEAD_S) break
          noteOn(ev.note, ev.velocity)
          pb.scheduledOffs.push({
            note: ev.note,
            offTime: ev.time + ev.duration
          })
          pb.nextEventIdx++
        }
        // Fire scheduled note-offs
        pb.scheduledOffs = pb.scheduledOffs.filter((s) => {
          if (s.offTime <= elapsed) {
            noteOff(s.note)
            return false
          }
          return true
        })
        setPlaybackTime(elapsed)
        if (
          pb.nextEventIdx >= notes.length &&
          pb.scheduledOffs.length === 0 &&
          elapsed >= pb.track.parsed.duration
        ) {
          // Done
          stopPlayback(false)
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [noteOn, noteOff])

  const stopPlayback = useCallback(
    (clearPosition = true) => {
      const pb = playbackRef.current
      // Release every still-held note — both scheduled offs from playback and
      // any notes still pressed from keyboard / MIDI / mouse input. Without
      // this, swapping songs while a note is held leaves it stuck.
      for (const s of pb.scheduledOffs) noteOff(s.note)
      pb.scheduledOffs = []
      for (const note of activeNoteBarRef.current.keys()) noteOff(note)
      // Catch-all in case a synth voice slipped past per-note release tracking
      // (e.g. tab-throttled rAF backed up beyond the release tail).
      synthRef.current?.releaseAll()
      pb.startedAt = 0
      pb.pausedAt = 0
      pb.nextEventIdx = 0
      setIsPlaying(false)
      if (clearPosition) setPlaybackTime(0)
    },
    [noteOff]
  )

  const playTrack = useCallback(
    (track: Track, fromTime = 0) => {
      const pb = playbackRef.current
      // Release any already-held notes from previous playback
      for (const s of pb.scheduledOffs) noteOff(s.note)
      pb.scheduledOffs = []
      pb.track = track
      pb.startedAt = performance.now() - fromTime * 1000
      pb.pausedAt = 0
      // Skip notes that already passed
      pb.nextEventIdx = track.parsed.notes.findIndex((n) => n.time >= fromTime)
      if (pb.nextEventIdx < 0) pb.nextEventIdx = track.parsed.notes.length
      setIsPlaying(true)
    },
    [noteOff]
  )

  const togglePlay = useCallback(() => {
    if (!selectedTrack) return
    if (Tone.getContext().state !== 'running') void Tone.start()
    if (isPlaying) {
      // Pause
      const pb = playbackRef.current
      pb.pausedAt = (performance.now() - pb.startedAt) / 1000
      pb.startedAt = 0
      for (const s of pb.scheduledOffs) noteOff(s.note)
      pb.scheduledOffs = []
      synthRef.current?.releaseAll()
      setIsPlaying(false)
    } else {
      const pb = playbackRef.current
      const startFrom =
        pb.track?.id === selectedTrack.id && pb.pausedAt > 0
          ? pb.pausedAt
          : playbackTime >= selectedTrack.parsed.duration
            ? 0
            : playbackTime
      playTrack(selectedTrack, startFrom)
    }
  }, [selectedTrack, isPlaying, playbackTime, playTrack, noteOff])

  const handleSeek = useCallback(
    (time: number) => {
      if (!selectedTrack) return
      const wasPlaying = isPlaying
      const pb = playbackRef.current
      for (const s of pb.scheduledOffs) noteOff(s.note)
      pb.scheduledOffs = []
      pb.pausedAt = time
      setPlaybackTime(time)
      if (wasPlaying) {
        playTrack(selectedTrack, time)
      } else {
        pb.startedAt = 0
        pb.nextEventIdx = selectedTrack.parsed.notes.findIndex(
          (n) => n.time >= time
        )
        if (pb.nextEventIdx < 0)
          pb.nextEventIdx = selectedTrack.parsed.notes.length
      }
    },
    [selectedTrack, isPlaying, playTrack, noteOff]
  )

  const skipPrev = useCallback(() => {
    if (!selectedTrack || tracks.length === 0) return
    // If we're more than 3s in, restart current track. Otherwise jump to prev,
    // wrapping around to the last track if we're at the start of the list.
    if (playbackTime > 3) {
      handleSeek(0)
      return
    }
    const idx = tracks.findIndex((t) => t.id === selectedTrack.id)
    const prevIdx = (idx - 1 + tracks.length) % tracks.length
    const prev = tracks[prevIdx]
    if (prev) {
      stopPlayback(true)
      setSelectedTrackId(prev.id)
      playTrack(prev, 0)
    }
  }, [tracks, selectedTrack, playbackTime, handleSeek, stopPlayback, playTrack])

  const skipNext = useCallback(() => {
    if (!selectedTrack || tracks.length === 0) return
    const idx = tracks.findIndex((t) => t.id === selectedTrack.id)
    const nextIdx = (idx + 1) % tracks.length
    const next = tracks[nextIdx]
    if (next) {
      stopPlayback(true)
      setSelectedTrackId(next.id)
      playTrack(next, 0)
    }
  }, [tracks, selectedTrack, stopPlayback, playTrack])

  const selectTrack = useCallback(
    (id: string) => {
      const track = tracks.find((t) => t.id === id)
      stopPlayback(true)
      setSelectedTrackId(id)
      if (track) playTrack(track, 0)
    },
    [tracks, stopPlayback, playTrack]
  )

  const handleFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList).filter(
        (f) =>
          f.name.toLowerCase().endsWith('.mid') ||
          f.name.toLowerCase().endsWith('.midi')
      )
      if (files.length === 0) {
        setErrorMessage('Only .mid / .midi files are supported')
        return
      }
      setErrorMessage(null)
      const newTracks: Track[] = []
      for (const file of files) {
        try {
          const buf = await file.arrayBuffer()
          const parsed = parseMidiFile(buf)
          if (parsed.notes.length === 0) {
            throw new Error('No notes found in file')
          }
          newTracks.push({
            id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            name: file.name.replace(/\.midi?$/i, ''),
            composer: 'You',
            source: 'upload',
            parsed
          })
        } catch (err) {
          setErrorMessage(
            `Could not parse ${file.name}: ${(err as Error).message}`
          )
        }
      }
      if (newTracks.length > 0 && newTracks[0]) {
        const first = newTracks[0]
        setTracks((prev) => [...newTracks, ...prev])
        setSelectedTrackId(first.id)
        stopPlayback(true)
        playTrack(first, 0)
      }
    },
    [stopPlayback, playTrack]
  )

  // Keyboard input
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      const tgt = e.target as HTMLElement | null
      if (
        tgt &&
        (tgt.tagName === 'INPUT' ||
          tgt.tagName === 'TEXTAREA' ||
          tgt.tagName === 'SELECT')
      ) {
        return
      }
      if (e.key === ' ') {
        e.preventDefault()
        togglePlay()
        return
      }
      const note = KEYBOARD_NOTES_MAP[e.key]
      if (note != null && !heldKeysRef.current.has(e.key)) {
        heldKeysRef.current.add(e.key)
        noteOn(note)
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      const note = KEYBOARD_NOTES_MAP[e.key]
      if (note != null) {
        heldKeysRef.current.delete(e.key)
        noteOff(note)
      }
    }
    // If the window loses focus while a key is held, keyup never fires —
    // release everything so the synth voice doesn't hang.
    const onBlur = () => {
      for (const key of heldKeysRef.current) {
        const note = KEYBOARD_NOTES_MAP[key]
        if (note != null) noteOff(note)
      }
      heldKeysRef.current.clear()
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [noteOn, noteOff, togglePlay])

  useEffect(() => {
    const onUp = () => {
      if (clickedNoteRef.current != null) {
        noteOff(clickedNoteRef.current)
        clickedNoteRef.current = null
      }
    }
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchend', onUp)
    }
  }, [noteOff])

  // Web MIDI
  const connectMidi = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.requestMIDIAccess) {
      setMidiStatus('unsupported')
      return
    }
    setMidiStatus('connecting')
    try {
      const access = await navigator.requestMIDIAccess()
      const inputs: MIDIInput[] = []
      // MIDIInputMap is a Map-like; iterate values to get MIDIInput.
      for (const input of access.inputs.values()) inputs.push(input)
      setMidiInputs(inputs)
      if (inputs[0] && !selectedInputId) {
        setSelectedInputId(inputs[0].id)
      }
      setMidiStatus('connected')
      access.addEventListener('statechange', () => {
        const updated: MIDIInput[] = []
        for (const input of access.inputs.values()) updated.push(input)
        setMidiInputs(updated)
      })
    } catch {
      setMidiStatus('denied')
    }
  }, [selectedInputId])

  useEffect(() => {
    if (!selectedInputId) return
    const input = midiInputs.find((i) => i.id === selectedInputId)
    if (!input) return
    const handler = (e: MIDIMessageEvent) => {
      const data = e.data
      if (!data || data.length < 3) return
      const status = data[0]! & 0xf0
      const note = data[1]!
      const velocity = data[2]!
      if (status === 0x90 && velocity > 0) noteOn(note)
      else if (status === 0x80 || (status === 0x90 && velocity === 0))
        noteOff(note)
    }
    input.addEventListener('midimessage', handler as EventListener)
    return () => {
      input.removeEventListener('midimessage', handler as EventListener)
    }
  }, [midiInputs, selectedInputId, noteOn, noteOff])

  const handleKeyMouseDown = (note: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    clickedNoteRef.current = note
    noteOn(note)
  }
  const handleKeyMouseEnter = (note: number) => (e: React.MouseEvent) => {
    if (e.buttons === 1 && clickedNoteRef.current !== note) {
      if (clickedNoteRef.current != null) noteOff(clickedNoteRef.current)
      clickedNoteRef.current = note
      noteOn(note)
    }
  }

  // Track drag-enter depth so child boundaries don't dismiss the overlay.
  const dragDepthRef = useRef(0)
  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer.types.includes('Files')) return
    e.preventDefault()
    dragDepthRef.current += 1
    setIsDragOver(true)
  }
  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.types.includes('Files')) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    }
  }
  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer.types.includes('Files')) return
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)
    if (dragDepthRef.current === 0) setIsDragOver(false)
  }
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    dragDepthRef.current = 0
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      void handleFiles(e.dataTransfer.files)
    }
  }

  // Fetch + parse all built-in MIDI files on mount.
  useEffect(() => {
    let cancelled = false
    setIsLoadingTracks(true)
    Promise.all(
      BUILTIN_MANIFEST.map(async (meta) => {
        const res = await fetch(meta.url)
        if (!res.ok) throw new Error(`Failed to load ${meta.url}`)
        const buf = await res.arrayBuffer()
        const parsed = parseMidiFile(buf)
        return {
          id: meta.id,
          name: meta.name,
          composer: meta.composer,
          source: 'builtin' as const,
          parsed
        }
      })
    )
      .then((loaded) => {
        if (cancelled) return
        setTracks(loaded)
        setSelectedTrackId(loaded[0]?.id ?? '')
        setIsLoadingTracks(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setErrorMessage(
          `Could not load built-in tracks: ${(err as Error).message}`
        )
        setIsLoadingTracks(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Observe piano width to compute visible key range with a minimum key size
  useEffect(() => {
    if (!pianoRef.current) return
    const el = pianoRef.current
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) setPianoWidth(entry.contentRect.width)
    })
    ro.observe(el)
    setPianoWidth(el.clientWidth)
    return () => ro.disconnect()
  }, [])

  const allWhiteKeys = keys.filter((k) => !k.isBlack)
  const allBlackKeys = keys.filter((k) => k.isBlack)

  // Min readable white-key width. If piano can't fit all 52 white keys at this
  // size, crop to a centered range around middle C (white index 23).
  const MIN_WHITE_KEY_PX = 14
  const totalWhites = allWhiteKeys.length // 52
  const fittedWhites =
    pianoWidth > 0
      ? Math.max(
          7,
          Math.min(totalWhites, Math.floor(pianoWidth / MIN_WHITE_KEY_PX))
        )
      : totalWhites
  const whiteKeyWidthPctVisible = 100 / fittedWhites
  const whiteCenter = 23 // middle C's white index
  let whiteStart = Math.max(0, whiteCenter - Math.floor(fittedWhites / 2))
  if (whiteStart + fittedWhites > totalWhites) {
    whiteStart = totalWhites - fittedWhites
  }
  const whiteEnd = whiteStart + fittedWhites - 1
  // Map white index back to MIDI note range — first/last visible MIDI bounds
  const visibleNoteMin = allWhiteKeys[whiteStart]?.note ?? MIN_NOTE
  const visibleNoteMax = allWhiteKeys[whiteEnd]?.note ?? MAX_NOTE

  // Keep ref fresh so newly-spawned bars use the current visible config.
  visibleRef.current = {
    whiteStart,
    fittedWhites,
    whiteWidthPct: whiteKeyWidthPctVisible
  }
  const isVisibleNote = (n: number) =>
    n >= visibleNoteMin && n <= visibleNoteMax
  const whiteKeys = allWhiteKeys.filter((k) => isVisibleNote(k.note))
  const blackKeys = allBlackKeys.filter((k) => isVisibleNote(k.note))

  const uploadedTracks = tracks.filter((t) => t.source === 'upload')
  const builtinTracks = tracks.filter((t) => t.source === 'builtin')

  const isMidiActive = midiStatus === 'connected' && midiInputs.length > 0

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <aside className={styles.library}>
        <div className={styles.libraryHeader}>
          <span className={styles.libraryTitle}>Recordings</span>
          <button
            type='button'
            className={styles.uploadButton}
            onClick={() => fileInputRef.current?.click()}
          >
            <Icon icon={faUpload} size='10px' /> Upload
          </button>
          <input
            ref={fileInputRef}
            type='file'
            accept='.mid,.midi,audio/midi'
            multiple
            hidden
            onChange={(e) => {
              if (e.target.files) void handleFiles(e.target.files)
              e.target.value = ''
            }}
          />
        </div>
        <ul className={styles.libraryList}>
          {uploadedTracks.length > 0 && (
            <>
              <li className={styles.libraryGroup}>Yours</li>
              {uploadedTracks.map((t) => (
                <TrackRow
                  key={t.id}
                  track={t}
                  active={t.id === selectedTrackId}
                  onSelect={selectTrack}
                />
              ))}
            </>
          )}
          <li className={styles.libraryGroup}>Featured</li>
          {isLoadingTracks ? (
            <li className={styles.libraryEmpty}>Loading recordings…</li>
          ) : (
            builtinTracks.map((t) => (
              <TrackRow
                key={t.id}
                track={t}
                active={t.id === selectedTrackId}
                onSelect={selectTrack}
              />
            ))
          )}
        </ul>
      </aside>

      <div className={styles.stage}>
        <div className={styles.stageHeader}>
          <div className={styles.stageTitle}>
            <span className={styles.stageTitleName}>
              {selectedTrack?.name ?? 'Select a recording'}
            </span>
            {selectedTrack && (
              <span className={styles.stageTitleOwner}>
                {selectedTrack.composer}
              </span>
            )}
          </div>
          <button
            type='button'
            className={[
              styles.midiPill,
              isMidiActive ? styles.midiPillActive : ''
            ].join(' ')}
            onClick={() => {
              if (midiStatus !== 'connected' && midiStatus !== 'unsupported') {
                void connectMidi()
              }
            }}
            disabled={
              midiStatus === 'connecting' || midiStatus === 'unsupported'
            }
          >
            <span
              className={[
                styles.midiDot,
                isMidiActive ? styles.midiDotActive : ''
              ].join(' ')}
            />
            {midiStatusLabel(midiStatus, midiInputs.length)}
          </button>
          {midiInputs.length > 1 && (
            <select
              className={styles.midiSelect}
              value={selectedInputId}
              onChange={(e) => setSelectedInputId(e.target.value)}
            >
              {midiInputs.map((input) => (
                <option key={input.id} value={input.id}>
                  {input.name ?? input.id}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className={styles.playfieldWrap}>
          <div ref={playfieldRef} className={styles.playfield} />
          {errorMessage && <div className={styles.error}>{errorMessage}</div>}

          <div ref={pianoRef} className={styles.piano}>
            <div className={styles.whiteRow}>
              {whiteKeys.map((k) => (
                <div
                  key={k.note}
                  role='button'
                  aria-label={noteName(k.note)}
                  tabIndex={-1}
                  className={[
                    styles.whiteKey,
                    pressed[k.note] ? styles.whiteKeyPressed : ''
                  ].join(' ')}
                  onMouseDown={handleKeyMouseDown(k.note)}
                  onMouseEnter={handleKeyMouseEnter(k.note)}
                  onTouchStart={(e) => {
                    e.preventDefault()
                    clickedNoteRef.current = k.note
                    noteOn(k.note)
                  }}
                >
                  {k.note % 12 === 0 && (
                    <span className={styles.whiteKeyLabel}>
                      {noteName(k.note)}
                    </span>
                  )}
                </div>
              ))}
            </div>
            {blackKeys.map((k) => {
              const blackWidth = whiteKeyWidthPctVisible * 0.62
              const localPreceding = k.precedingWhiteIndex - whiteStart
              const left =
                (localPreceding + 1) * whiteKeyWidthPctVisible - blackWidth / 2
              return (
                <div
                  key={k.note}
                  role='button'
                  aria-label={noteName(k.note)}
                  tabIndex={-1}
                  className={[
                    styles.blackKey,
                    pressed[k.note] ? styles.blackKeyPressed : ''
                  ].join(' ')}
                  style={{ left: `${left}%`, width: `${blackWidth}%` }}
                  onMouseDown={handleKeyMouseDown(k.note)}
                  onMouseEnter={handleKeyMouseEnter(k.note)}
                  onTouchStart={(e) => {
                    e.preventDefault()
                    clickedNoteRef.current = k.note
                    noteOn(k.note)
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>

      <Transport
        isPlaying={isPlaying}
        playbackTime={playbackTime}
        duration={selectedTrack?.parsed.duration ?? 0}
        track={selectedTrack}
        isMuted={isMuted}
        onTogglePlay={togglePlay}
        onSeek={handleSeek}
        onSkipPrev={skipPrev}
        onSkipNext={skipNext}
        onToggleMute={() => setIsMuted((m) => !m)}
        volume={volume}
        onVolumeChange={setVolume}
      />
      {isDragOver && <DropOverlay />}
    </div>
  )
}

function DropOverlay() {
  return (
    <div className={styles.dropOverlay}>
      <div className={styles.dropOverlayCard}>
        <svg
          viewBox='0 0 96 96'
          className={styles.dropIllustration}
          aria-hidden='true'
        >
          {/* File outline */}
          <path
            d='M 24 14 L 60 14 L 78 32 L 78 82 Q 78 86 74 86 L 24 86 Q 20 86 20 82 L 20 18 Q 20 14 24 14 Z'
            fill='rgba(255, 255, 255, 0.04)'
            stroke='rgba(255, 255, 255, 0.5)'
            strokeWidth='2'
            strokeLinejoin='round'
          />
          {/* Folded corner */}
          <path
            d='M 60 14 L 60 32 L 78 32'
            fill='none'
            stroke='rgba(255, 255, 255, 0.5)'
            strokeWidth='2'
            strokeLinejoin='round'
          />
          {/* Music note inside */}
          <path
            d='M 56 44 L 56 64 Q 56 70 50 70 Q 44 70 44 65 Q 44 60 50 60 Q 52 60 54 60.6 L 54 50 L 64 47.5 L 64 44 Z'
            fill='var(--w-primary)'
            opacity='0.9'
          />
          {/* Plus badge */}
          <circle cx='72' cy='70' r='12' fill='var(--w-primary)' />
          <path
            d='M 72 64 L 72 76 M 66 70 L 78 70'
            stroke='#04201a'
            strokeWidth='2.4'
            strokeLinecap='round'
          />
        </svg>
        <div className={styles.dropTitle}>Drop your MIDI file</div>
        <div className={styles.dropSub}>
          .mid or .midi — anywhere on the page
        </div>
      </div>
    </div>
  )
}

function TrackRow({
  track,
  active,
  onSelect
}: {
  track: Track
  active: boolean
  onSelect: (id: string) => void
}) {
  return (
    <li>
      <button
        type='button'
        className={[
          styles.trackItem,
          active ? styles.trackItemActive : ''
        ].join(' ')}
        onClick={() => onSelect(track.id)}
      >
        <div className={styles.trackInfo}>
          <span className={styles.trackName}>{track.name}</span>
          <span className={styles.trackOwner}>{track.composer}</span>
        </div>
        <span className={styles.trackDuration}>
          {formatTime(track.parsed.duration)}
        </span>
      </button>
    </li>
  )
}

function Transport({
  isPlaying,
  playbackTime,
  duration,
  track,
  isMuted,
  volume,
  onTogglePlay,
  onSeek,
  onSkipPrev,
  onSkipNext,
  onToggleMute,
  onVolumeChange
}: {
  isPlaying: boolean
  playbackTime: number
  duration: number
  track: Track | null
  isMuted: boolean
  volume: number
  onTogglePlay: () => void
  onSeek: (time: number) => void
  onSkipPrev: () => void
  onSkipNext: () => void
  onToggleMute: () => void
  onVolumeChange: (v: number) => void
}) {
  const scrubberRef = useRef<HTMLDivElement | null>(null)
  const [isScrubbing, setIsScrubbing] = useState(false)
  const [scrubPreview, setScrubPreview] = useState<number | null>(null)
  const displayedTime = scrubPreview ?? playbackTime
  const progressPct =
    duration > 0 ? Math.min(100, (displayedTime / duration) * 100) : 0

  const seekFromClientX = useCallback(
    (clientX: number) => {
      if (!track || duration <= 0) return 0
      const rect = scrubberRef.current?.getBoundingClientRect()
      if (!rect) return 0
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      return ratio * duration
    },
    [track, duration]
  )

  // Drag scrubbing: down to start, mousemove/up on document for reliability.
  useEffect(() => {
    if (!isScrubbing) return
    const onMove = (e: globalThis.MouseEvent) => {
      setScrubPreview(seekFromClientX(e.clientX))
    }
    const onUp = (e: globalThis.MouseEvent) => {
      const t = seekFromClientX(e.clientX)
      setIsScrubbing(false)
      setScrubPreview(null)
      onSeek(t)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
  }, [isScrubbing, seekFromClientX, onSeek])

  const handleScrubberMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!track || duration <= 0) return
    e.preventDefault()
    const t = seekFromClientX(e.clientX)
    setIsScrubbing(true)
    setScrubPreview(t)
  }
  return (
    <div className={styles.transport}>
      <button
        type='button'
        className={styles.iconButton}
        onClick={onSkipPrev}
        disabled={!track}
        aria-label='Previous'
      >
        <Icon icon={faStepBackward} size='14px' />
      </button>
      <button
        type='button'
        className={styles.iconButton}
        onClick={onTogglePlay}
        disabled={!track}
        aria-label={
          isPlaying
            ? 'Pause'
            : duration > 0 && playbackTime >= duration
              ? 'Replay'
              : 'Play'
        }
      >
        <Icon
          icon={
            isPlaying
              ? faPause
              : duration > 0 && playbackTime >= duration
                ? faRedo
                : faPlay
          }
          size='15px'
        />
      </button>
      <button
        type='button'
        className={styles.iconButton}
        onClick={onSkipNext}
        disabled={!track}
        aria-label='Next'
      >
        <Icon icon={faStepForward} size='14px' />
      </button>
      <span className={styles.transportTime}>{formatTime(displayedTime)}</span>
      <div
        ref={scrubberRef}
        className={[
          styles.scrubber,
          isScrubbing ? styles.scrubberDragging : ''
        ].join(' ')}
        role='slider'
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={displayedTime}
        tabIndex={track ? 0 : -1}
        onMouseDown={handleScrubberMouseDown}
        onKeyDown={(e) => {
          if (!track) return
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            onSeek(Math.min(duration, playbackTime + 1))
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault()
            onSeek(Math.max(0, playbackTime - 1))
          }
        }}
      >
        <div className={styles.scrubberTrack}>
          <div
            className={styles.scrubberFill}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {track && (
          <div
            className={styles.scrubberThumb}
            style={{ left: `${progressPct}%` }}
          />
        )}
      </div>
      <span
        className={[styles.transportTime, styles.transportTimeRight].join(' ')}
      >
        {formatTime(duration)}
      </span>
      <VolumeControl
        volume={volume}
        isMuted={isMuted}
        onVolumeChange={onVolumeChange}
        onToggleMute={onToggleMute}
      />
      {track && (
        <div className={styles.transportTrack}>
          <span className={styles.transportTrackName}>
            {track.composer && track.composer !== 'You'
              ? `${track.composer} – ${track.name}`
              : track.name}
          </span>
        </div>
      )}
    </div>
  )
}

function VolumeControl({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute
}: {
  volume: number
  isMuted: boolean
  onVolumeChange: (v: number) => void
  onToggleMute: () => void
}) {
  const [open, setOpen] = useState(false)
  const [dragging, setDragging] = useState(false)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  const effective = isMuted ? 0 : volume

  const seekFromY = useCallback((clientY: number) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return 0
    // Track is vertical: top = 1 (loud), bottom = 0 (mute)
    const ratio = 1 - (clientY - rect.top) / rect.height
    return Math.max(0, Math.min(1, ratio))
  }, [])

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: globalThis.MouseEvent) => {
      onVolumeChange(seekFromY(e.clientY))
    }
    const onUp = () => setDragging(false)
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
  }, [dragging, seekFromY, onVolumeChange])

  // Close popover on outside click
  useEffect(() => {
    if (!open) return
    const onDocClick = (e: globalThis.MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const fillPct = effective * 100
  const icon = effective === 0 ? faVolumeMute : faVolumeUp

  return (
    <div ref={wrapRef} className={styles.volumeWrap}>
      <button
        type='button'
        className={styles.iconButton}
        onClick={() => {
          if (open) {
            onToggleMute()
          } else {
            setOpen(true)
          }
        }}
        aria-label={effective === 0 ? 'Volume (muted)' : 'Volume'}
      >
        <Icon icon={icon} size='14px' />
      </button>
      {open && (
        <div className={styles.volumePopover}>
          <button
            type='button'
            className={styles.volumeMuteButton}
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            <Icon icon={icon} size='12px' />
          </button>
          <div
            ref={trackRef}
            className={[
              styles.volumeTrack,
              dragging ? styles.volumeTrackDragging : ''
            ].join(' ')}
            onMouseDown={(e) => {
              e.preventDefault()
              setDragging(true)
              onVolumeChange(seekFromY(e.clientY))
            }}
          >
            <div
              className={styles.volumeFill}
              style={{ height: `${fillPct}%` }}
            />
            <div
              className={styles.volumeThumb}
              style={{ bottom: `${fillPct}%` }}
            />
          </div>
          <span className={styles.volumeValue}>
            {Math.round(effective * 100)}
          </span>
        </div>
      )}
    </div>
  )
}

function midiStatusLabel(
  status: 'idle' | 'connecting' | 'connected' | 'unsupported' | 'denied',
  inputCount: number
) {
  switch (status) {
    case 'idle':
      return 'No MIDI'
    case 'connecting':
      return 'Connecting…'
    case 'connected':
      return inputCount > 0
        ? `${inputCount} MIDI device${inputCount === 1 ? '' : 's'}`
        : 'No MIDI devices'
    case 'unsupported':
      return 'Web MIDI unsupported'
    case 'denied':
      return 'MIDI access denied'
  }
}

// Bar position relative to the *visible* piano, where `whiteStart` is the
// index of the first white key on screen. Returns null when the key falls
// outside the visible range.
function getBarPosition(
  key: KeyInfo,
  whiteKeyWidthPct: number,
  whiteStart: number
): { left: number; width: number } | null {
  if (!key.isBlack) {
    const localIdx = key.whiteIndex - whiteStart
    if (localIdx < 0) return null
    // Match the actual key width — bars feel like the note rising from the key.
    const width = whiteKeyWidthPct
    const left = localIdx * whiteKeyWidthPct
    return { left, width }
  }
  const localPreceding = key.precedingWhiteIndex - whiteStart
  if (localPreceding < -1) return null
  const width = whiteKeyWidthPct * 0.62
  const left = (localPreceding + 1) * whiteKeyWidthPct - width / 2
  return { left, width }
}

// Suppress unused warnings for type imports that are referenced indirectly

export { type NoteEvent } from '@/lib/midi-parser'
