import lensesData from './lenses.json'
import { GRID, type Lens } from './types'

/**
 * LENSES_RAW — the deck, compiled from `lenses.md`.
 *
 *   Authoring lives in `lenses.md` (one section per lens; see the
 *   comment at the top of that file for the format). Run
 *   `pnpm lenses:sync` to regenerate `lenses.json`, which this module
 *   imports — never edit `lenses.json` by hand.
 *
 *   Card x/y are placeholders here; the layout pass below assigns the
 *   real anchors in reading order.
 */
type RawLens = Omit<Lens, 'x' | 'y'>

const LENSES_RAW: Lens[] = (lensesData as unknown as RawLens[]).map((lens) => ({
  ...lens,
  x: 0,
  y: 0
}))

/* ─────────────────────────────────────────────────────────
 * Layout: alphabetical by title, left-to-right, top-to-bottom,
 * skipping the middle 2×2 cells reserved for the center card.
 *
 * The canvas is an 8-col × 4-row grid (see GRID anchors). The
 * center card occupies columns 4–5 (0-indexed: 3–4) of rows
 * 2–3 (0-indexed: 1–2). Every other cell takes one lens, so
 * 32 − 4 = 28 surrounding slots — matches the deck size.
 * ───────────────────────────────────────────────────────── */
const CENTER_COLS = new Set([3, 4])
const CENTER_ROWS = new Set([1, 2])

const SLOTS: { x: number; y: number }[] = []
for (let r = 0; r < GRID.rowAnchors.length; r++) {
  for (let c = 0; c < GRID.colAnchors.length; c++) {
    if (CENTER_ROWS.has(r) && CENTER_COLS.has(c)) continue
    SLOTS.push({ x: GRID.colAnchors[c]!, y: GRID.rowAnchors[r]! })
  }
}

/** Assign canvas anchors in reading order (alphabetical by title).
 *  Shared with the model decks under ./llms, which compile their own
 *  lenses.json but use the identical 28-slot layout. */
export function assignSlots(lenses: Lens[]): Lens[] {
  return lenses
    .toSorted((a, b) => a.title.localeCompare(b.title))
    .map((lens, i) => {
      const slot = SLOTS[i]
      return slot ? { ...lens, x: slot.x, y: slot.y } : lens
    })
}

export const LENSES: Lens[] = assignSlots(LENSES_RAW)

export const LENS_BY_ID: Record<string, Lens> = Object.fromEntries(
  LENSES.map((l) => [l.id, l])
)
