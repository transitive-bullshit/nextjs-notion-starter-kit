import type { Deck } from '../deck'
import type { Lens } from '../types'
import { assignSlots } from '../registry'
import fableMetaJson from './fable/deck.json'
import fableLensesJson from './fable/lenses.json'
import haikuMetaJson from './haiku/deck.json'
import haikuLensesJson from './haiku/lenses.json'
import opusMetaJson from './opus/deck.json'
import opusLensesJson from './opus/lenses.json'
import { PlaceholderIllustration } from './placeholder'

/* ─────────────────────────────────────────────────────────
 * The LLM decks — 28-lens decks, each authored by a language
 * model in strict isolation.
 *
 *   Each model is handed only the lenses.md format spec and asked
 *   for its own 28 ways of looking at the world — no access to the
 *   original deck, this codebase, or the other models' decks.
 *   Content lives in ./<slug>/lenses.md (compiled to lenses.json via
 *   `pnpm lenses:sync`); deck-level copy lives in ./<slug>/deck.json,
 *   also authored by the model.
 *
 *   To add a deck, use the `llm-lens-deck` skill — it runs the
 *   isolated authoring subagent and wires up the registry + routes.
 * ───────────────────────────────────────────────────────── */

export type LlmDeckMeta = {
  /** Display name of the authoring model, e.g. "Claude Fable". */
  model: string
  centerTitle: string
  centerTagline: string
  dialogTitle: string
  dialogLede: string[]
  directoryBlurb: string
  centerBg: string
  centerFg: string
  centerAccent: string
}

export type LlmDeck = Deck & { meta: LlmDeckMeta }

type RawLens = Omit<Lens, 'x' | 'y'>

function buildDeck(
  slug: string,
  lensesData: unknown,
  meta: LlmDeckMeta
): LlmDeck {
  const lenses = assignSlots(
    (lensesData as RawLens[]).map((lens) => ({ ...lens, x: 0, y: 0 }))
  )
  return {
    key: `llm-${slug}`,
    basePath: `/lenses/llms/${slug}`,
    backHref: '/lenses/llms',
    lenses,
    lensById: Object.fromEntries(lenses.map((l) => [l.id, l])),
    center: {
      title: meta.centerTitle,
      tagline: meta.centerTagline,
      art: {
        id: `${slug}-deck`,
        fg: meta.centerFg,
        bg: meta.centerBg,
        accent: meta.centerAccent
      }
    },
    dialog: {
      title: meta.dialogTitle,
      lede: meta.dialogLede
    },
    Illustration: PlaceholderIllustration,
    meta
  }
}

export const FABLE_DECK = buildDeck(
  'fable',
  fableLensesJson,
  fableMetaJson as LlmDeckMeta
)

export const OPUS_DECK = buildDeck(
  'opus',
  opusLensesJson,
  opusMetaJson as LlmDeckMeta
)

export const HAIKU_DECK = buildDeck(
  'haiku',
  haikuLensesJson,
  haikuMetaJson as LlmDeckMeta
)

export const LLM_DECKS: LlmDeck[] = [FABLE_DECK, OPUS_DECK, HAIKU_DECK]
