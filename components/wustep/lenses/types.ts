import type * as React from 'react'

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — Lenses
 *
 * Read top-to-bottom. Each `at` is ms after the page mounts.
 *
 *    0ms   waiting for mount
 *   60ms   canvas fades in (opacity 0 → 1)
 *  180ms   center "Lenses" card scales 0.9 → 1 (ease-spring)
 *  280ms   surrounding cards begin staggering in:
 *            • by row (top → bottom), 90ms per row
 *            • inside each row, 22ms per column
 *            • full reveal wraps in ~640ms
 *
 * ── User interactions ─────────────────────────────────────
 *  hover card        scale 0.92 → 1.13, lift 14px, accent ring
 *  click center      open index dialog (scale 0.96 → 1, 280ms)
 *  click side card   open side panel (slide from right, 340ms)
 *  swap inside panel cross-fade body 220ms; hero color 280ms
 *
 * All timings live in TIMING and DURATION below — no magic
 * numbers in JSX or component bodies.
 * ───────────────────────────────────────────────────────── */
/* Per-row / per-col stagger ms. Halved from the original
   90 / 22 because this is a home page — Emil's frequency
   principle says repeat-viewers shouldn't pay a long stagger.
   At 4 rows × 8 cols the last card now lands ~276ms after the
   first instead of ~540ms, so the deck reads as "one motion"
   rather than a sequence. The very first visit per session
   still uses these timings; subsequent visits within the same
   session skip the entrance entirely (see LensesPage.tsx). */
export const TIMING = {
  canvasIn: 60,
  centerIn: 180,
  cardsInBase: 280,
  rowStaggerMs: 45,
  colStaggerMs: 12
} as const

export const DURATION = {
  canvasFade: 700,
  cardEntrance: 600,
  cardTransform: 320,
  panelSlide: 340,
  panelFade: 200,
  dialogScale: 280,
  bodyFade: 220
} as const

/** Spatial constants that the canvas uses to stagger cards by row+col.
 *  Cards' `y` values come from a 4-row grid at 12/38/62/88, and `x`
 *  from an 8-column grid at 6/19/31/44/56/69/81/94 — eight cards
 *  spaced at uniform 12.5% intervals. The deck grew past what six
 *  columns could hold, and the wider canvas leans into the
 *  "looking through many lenses" thesis: the eye picks up two
 *  edge cards on either side, and the rest unfold inward. */
export const GRID = {
  rowAnchors: [12, 38, 62, 88],
  colAnchors: [6.25, 18.75, 31.25, 43.75, 56.25, 68.75, 81.25, 93.75]
} as const

export type IllustrationId =
  | 'second-order'
  | 'evo-psych'
  | 'minimalism'
  | 'utility'
  | 'status'
  | 'incentives'
  | 'game-theory'
  | 'systems'
  | 'headspace'
  | 'legibility'
  | 'narrative'
  | 'constraint'
  | 'interface'
  | 'energy'
  | 'epistemic'
  | 'osmosis'
  | 'probabilistic'
  | 'communication'
  | 'mimetics'
  | 'primitives'
  | 'projection'
  | 'attention'
  | 'dopamine'
  | 'taste'
  | 'agency'
  | 'expertise'
  | 'self-fulfilling'
  | 'momentum'
  | 'identity'
  | 'lenses-deck'

export type Reading = {
  /** Human-readable label, e.g. "Thinking in Systems — Donella Meadows". */
  label: string
  /** Destination URL (internal path or external link). */
  href: string
}

export type Quote = {
  /** The quotation, rendered as a pull-quote below the readings list.
   *  No surrounding quote marks needed — the styling supplies the
   *  visual treatment (accent rule + indent). */
  text: string
  /** Optional attribution, e.g. an author and/or book title. */
  cite?: string
  /** Optional source URL for the attribution — when set, the cite
   *  renders as a link (with an external/internal arrow), so a quote
   *  can carry its own reading reference instead of a separate entry. */
  citeHref?: string
}

export type Lens = {
  id: string
  category: string
  title: string
  tagline: string
  /** Card position on the virtual canvas: 0–100 (center of card). */
  x: number
  y: number
  bg: string
  fg: string
  accent?: string
  /** Illustration key. For the wustep deck this is an `IllustrationId`
   *  resolved by `illustrations.tsx`; other decks (e.g. the Claude decks
   *  under ./llms) resolve arbitrary keys through their own deck-level
   *  `Illustration` component, so the shared type stays a plain string. */
  illustration: string
  /** Markdown body (compiled from lenses.md). Render with <LensBody />. */
  body: string
  related?: string[]
  /** Optional further-reading list rendered above the related lenses. */
  readings?: Reading[]
  /** Optional pull-quote, rendered below the readings list. */
  quote?: Quote
}

export type LensPreviewOverride = {
  lensId: string
  panelOpen?: boolean
  onPanelOpenChange?: (open: boolean) => void
  palette: {
    bg: string
    fg: string
    accent: string
  }
  renderIllustration: (palette: {
    bg: string
    fg: string
    accent: string
  }) => React.ReactNode
}

export type LensesPageProps = {
  embedded?: boolean
  dismissPanelOnOutside?: boolean
  previewOverride?: LensPreviewOverride
}

/** Animation stage. A single integer drives the whole entrance — no
 *  scattered booleans. Components check `stage >= N` so stages are
 *  additive. */
export const STAGE = {
  hidden: 0,
  canvas: 1,
  center: 2,
  cards: 3
} as const

export type Stage = (typeof STAGE)[keyof typeof STAGE]
