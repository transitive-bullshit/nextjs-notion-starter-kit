import { LENSES } from './registry'
import { GRID } from './types'

/* ────────────────────────────────────────────────────────────────
 * Arrow-key navigation across the canvas of lenses.
 *
 *   Two different traversal models, both with wrap-around so a
 *   key press never feels like a dead end:
 *
 *   ← / →  Reading order. Cards are sorted into rows (by quantizing
 *          y to the nearest row anchor) and then by x within a row.
 *          The arrow steps to the next card in that flat sequence
 *          and *wraps* across row ends — like a book.
 *
 *   ↑ / ↓  Spatial neighbor in the half-plane above/below the
 *          current card, weighting horizontal distance 2× harder
 *          than vertical so the result feels like "the card
 *          directly above/below," not a diagonal jump. When there
 *          is no card in the requested half-plane (you're at the
 *          top row pressing ↑, or the bottom row pressing ↓), we
 *          *wrap*: jump to the column-nearest card on the opposite
 *          end of the deck.
 *
 *   Used by both the canvas (move the keyboard cursor / focus the
 *   next card button) and the side panel (swap to the next lens).
 * ──────────────────────────────────────────────────────────────── */

export type Direction = 'left' | 'right' | 'up' | 'down'

type Anchor = { x: number; y: number }

/** Center of the "Lenses" card on the canvas. */
const CENTER_ANCHOR: Anchor = { x: 50, y: 50 }

const PERP_WEIGHT = 2

/** Quantize a y-coordinate to the nearest row anchor index, so two
 *  lenses on the same visual row group together regardless of any
 *  small per-card y jitter. */
function rowOf(y: number): number {
  let bestIdx = 0
  let bestDist = Number.POSITIVE_INFINITY
  for (const [idx, anchor] of GRID.rowAnchors.entries()) {
    const d = Math.abs(y - anchor)
    if (d < bestDist) {
      bestDist = d
      bestIdx = idx
    }
  }
  return bestIdx
}

/** Cards in reading order: row by row, left to right within a row. */
const READING_ORDER: readonly string[] = LENSES.toSorted((a, b) => {
  const ra = rowOf(a.y)
  const rb = rowOf(b.y)
  if (ra !== rb) return ra - rb
  return a.x - b.x
}).map((l) => l.id)

/**
 * Find the next lens to navigate to from `fromId` in `direction`.
 *
 *   - left/right walks `READING_ORDER` and wraps at either end.
 *   - up/down picks the spatial neighbor in that half-plane.
 *
 * If `fromId` is null, navigation starts from the canvas center —
 * which gives the canvas-arrow-with-no-focus case a sensible seed.
 */
export function neighborInDirection(
  fromId: string | null,
  direction: Direction
): string | null {
  // Reading-order traversal for horizontal arrows.
  if (direction === 'left' || direction === 'right') {
    if (READING_ORDER.length === 0) return null

    // From the canvas center (no current selection): seed at the
    // start of reading order for → and the end for ←, so the first
    // keypress always lands on a sensible card.
    if (!fromId) {
      return direction === 'right'
        ? (READING_ORDER[0] ?? null)
        : (READING_ORDER.at(-1) ?? null)
    }

    const idx = READING_ORDER.indexOf(fromId)
    if (idx === -1) return READING_ORDER[0] ?? null

    const step = direction === 'right' ? 1 : -1
    const nextIdx = (idx + step + READING_ORDER.length) % READING_ORDER.length
    return READING_ORDER[nextIdx] ?? null
  }

  // Spatial-neighbor traversal for vertical arrows.
  const from: Anchor = fromId
    ? (LENSES.find((l) => l.id === fromId) ?? CENTER_ANCHOR)
    : CENTER_ANCHOR

  let best: { id: string; score: number } | null = null

  for (const lens of LENSES) {
    if (lens.id === fromId) continue

    const dx = lens.x - from.x
    const dy = lens.y - from.y

    let parallel: number
    let perp: number

    if (direction === 'up') {
      if (dy >= 0) continue
      parallel = -dy
      perp = Math.abs(dx)
    } else {
      if (dy <= 0) continue
      parallel = dy
      perp = Math.abs(dx)
    }

    const score = parallel + perp * PERP_WEIGHT

    if (best == null || score < best.score) {
      best = { id: lens.id, score }
    }
  }

  if (best) return best.id

  // Wrap. No card exists in the half-plane the user wanted, so
  // jump to the row at the opposite end of the deck. ↑ from the
  // top row wraps to the bottom row (largest y); ↓ from the bottom
  // wraps to the top (smallest y). Within that target row we pick
  // the column-nearest card so the wrap preserves the user's
  // horizontal position, the way a book wraps line breaks.
  const wantMaxY = direction === 'up'
  let extremeY: number | null = null
  for (const lens of LENSES) {
    if (lens.id === fromId) continue
    if (extremeY == null) {
      extremeY = lens.y
      continue
    }
    if (wantMaxY ? lens.y > extremeY : lens.y < extremeY) {
      extremeY = lens.y
    }
  }
  if (extremeY == null) return null

  let wrapBest: { id: string; perp: number } | null = null
  for (const lens of LENSES) {
    if (lens.id === fromId) continue
    // Only consider cards on the extreme row (allow a small
    // tolerance because y values come from a discrete grid anchor
    // set, but might wiggle a touch in registry data).
    if (Math.abs(lens.y - extremeY) > 0.5) continue
    const perp = Math.abs(lens.x - from.x)
    if (wrapBest == null || perp < wrapBest.perp) {
      wrapBest = { id: lens.id, perp }
    }
  }
  return wrapBest?.id ?? null
}

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down'
}

/** Map a keyboard event's `key` to a Direction, or null if irrelevant. */
export function keyToDirection(key: string): Direction | null {
  return KEY_TO_DIRECTION[key] ?? null
}
