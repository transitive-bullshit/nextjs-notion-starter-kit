import * as React from 'react'

import type { IllustrationId, Lens } from './types'
import { Illustration } from './illustrations'
import { LENS_BY_ID, LENSES } from './registry'

/* ─────────────────────────────────────────────────────────
 * Deck — everything that varies between one Lenses experience
 * and another.
 *
 *   The canvas / cards / panel / dialog components are deck-agnostic:
 *   they read the active deck from context and render whatever lenses,
 *   copy, and illustration system it provides. The original deck at
 *   /lenses (WUSTEP_DECK) is the context default, so existing mounts
 *   don't change; the model decks under ./llms provide their own.
 * ───────────────────────────────────────────────────────── */

export type DeckIllustrationProps = {
  id: string
  fg: string
  bg: string
  accent: string
}

export type Deck = {
  /** Stable key — namespaces sessionStorage etc. */
  key: string
  /** Standalone base route, e.g. '/lenses' or '/lenses/llms/opus'.
   *  Per-lens deep links live at `${basePath}/<lensId>`. */
  basePath: string
  /** Where the header back button leads — one level up in the deck
   *  hierarchy: home for the original deck, the /lenses/llms directory
   *  for the model decks. */
  backHref: string
  lenses: Lens[]
  lensById: Record<string, Lens>
  /** The big center card. */
  center: {
    title: string
    tagline: string
    art: { id: string; fg: string; bg: string; accent: string }
  }
  /** Index dialog copy (the grid itself comes from `lenses`). */
  dialog: {
    title: string
    lede: string[]
    credit?: {
      label: string
      tooltip: string
    }
  }
  /** Illustration renderer for this deck's illustration keys. */
  Illustration: React.ComponentType<DeckIllustrationProps>
}

/** The wustep deck's illustrations are a closed IllustrationId union;
 *  the deck contract is stringly-keyed, so narrow at this boundary.
 *  Keys come from lenses.json, which `pnpm lenses:sync` validates. */
function WustepIllustration({ id, fg, bg, accent }: DeckIllustrationProps) {
  return (
    <Illustration id={id as IllustrationId} fg={fg} bg={bg} accent={accent} />
  )
}

export const WUSTEP_DECK: Deck = {
  key: 'wustep',
  basePath: '/lenses',
  backHref: '/',
  lenses: LENSES,
  lensById: LENS_BY_ID,
  center: {
    title: 'Lenses',
    tagline: 'A way of looking. Pick one. Try it on.',
    art: { id: 'lenses-deck', fg: '#F6EAD8', bg: '#222226', accent: '#F0A85A' }
  },
  dialog: {
    title: 'A lens is a way of looking.',
    lede: [
      'You’re already looking through one; you just didn’t choose it. No single lens explains the world — each shows you something the others hide. The deck is for switching on purpose. Pull one. Look through it. Put it back.'
    ],
    credit: {
      label: 'Cowritten with Claude.',
      tooltip:
        "The ideas are mine; Claude helped me put them into words. I'd love to rewrite everything by hand one day, but haven't had the time. I hope you'll bear with the AI-assisted writing for now 🙏"
    }
  },
  Illustration: WustepIllustration
}

const DeckContext = React.createContext<Deck>(WUSTEP_DECK)

export function useDeck(): Deck {
  return React.useContext(DeckContext)
}

export const DeckProvider = DeckContext.Provider
