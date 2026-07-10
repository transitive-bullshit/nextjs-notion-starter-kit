'use client'

import * as React from 'react'

import { usePlaygroundTheme } from '@/components/wustep/PlaygroundLayout'

import type { IllustrationId, Lens } from './types'
import { Illustration } from './illustrations'
import { LAB_ILLUSTRATION_CANDIDATES } from './LensesIllustrationCandidates'
import styles from './LensesIllustrationLab.module.css'
import { LensesPage } from './LensesPage'
import cardStyles from './LensesPage.module.css'
import { LENSES } from './registry'

type Palette = {
  bg: string
  fg: string
  accent: string
}

type Playback = 'idle' | 'playing' | 'paused'

type LabMode = 'production' | 'candidate'

type GridMode = 'shared' | 'production'

type LabSnapshot = {
  selectedKey: string
  palette: Palette
}

type LabIllustration = {
  /** Unique select-key. Production = lens illustration id. Candidate = `${lensId}:${candidateId}`. */
  key: string
  /** Underlying lens illustration id (used for animations + mapping back). */
  illustrationId: IllustrationId
  /** Short option label shown in the select. */
  optionLabel: string
  /** Card label used inside preview cards. */
  cardLabel: string
  /** Palette tied to this entry — production lens palette OR the lens that owns the candidate. */
  ownerPalette: Palette
  /** Lens that owns this entry (used for tagline/title in the preview readout). */
  ownerLens: Lens
  /** Whether this entry comes from the lab-only candidate registry. */
  candidate: boolean
  /** Optional notes from the candidate registry. */
  notes?: string
  /** Render the SVG body inside a card with the given palette. */
  render: (palette: Palette) => React.ReactNode
}

const PRESET_PALETTES: Palette[] = [
  { bg: '#B83D31', fg: '#F6EAD8', accent: '#F3C35F' },
  { bg: '#24496A', fg: '#F6EAD8', accent: '#E6B64E' },
  { bg: '#24704A', fg: '#F6EAD8', accent: '#BDE08E' },
  { bg: '#EAD9B5', fg: '#1B2530', accent: '#B83D31' },
  { bg: '#2F333E', fg: '#F6EAD8', accent: '#E2AB3F' },
  { bg: '#5146A6', fg: '#F6EAD8', accent: '#F07064' }
]

/** Matrix palettes: kept at exactly 12 so the grid is two clean rows of six. */
const MATRIX_COLOR_CANDIDATES: Array<{ label: string; palette: Palette }> = [
  { label: 'Agency red', palette: PRESET_PALETTES[0]! },
  { label: 'Deep blue', palette: PRESET_PALETTES[1]! },
  { label: 'Forest', palette: PRESET_PALETTES[2]! },
  { label: 'Warm light', palette: PRESET_PALETTES[3]! },
  { label: 'Charcoal', palette: PRESET_PALETTES[4]! },
  { label: 'Identity violet', palette: PRESET_PALETTES[5]! },
  {
    label: 'Ink',
    palette: { bg: '#172A3A', fg: '#F6EAD8', accent: '#F0A85A' }
  },
  {
    label: 'Paper',
    palette: { bg: '#EAD9B5', fg: '#1B2530', accent: '#B83D31' }
  },
  {
    label: 'Moss',
    palette: { bg: '#227449', fg: '#F6EAD8', accent: '#BDE08E' }
  },
  {
    label: 'Plum',
    palette: { bg: '#60407A', fg: '#F6EAD8', accent: '#F0A86B' }
  },
  {
    label: 'Ochre',
    palette: { bg: '#E5C052', fg: '#1B2530', accent: '#C73B2D' }
  },
  {
    label: 'Stone',
    palette: { bg: '#596B81', fg: '#F6EAD8', accent: '#E6B64E' }
  }
]

const LENSES_DECK_ILLUSTRATION_ID = 'lenses-deck' satisfies IllustrationId

const LENSES_DECK_LENS: Lens = {
  id: 'lenses-deck',
  category: 'Index',
  title: 'Lenses',
  tagline: 'A way of looking. Pick one. Try it on.',
  x: 50,
  y: 50,
  bg: '#172A3A',
  fg: '#F6EAD8',
  accent: '#F0A85A',
  illustration: LENSES_DECK_ILLUSTRATION_ID,
  body: 'The center card is the index for the whole deck: a compact visual system for choosing how to look at a question.'
}

const MOMENTUM_ILLUSTRATION_ID = 'momentum' satisfies IllustrationId

/** Momentum was retired from the production deck (replaced by
 *  Self-fulfilling prophecy). It's kept as a lab-only candidate (see
 *  LensesIllustrationCandidates), so it never rejoins the production
 *  library or `LENSES` — but it still needs a synthetic lens here so
 *  that candidate can resolve its palette, title, and tagline. */
const MOMENTUM_LENS: Lens = {
  id: 'momentum',
  category: 'Strategy',
  title: 'Momentum',
  tagline: 'Easier to steer motion than to start it.',
  x: 50,
  y: 50,
  bg: '#227449',
  fg: '#F6EAD8',
  accent: '#F0A86B',
  illustration: MOMENTUM_ILLUSTRATION_ID,
  body: 'Retired from the deck — kept in the lab as a selectable illustration.'
}

/* Lens.illustration is a plain string in the shared deck contract; the
   lab is wustep-deck-only, where every key is a valid IllustrationId
   (enforced by the illustrations.tsx switchboard). */
const UNIQUE_ILLUSTRATIONS: IllustrationId[] = Array.from(
  new Set<IllustrationId>([
    ...LENSES.map((lens) => lens.illustration as IllustrationId),
    LENSES_DECK_ILLUSTRATION_ID
  ])
).toSorted((a, b) => a.localeCompare(b))

const FIRST_LENS_FOR_ILLUSTRATION = new Map<IllustrationId, Lens>()
for (const lens of LENSES) {
  const id = lens.illustration as IllustrationId
  if (!FIRST_LENS_FOR_ILLUSTRATION.has(id)) {
    FIRST_LENS_FOR_ILLUSTRATION.set(id, lens)
  }
}
FIRST_LENS_FOR_ILLUSTRATION.set(LENSES_DECK_ILLUSTRATION_ID, LENSES_DECK_LENS)
FIRST_LENS_FOR_ILLUSTRATION.set(MOMENTUM_ILLUSTRATION_ID, MOMENTUM_LENS)

function titleLengthBucket(title: string): 'long-word' | 'long' | undefined {
  const words = title.split(/\s+/)
  const longestWord = words.reduce((max, word) => Math.max(word.length, max), 0)
  if (words.length === 1 && longestWord > 11) return 'long-word'
  if (title.length > 18) return 'long'
  return undefined
}

function hexToRgb(hex: string) {
  const value = hex.replace('#', '')
  const parsed = Number.parseInt(
    value.length === 3
      ? value
          .split('')
          .map((c) => c + c)
          .join('')
      : value,
    16
  )

  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255
  }
}

function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  const channels = [r, g, b].map((channel) => {
    const c = channel / 255
    return c <= 0.039_28 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!
}

function readableFg(bg: string) {
  return luminance(bg) > 0.48 ? '#1B2530' : '#F6EAD8'
}

function hslToHex(h: number, s: number, l: number) {
  const chroma = (1 - Math.abs(2 * l - 1)) * s
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - chroma / 2
  const [r1, g1, b1] =
    h < 60
      ? [chroma, x, 0]
      : h < 120
        ? [x, chroma, 0]
        : h < 180
          ? [0, chroma, x]
          : h < 240
            ? [0, x, chroma]
            : h < 300
              ? [x, 0, chroma]
              : [chroma, 0, x]

  const toHex = (value: number) =>
    Math.round((value + m) * 255)
      .toString(16)
      .padStart(2, '0')

  return `#${toHex(r1)}${toHex(g1)}${toHex(b1)}`.toUpperCase()
}

/** Minimum bg/fg contrast we'll accept from `randomPalette` — matches
 *  the 4.5:1 threshold the readout already grades against, so the
 *  randomize button can never produce a card that gets flagged. */
const MIN_RANDOM_CONTRAST = 4.5

function rollRandomPalette(): Palette {
  const hue = Math.floor(Math.random() * 360)
  const bg = hslToHex(
    hue,
    0.48 + Math.random() * 0.18,
    0.28 + Math.random() * 0.28
  )
  const fg = readableFg(bg)
  const accent = hslToHex(
    (hue + 55 + Math.random() * 95) % 360,
    0.55 + Math.random() * 0.22,
    fg === '#F6EAD8' ? 0.66 + Math.random() * 0.14 : 0.38 + Math.random() * 0.16
  )

  return { bg, fg, accent }
}

function randomPalette(): Palette {
  // Resample until the bg/fg pair clears the contrast threshold.
  // Capped so a pathological luminance window can't loop forever; if
  // we exhaust the budget, fall back to the highest-contrast roll.
  const MAX_ATTEMPTS = 24
  let best = rollRandomPalette()
  let bestContrast = contrastRatio(best.bg, best.fg)
  if (bestContrast >= MIN_RANDOM_CONTRAST) return best

  for (let attempt = 1; attempt < MAX_ATTEMPTS; attempt++) {
    const next = rollRandomPalette()
    const ratio = contrastRatio(next.bg, next.fg)
    if (ratio >= MIN_RANDOM_CONTRAST) return next
    if (ratio > bestContrast) {
      best = next
      bestContrast = ratio
    }
  }
  return best
}

function contrastRatio(a: string, b: string) {
  const l1 = luminance(a)
  const l2 = luminance(b)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i
const COLOR_INPUT_LIGHT_BG = '#F6EAD8'
const COLOR_INPUT_DARK_BG = '#1B2530'
const MIN_COLOR_INPUT_CONTRAST = 4.5

function colorInputTone(value: string): 'light' | 'dark' | undefined {
  if (!HEX_COLOR_PATTERN.test(value)) return undefined

  const lightContrast = contrastRatio(value, COLOR_INPUT_LIGHT_BG)
  const darkContrast = contrastRatio(value, COLOR_INPUT_DARK_BG)

  if (
    lightContrast >= MIN_COLOR_INPUT_CONTRAST &&
    lightContrast >= darkContrast
  ) {
    return 'light'
  }

  if (darkContrast >= MIN_COLOR_INPUT_CONTRAST) return 'dark'
  return lightContrast > darkContrast ? 'light' : 'dark'
}

function paletteFromLens(lens: Lens): Palette {
  return {
    bg: lens.bg,
    fg: lens.fg,
    accent: lens.accent ?? lens.fg
  }
}

/* ────────────────────────────────────────────────────────────────────
 * LabIllustration registry
 *
 *   Production entries map 1:1 to the IllustrationId switchboard.
 *   Candidate entries come from LensesIllustrationCandidates and
 *   share their owner lens's palette + name so they read as concrete
 *   alternatives to that lens's production art rather than abstract
 *   sketches.
 * ─────────────────────────────────────────────────────────────────── */
const PRODUCTION_LAB_ILLUSTRATIONS: LabIllustration[] =
  UNIQUE_ILLUSTRATIONS.map((illustrationId) => {
    const lens = FIRST_LENS_FOR_ILLUSTRATION.get(illustrationId) ?? LENSES[0]!
    return {
      key: illustrationId,
      illustrationId,
      optionLabel: illustrationId,
      cardLabel: lens.title,
      ownerPalette: paletteFromLens(lens),
      ownerLens: lens,
      candidate: false,
      render: (palette: Palette) => (
        <Illustration
          id={illustrationId}
          fg={palette.fg}
          bg={palette.bg}
          accent={palette.accent}
        />
      )
    }
  })

const CANDIDATE_LAB_ILLUSTRATIONS: LabIllustration[] =
  LAB_ILLUSTRATION_CANDIDATES.map((candidate) => {
    const lens = FIRST_LENS_FOR_ILLUSTRATION.get(candidate.lensId) ?? LENSES[0]!
    return {
      key: `${candidate.lensId}:${candidate.id}`,
      illustrationId: candidate.lensId,
      optionLabel: `${candidate.lensId} · ${candidate.label}`,
      cardLabel: candidate.label,
      ownerPalette: paletteFromLens(lens),
      ownerLens: lens,
      candidate: true,
      notes: candidate.notes,
      render: (palette: Palette) => candidate.render(palette)
    }
  })

const ALL_LAB_ILLUSTRATIONS = [
  ...PRODUCTION_LAB_ILLUSTRATIONS,
  ...CANDIDATE_LAB_ILLUSTRATIONS
]

const LAB_ILLUSTRATION_BY_KEY = new Map(
  ALL_LAB_ILLUSTRATIONS.map((entry) => [entry.key, entry])
)

const ILLUSTRATIONS_WITH_CANDIDATES = new Set(
  CANDIDATE_LAB_ILLUSTRATIONS.map((entry) => entry.illustrationId)
)

const FLOATING_CONTROLS_TOP_OFFSET = 24
const FLOATING_CONTROLS_MIN_VIEWPORT_WIDTH = 980
const LAB_CONTROLS_COMPACT_WIDTH = 760
const RECENT_RANDOM_SELECTION_LIMIT = 10

function contentBoxWidth(element: HTMLElement) {
  const styles = window.getComputedStyle(element)
  const padding =
    Number.parseFloat(styles.paddingLeft) +
    Number.parseFloat(styles.paddingRight)
  return element.getBoundingClientRect().width - padding
}

export function LensesIllustrationLab() {
  const [labMode, setLabMode] = React.useState<LabMode>('production')
  const [selectedKey, setSelectedKey] = React.useState<string>(
    PRODUCTION_LAB_ILLUSTRATIONS[0]!.key
  )
  const playgroundTheme = usePlaygroundTheme()
  const labRef = React.useRef<HTMLDivElement>(null)
  const controlsAnchorRef = React.useRef<HTMLDivElement>(null)
  const [playback, setPlayback] = React.useState<Playback>('playing')
  const [controlsFloating, setControlsFloating] = React.useState(false)
  const [controlsStickyEnabled, setControlsStickyEnabled] =
    React.useState(false)
  const [controlsCollapsed, setControlsCollapsed] = React.useState(false)
  const [palette, setPalette] = React.useState<Palette>(() =>
    paletteFromLens(LENSES[0]!)
  )
  const [gridMode, setGridMode] = React.useState<GridMode>('production')
  const [undoStack, setUndoStack] = React.useState<LabSnapshot[]>([])
  const [recentRandomSelectionKeys, setRecentRandomSelectionKeys] =
    React.useState<string[]>([])

  const visibleEntries = React.useMemo(
    () =>
      labMode === 'candidate'
        ? CANDIDATE_LAB_ILLUSTRATIONS
        : PRODUCTION_LAB_ILLUSTRATIONS,
    [labMode]
  )

  const matrixCandidates = React.useMemo(() => {
    if (labMode !== 'candidate') return CANDIDATE_LAB_ILLUSTRATIONS
    const owner = LAB_ILLUSTRATION_BY_KEY.get(selectedKey)
    if (!owner) return CANDIDATE_LAB_ILLUSTRATIONS
    const sameLens = ALL_LAB_ILLUSTRATIONS.filter(
      (entry) => entry.illustrationId === owner.illustrationId
    )
    return sameLens.length > 0 ? sameLens : CANDIDATE_LAB_ILLUSTRATIONS
  }, [labMode, selectedKey])

  const selected =
    LAB_ILLUSTRATION_BY_KEY.get(selectedKey) ?? PRODUCTION_LAB_ILLUSTRATIONS[0]!

  React.useEffect(() => {
    if (!visibleEntries.some((entry) => entry.key === selectedKey)) {
      setSelectedKey(visibleEntries[0]?.key ?? selected.key)
    }
  }, [visibleEntries, selectedKey, selected.key])

  const recordUndo = React.useCallback(
    () =>
      setUndoStack((stack) => [
        ...stack,
        {
          selectedKey,
          palette
        }
      ]),
    [palette, selectedKey]
  )

  const randomize = React.useCallback(() => {
    recordUndo()
    setPalette(randomPalette())
  }, [recordUndo])

  const randomizeSelection = React.useCallback(() => {
    const visibleKeys = new Set(visibleEntries.map((entry) => entry.key))
    const recentKeys = new Set(
      recentRandomSelectionKeys.filter((key) => visibleKeys.has(key))
    )
    const freshEntries = visibleEntries.filter(
      (entry) => entry.key !== selectedKey && !recentKeys.has(entry.key)
    )
    const fallbackEntries = visibleEntries.filter(
      (entry) => entry.key !== selectedKey
    )
    const nextEntries = freshEntries.length > 0 ? freshEntries : fallbackEntries
    const nextEntry =
      nextEntries[Math.floor(Math.random() * nextEntries.length)]
    if (!nextEntry) return

    recordUndo()
    setSelectedKey(nextEntry.key)
    setRecentRandomSelectionKeys((keys) =>
      [
        nextEntry.key,
        selectedKey,
        ...keys.filter((key) => key !== nextEntry.key)
      ]
        .filter((key, index, array) => array.indexOf(key) === index)
        .filter((key) => visibleKeys.has(key))
        .slice(0, RECENT_RANDOM_SELECTION_LIMIT)
    )
  }, [recentRandomSelectionKeys, recordUndo, selectedKey, visibleEntries])

  const selectCard = React.useCallback(
    (nextKey: string, nextPalette: Palette) => {
      const selectionChanged = nextKey !== selectedKey
      const paletteChanged =
        nextPalette.bg !== palette.bg ||
        nextPalette.fg !== palette.fg ||
        nextPalette.accent !== palette.accent

      if (!selectionChanged && !paletteChanged) return

      recordUndo()
      setSelectedKey(nextKey)
      setPalette(nextPalette)
    },
    [palette, recordUndo, selectedKey]
  )

  const undo = React.useCallback(() => {
    setUndoStack((stack) => {
      const previous = stack.at(-1)
      if (!previous) return stack

      setSelectedKey(previous.selectedKey)
      setPalette(previous.palette)
      return stack.slice(0, -1)
    })
  }, [])

  const resetPreview = React.useCallback(() => {
    setLabMode('production')
    setSelectedKey(selected.illustrationId)
    setPalette(selected.ownerPalette)
  }, [selected.illustrationId, selected.ownerPalette])

  const palettesMatch =
    palette.bg === selected.ownerPalette.bg &&
    palette.fg === selected.ownerPalette.fg &&
    palette.accent === selected.ownerPalette.accent
  const isProductionSelection = !selected.candidate

  React.useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const lab = labRef.current
      const controlsAnchor = controlsAnchorRef.current
      if (!lab || !controlsAnchor) return

      // Don't pin the controls on small / no-hover screens — the
      // floating panel covers content that's already cramped, and
      // there's no hover affordance to dismiss it.
      const viewportTooNarrow =
        window.innerWidth <= FLOATING_CONTROLS_MIN_VIEWPORT_WIDTH
      const noHover = window.matchMedia(
        '(hover: none), (pointer: coarse)'
      ).matches
      const labTooNarrow = contentBoxWidth(lab) <= LAB_CONTROLS_COMPACT_WIDTH
      const stickyEnabled = !viewportTooNarrow && !noHover && !labTooNarrow

      setControlsStickyEnabled(stickyEnabled)
      if (!stickyEnabled) {
        setControlsFloating(false)
        setControlsCollapsed(false)
        return
      }

      const { top } = controlsAnchor.getBoundingClientRect()
      setControlsFloating(top <= FLOATING_CONTROLS_TOP_OFFSET)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    const resizeObserver = new ResizeObserver(onScroll)
    const observedLab = labRef.current
    const observedAnchor = controlsAnchorRef.current
    if (observedLab) resizeObserver.observe(observedLab)
    if (observedAnchor) resizeObserver.observe(observedAnchor)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      resizeObserver.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const selectedContrast = contrastRatio(palette.bg, palette.fg)

  const matrixPalettes = [
    { label: 'Current', palette },
    { label: 'Owner', palette: selected.ownerPalette },
    ...MATRIX_COLOR_CANDIDATES
  ].slice(0, 12)

  const controlProps = {
    labMode,
    onLabModeChange: setLabMode,
    selectedKey,
    onSelectedKeyChange: setSelectedKey,
    visibleEntries,
    palette,
    onPaletteChange: setPalette,
    playback,
    onPlaybackChange: setPlayback,
    onRandomizeSelection: randomizeSelection,
    canRandomizeSelection: visibleEntries.length > 1,
    onRandomize: randomize,
    onReset: resetPreview,
    canReset: !palettesMatch || !isProductionSelection,
    onUndo: undo,
    canUndo: undoStack.length > 0,
    resetTargetLabel: selected.ownerLens.title,
    showHeader: controlsStickyEnabled,
    canCollapse: controlsStickyEnabled,
    collapsed: controlsCollapsed,
    onCollapsedChange: setControlsCollapsed
  } satisfies LabControlsProps

  const previewLens = selected.ownerLens
  const previewTitle = selected.candidate
    ? `${previewLens.title} · ${selected.cardLabel}`
    : previewLens.title
  const previewTagline = selected.candidate
    ? (selected.notes ?? previewLens.tagline)
    : previewLens.tagline
  const canvasTheme =
    playgroundTheme?.hasMounted && playgroundTheme.isDarkMode ? 'dark' : 'light'

  return (
    <div
      ref={labRef}
      className={styles.lab}
      data-theme={canvasTheme}
      data-animations={playback}
      data-mode={labMode}
    >
      <section className={styles.hero}>
        <div>
          <div className={styles.heroTopline}>
            <p className={styles.kicker}>Development</p>
          </div>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>Illustrations</h1>
          </div>
          <p className={styles.intro}>
            Test Lenses illustrations against real card colors, controlled
            palettes, and randomized color directions before moving changes into
            the production registry.
          </p>
        </div>

        <div
          ref={controlsAnchorRef}
          className={styles.controlsAnchor}
          data-floating={controlsFloating}
          aria-hidden={controlsFloating}
        >
          <LabControls
            {...controlProps}
            collapsed={controlsFloating ? false : controlsCollapsed}
          />
        </div>
      </section>

      {controlsFloating ? (
        <div className={styles.floatingControls}>
          <LabControls {...controlProps} />
        </div>
      ) : null}

      <section className={styles.previewPanel}>
        <div className={styles.largeCardWrap}>
          <PreviewCard
            title={selected.cardLabel}
            palette={palette}
            renderIllustration={selected.render}
            large
          />
        </div>
        <div className={styles.readout}>
          <h2>{previewTitle}</h2>
          <p>{previewTagline}</p>
          <dl>
            <div>
              <dt>bg</dt>
              <dd>{palette.bg}</dd>
            </div>
            <div>
              <dt>fg</dt>
              <dd>{palette.fg}</dd>
            </div>
            <div>
              <dt>accent</dt>
              <dd>{palette.accent}</dd>
            </div>
            <div>
              <dt>contrast</dt>
              <dd>{selectedContrast.toFixed(2)}:1</dd>
            </div>
          </dl>
          <p
            className={
              selectedContrast >= 4.5 ? styles.passMessage : styles.warnMessage
            }
          >
            {selectedContrast >= 4.5
              ? 'Foreground contrast passes normal text.'
              : 'Foreground contrast is low for title text.'}
          </p>
        </div>
      </section>

      {labMode === 'candidate' ? (
        <section className={`${styles.section} ${styles.matrixSection}`}>
          <div className={styles.sectionHeader}>
            <h2>Candidate Matrix · {selected.ownerLens.title}</h2>
          </div>
          <div className={styles.candidateMatrix}>
            {matrixCandidates.map((entry, index) => {
              const indexLabel = entry.candidate
                ? `${String.fromCodePoint(64 + index)} · ${entry.cardLabel}`
                : entry.cardLabel
              return (
                <article className={styles.matrixRow} key={entry.key}>
                  <div className={styles.matrixLabel}>
                    <h3>{indexLabel}</h3>
                    <p>
                      {entry.notes ??
                        (entry.candidate
                          ? 'Lab-only candidate.'
                          : 'Current registered illustration.')}
                    </p>
                  </div>
                  <div className={styles.matrixCards}>
                    {matrixPalettes.map((column) => {
                      const selectedCard =
                        entry.key === selectedKey &&
                        column.palette.bg === palette.bg &&
                        column.palette.fg === palette.fg &&
                        column.palette.accent === palette.accent
                      return (
                        <PreviewCard
                          key={`${entry.key}-${column.label}`}
                          title={column.label}
                          palette={column.palette}
                          renderIllustration={entry.render}
                          selected={selectedCard}
                          onClick={() => selectCard(entry.key, column.palette)}
                        />
                      )
                    })}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      ) : null}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Library</h2>
          <SegmentedToggle
            ariaLabel='Library palette mode'
            value={gridMode}
            onChange={setGridMode}
            options={[
              { value: 'production', label: 'Per-card palette' },
              { value: 'shared', label: 'Current palette' }
            ]}
          />
        </div>
        <div className={styles.grid}>
          {PRODUCTION_LAB_ILLUSTRATIONS.map((entry) => {
            const useCandidate =
              labMode === 'candidate' &&
              selected.candidate &&
              entry.illustrationId === selected.illustrationId
            // Library palette: shared mode applies the toolbar palette to
            // every card; per-card mode uses each entry's own palette,
            // except for the swapped candidate slot — that one always
            // honors the toolbar palette so the candidate reflects the
            // colors you're tuning.
            const cardPalette =
              gridMode === 'shared' || useCandidate
                ? palette
                : entry.ownerPalette
            const isSelected = useCandidate ? true : entry.key === selectedKey
            const renderFn = useCandidate ? selected.render : entry.render
            const cardTitle = useCandidate
              ? `${entry.cardLabel} · ${selected.cardLabel}`
              : entry.cardLabel
            const badge = useCandidate
              ? 'Candidate'
              : ILLUSTRATIONS_WITH_CANDIDATES.has(entry.illustrationId)
                ? 'Has candidates'
                : undefined
            return (
              <PreviewCard
                key={entry.key}
                title={cardTitle}
                palette={cardPalette}
                renderIllustration={renderFn}
                selected={isSelected}
                badge={badge}
                onClick={() => {
                  selectCard(
                    labMode === 'candidate' ? selectedKey : entry.key,
                    cardPalette
                  )
                }}
              />
            )
          })}
        </div>
      </section>

      <LensesPagePreview entry={selected} palette={palette} />
    </div>
  )
}

type LensesPagePreviewProps = {
  entry: LabIllustration
  palette: Palette
}

function LensesPagePreview({ entry, palette }: LensesPagePreviewProps) {
  const lens = entry.ownerLens
  const previewStageId = React.useId()
  const [panelOpen, setPanelOpen] = React.useState(true)
  const previewOverride = React.useMemo(
    () => ({
      lensId: lens.id,
      panelOpen,
      onPanelOpenChange: setPanelOpen,
      palette,
      renderIllustration: entry.render
    }),
    [entry.render, lens.id, palette, panelOpen]
  )

  return (
    <section className={`${styles.section} ${styles.sidePanelPreviewSection}`}>
      <div className={styles.sectionHeader}>
        <h2>Preview</h2>
        <button
          type='button'
          className={`${styles.buttonSecondary} ${styles.previewPanelToggle}`}
          data-lenses-preview-toggle
          onClick={() => setPanelOpen((open) => !open)}
          aria-controls={previewStageId}
          aria-expanded={panelOpen}
        >
          {panelOpen ? 'Collapse panel' : 'Show panel'}
        </button>
      </div>
      <div id={previewStageId} className={styles.sidePanelStage}>
        <LensesPage
          embedded
          dismissPanelOnOutside={false}
          previewOverride={previewOverride}
        />
      </div>
    </section>
  )
}

type ColorFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
}

type LabControlsProps = {
  labMode: LabMode
  onLabModeChange: React.Dispatch<React.SetStateAction<LabMode>>
  selectedKey: string
  onSelectedKeyChange: (key: string) => void
  visibleEntries: LabIllustration[]
  palette: Palette
  onPaletteChange: React.Dispatch<React.SetStateAction<Palette>>
  playback: Playback
  onPlaybackChange: React.Dispatch<React.SetStateAction<Playback>>
  onRandomizeSelection: () => void
  canRandomizeSelection: boolean
  onRandomize: () => void
  onReset: () => void
  canReset: boolean
  onUndo: () => void
  canUndo: boolean
  resetTargetLabel: string
  showHeader: boolean
  canCollapse: boolean
  collapsed: boolean
  onCollapsedChange: React.Dispatch<React.SetStateAction<boolean>>
}

function LabControls({
  labMode,
  onLabModeChange,
  selectedKey,
  onSelectedKeyChange,
  visibleEntries,
  palette,
  onPaletteChange,
  playback,
  onPlaybackChange,
  onRandomizeSelection,
  canRandomizeSelection,
  onRandomize,
  onReset,
  canReset,
  onUndo,
  canUndo,
  resetTargetLabel,
  showHeader,
  canCollapse,
  collapsed,
  onCollapsedChange
}: LabControlsProps) {
  const isCollapsed = canCollapse && collapsed

  return (
    <div
      className={styles.toolbar}
      data-collapsed={isCollapsed}
      aria-label='Palette controls'
    >
      {showHeader ? (
        <div className={styles.toolbarHeader}>
          <div className={styles.toolbarHeaderText}>
            <p className={styles.toolbarEyebrow}>Design panel</p>
            <p
              className={`${styles.toolbarSummary} ${
                isCollapsed ? '' : styles.toolbarSummaryHidden
              }`}
              aria-hidden={!isCollapsed}
            >
              {labMode === 'candidate' ? 'Candidates' : 'Production'} ·{' '}
              <span style={{ color: palette.bg }}>{palette.bg}</span>
              {' / '}
              <span style={{ color: palette.fg }}>{palette.fg}</span>
              {' / '}
              <span style={{ color: palette.accent }}>{palette.accent}</span>
            </p>
          </div>
          {canCollapse ? (
            <button
              type='button'
              className={`${styles.buttonSecondary} ${styles.toolbarToggle}`}
              onClick={() => onCollapsedChange((current) => !current)}
              aria-expanded={!isCollapsed}
            >
              {isCollapsed ? 'Expand' : 'Collapse'}
            </button>
          ) : null}
        </div>
      ) : null}

      {isCollapsed ? null : (
        <>
          <div className={styles.modeRow}>
            <SegmentedToggle
              ariaLabel='Lab mode'
              value={labMode}
              onChange={onLabModeChange}
              options={[
                { value: 'production', label: 'Production' },
                { value: 'candidate', label: 'Candidates' }
              ]}
            />
          </div>

          <label className={styles.field}>
            <span>
              {labMode === 'candidate' ? 'Candidate' : 'Illustration'}
            </span>
            <span className={styles.selectActionWrap}>
              <select
                value={selectedKey}
                onChange={(event) => onSelectedKeyChange(event.target.value)}
              >
                {visibleEntries.map((entry) => (
                  <option key={entry.key} value={entry.key}>
                    {entry.optionLabel}
                  </option>
                ))}
              </select>
              <button
                type='button'
                className={styles.iconButton}
                onClick={onRandomizeSelection}
                disabled={!canRandomizeSelection}
                aria-label={`Randomize ${labMode === 'candidate' ? 'candidate' : 'illustration'}`}
                title={`Randomize ${labMode === 'candidate' ? 'candidate' : 'illustration'}`}
              >
                <ShuffleIcon />
              </button>
            </span>
          </label>

          <ColorField
            label='Background'
            value={palette.bg}
            onChange={(bg) =>
              onPaletteChange((current) => ({ ...current, bg }))
            }
          />
          <ColorField
            label='Foreground'
            value={palette.fg}
            onChange={(fg) =>
              onPaletteChange((current) => ({ ...current, fg }))
            }
          />
          <ColorField
            label='Accent'
            value={palette.accent}
            onChange={(accent) =>
              onPaletteChange((current) => ({ ...current, accent }))
            }
          />

          <div className={styles.actionRow}>
            <button
              type='button'
              className={styles.button}
              onClick={onRandomize}
            >
              Randomize palette
            </button>
            <button
              type='button'
              className={styles.buttonSecondary}
              onClick={onUndo}
              disabled={!canUndo}
              title='Undo last randomize or card selection'
            >
              Undo
            </button>
            <button
              type='button'
              className={styles.buttonSecondary}
              onClick={onReset}
              disabled={!canReset}
              title={`Reset to production preview for ${resetTargetLabel}`}
            >
              Reset
            </button>
            <button
              type='button'
              className={styles.iconButton}
              onClick={() =>
                onPlaybackChange((state) =>
                  state === 'playing' ? 'paused' : 'playing'
                )
              }
              aria-label={
                playback === 'playing'
                  ? 'Pause all illustrations'
                  : 'Play all illustrations'
              }
              aria-pressed={playback === 'playing'}
              title={
                playback === 'playing'
                  ? 'Pause all illustrations'
                  : 'Play all illustrations'
              }
            >
              {playback === 'playing' ? <PauseIcon /> : <PlayIcon />}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function ColorField({ label, value, onChange }: ColorFieldProps) {
  const inputTone = colorInputTone(value)

  return (
    <label className={styles.field}>
      <span>{label}</span>
      <span className={styles.colorInputWrap}>
        <input
          type='color'
          value={value}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          aria-label={label}
        />
        <input
          type='text'
          value={value}
          onChange={(event) => onChange(event.target.value)}
          maxLength={7}
          spellCheck={false}
          style={{ color: value }}
          data-input-tone={inputTone}
          aria-label={`${label} hex`}
        />
      </span>
    </label>
  )
}

type SegmentedToggleProps<T extends string> = {
  ariaLabel: string
  value: T
  onChange: (next: T) => void
  options: Array<{ value: T; label: string }>
}

function SegmentedToggle<T extends string>({
  ariaLabel,
  value,
  onChange,
  options
}: SegmentedToggleProps<T>) {
  return (
    <div className={styles.segmented} role='radiogroup' aria-label={ariaLabel}>
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type='button'
            role='radio'
            aria-checked={isActive}
            className={`${styles.segmentedOption} ${
              isActive ? styles.segmentedOptionActive : ''
            }`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

function PlayIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      <path d='M8 5.5v13l10-6.5-10-6.5Z' fill='currentColor' />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      <path
        d='M7 5.5h3.5v13H7v-13Zm6.5 0H17v13h-3.5v-13Z'
        fill='currentColor'
      />
    </svg>
  )
}

function ShuffleIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      <path
        d='M4 7h3.5c2.8 0 4.2 2 5.6 5s2.8 5 5.4 5H20M17 14l3 3-3 3M4 17h3.5c1.5 0 2.6-.6 3.6-1.7M17 4l3 3-3 3M13.4 8.8C14.8 7.7 16.2 7 18.5 7H20'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

type PreviewCardProps = {
  title: string
  illustration?: IllustrationId
  renderIllustration?: (palette: Palette) => React.ReactNode
  palette: Palette
  selected?: boolean
  large?: boolean
  badge?: string
  onClick?: () => void
}

function PreviewCard({
  title,
  illustration,
  renderIllustration,
  palette,
  selected,
  large,
  badge,
  onClick
}: PreviewCardProps) {
  const titleBucket = titleLengthBucket(title)
  const content = (
    <>
      <span className={`${styles.cardArt} ${cardStyles.cardArt}`}>
        {renderIllustration ? (
          renderIllustration(palette)
        ) : illustration ? (
          <Illustration
            id={illustration}
            fg={palette.fg}
            bg={palette.bg}
            accent={palette.accent}
          />
        ) : null}
      </span>
      <span className={styles.cardTitle}>
        <span className={styles.cardTitleClamp}>{title}</span>
      </span>
      {badge ? <span className={styles.cardBadge}>{badge}</span> : null}
    </>
  )

  const className = [
    styles.card,
    selected && styles.cardSelected,
    large && styles.cardLarge,
    onClick && styles.cardButton
  ]
    .filter(Boolean)
    .join(' ')

  const style = {
    '--lab-card-bg': palette.bg,
    '--lab-card-fg': palette.fg,
    '--lab-card-accent': palette.accent,
    '--card-bg': palette.bg,
    '--card-fg': palette.fg,
    '--card-accent': palette.accent
  } as React.CSSProperties

  if (!onClick) {
    return (
      <div className={className} style={style} data-title-length={titleBucket}>
        {content}
      </div>
    )
  }

  return (
    <button
      type='button'
      className={className}
      style={style}
      onClick={onClick}
      data-title-length={titleBucket}
    >
      {content}
    </button>
  )
}
