'use client'

import { type CSSProperties, useEffect, useRef, useState } from 'react'

import styles from './MidiVisualizerCover.module.css'

// The board fits roughly one white key per this many px of cover width, so wider
// covers show more (and thinner) keys/notes instead of fat ones.
const TARGET_KEY_PX = 28
const MIN_WHITE_KEYS = 8
const MAX_WHITE_KEYS = 28

// Within an octave (C D E F G A B = white indices 0–6), a black key sits on the
// right edge of these positions. None follow E (2) or B (6).
const BLACK_AFTER = new Set([0, 1, 3, 4, 5])

// Build a keyboard with `whiteKeys` keys and an E-major chord (E, G#, B)
// highlighted on a near-central octave, so the rising notes stay centered
// regardless of how many keys fit.
function buildKeyboard(whiteKeys: number) {
  let base = Math.round((whiteKeys / 2 - 4) / 7) * 7
  base = Math.max(0, Math.min(base, whiteKeys - 7))

  const eIdx = base + 2
  const bIdx = base + 6
  const gSharpOffset = base + 4 // black key on the right edge of G

  const blackKeys: { offset: number; pressed: boolean }[] = []
  for (let i = 0; i < whiteKeys - 1; i++) {
    if (BLACK_AFTER.has(i % 7)) {
      blackKeys.push({ offset: i, pressed: i === gSharpOffset })
    }
  }

  // Bars sit over the chord notes. `whiteIdx` is for white keys; the black bar
  // uses `blackOffset` (matches a black key's offset). Order = E, G#, B so the
  // per-bar heights in CSS (:nth-child) line up.
  const bars = [
    { key: 'E', whiteIdx: eIdx, accent: false },
    { key: 'G#', blackOffset: gSharpOffset, accent: true },
    { key: 'B', whiteIdx: bIdx, accent: false }
  ]

  return { pressedWhites: new Set([eIdx, bIdx]), blackKeys, bars }
}

export function MidiVisualizerCover() {
  const ref = useRef<HTMLDivElement>(null)
  const [whiteKeys, setWhiteKeys] = useState(14)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const w = el.clientWidth
      if (!w) return
      const n = Math.round(w / TARGET_KEY_PX)
      setWhiteKeys(Math.max(MIN_WHITE_KEYS, Math.min(MAX_WHITE_KEYS, n)))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { pressedWhites, blackKeys, bars } = buildKeyboard(whiteKeys)
  const whiteWidthPct = 100 / whiteKeys
  const blackWidthPct = whiteWidthPct * 0.6

  return (
    <div className={styles.cover} aria-hidden='true' ref={ref}>
      <div className={styles.bars}>
        {bars.map((bar, i) => {
          const isBlack = bar.blackOffset != null
          // Bar width matches key width exactly so each bar reads as the
          // key's note rising up.
          const barWidth = isBlack ? blackWidthPct : whiteWidthPct
          const center = isBlack
            ? (bar.blackOffset! + 1) * whiteWidthPct
            : bar.whiteIdx! * whiteWidthPct + whiteWidthPct / 2
          const left = center - barWidth / 2
          return (
            <div
              key={i}
              className={[styles.bar, bar.accent ? styles.barAccent : ''].join(
                ' '
              )}
              style={
                {
                  left: `${left}%`,
                  width: `${barWidth}%`,
                  // Corner radius in cqw (= % of cover width); ~1/4 the bar
                  // width for a gently rounded note rather than a full pill.
                  '--r': `${barWidth / 4}cqw`
                } as CSSProperties
              }
            />
          )
        })}
      </div>
      <div className={styles.piano}>
        <div className={styles.whiteRow}>
          {Array.from({ length: whiteKeys }).map((_, i) => (
            <div
              key={i}
              className={[
                styles.white,
                pressedWhites.has(i) ? styles.whitePressed : ''
              ].join(' ')}
            />
          ))}
        </div>
        {blackKeys.map((bk, i) => {
          const left = (bk.offset + 1) * whiteWidthPct - blackWidthPct / 2
          return (
            <div
              key={i}
              className={[
                styles.black,
                bk.pressed ? styles.blackPressed : ''
              ].join(' ')}
              style={{ left: `${left}%`, width: `${blackWidthPct}%` }}
            />
          )
        })}
      </div>
    </div>
  )
}
