'use client'

import Link from 'next/link'
import * as React from 'react'
import BodyClassName from 'react-body-classname'

import { ThemeToggle } from '@/components/wustep/ThemeToggle'
import { useDarkMode } from '@/lib/use-dark-mode'

import { LLM_DECKS, type LlmDeck } from './decks'
import styles from './LlmsDirectory.module.css'

/* ─────────────────────────────────────────────────────────
 * LlmsDirectory — the little landing at /lenses/llms.
 *
 *   One card per model-authored deck, each linking to that deck's
 *   canvas. The cards borrow each deck's center palette and a strip
 *   of its lens colors, so the page previews the personality of each
 *   deck before you open it.
 * ───────────────────────────────────────────────────────── */

/** Sample a handful of card colors so each directory card carries a
 *  fingerprint of its deck's palette. Lenses are alphabetical, so a
 *  fixed stride reads as an arbitrary-but-stable sample. */
function paletteSample(deck: LlmDeck, count = 6): string[] {
  const stride = Math.max(1, Math.floor(deck.lenses.length / count))
  const chips: string[] = []
  for (let i = 0; i < deck.lenses.length && chips.length < count; i += stride) {
    chips.push(deck.lenses[i]!.bg)
  }
  return chips
}

function DeckCard({ deck }: { deck: LlmDeck }) {
  return (
    <li className={styles.deckItem}>
      <Link
        href={deck.basePath}
        className={styles.deckCard}
        style={
          {
            ['--deck-bg' as string]: deck.meta.centerBg,
            ['--deck-fg' as string]: deck.meta.centerFg,
            ['--deck-accent' as string]: deck.meta.centerAccent
          } as React.CSSProperties
        }
      >
        <span className={styles.deckArt} aria-hidden='true'>
          <deck.Illustration
            id={deck.center.art.id}
            fg={deck.meta.centerFg}
            bg={deck.meta.centerBg}
            accent={deck.meta.centerAccent}
          />
        </span>
        <span className={styles.deckText}>
          <span className={styles.deckEyebrow}>
            {deck.meta.model} · {deck.lenses.length} lenses
          </span>
          <span className={styles.deckTitle}>{deck.meta.centerTitle}</span>
          <span className={styles.deckBlurb}>{deck.meta.directoryBlurb}</span>
          <span className={styles.deckChips} aria-hidden='true'>
            {paletteSample(deck).map((color, i) => (
              // Chips are a fixed-order, render-once palette strip; two
              // lenses can share a bg hex, so the index is the identity.
              <i
                key={i}
                className={styles.deckChip}
                style={{ background: color }}
              />
            ))}
          </span>
        </span>
        <span className={styles.deckArrow} aria-hidden='true'>
          →
        </span>
      </Link>
    </li>
  )
}

export function LlmsDirectory() {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <>
      <BodyClassName className={isDarkMode ? 'notion dark-mode' : 'notion'} />

      <div className={styles.frame}>
        <header className={styles.header}>
          <Link
            href='/lenses'
            className={styles.backButton}
            aria-label='Back to Lenses'
          >
            <span aria-hidden='true'>←</span>
          </Link>
          <ThemeToggle
            isDark={hasMounted ? isDarkMode : false}
            onToggle={toggleDarkMode}
            className={styles.headerButton}
          />
        </header>

        <main className={styles.main}>
          <span className={styles.eyebrow}>
            One format · {LLM_DECKS.length} authors
          </span>
          <h1 className={styles.title}>Lenses, by language models</h1>
          <p className={styles.lede}>
            Each model was handed the same empty 28-card deck and asked how it
            sees the world — no sight of{' '}
            <Link href='/lenses' className={styles.ledeLink}>
              the original deck
            </Link>
            , or of each other. Same structure, different sensibilities.
          </p>

          <ul className={styles.deckList}>
            {LLM_DECKS.map((deck) => (
              <DeckCard key={deck.key} deck={deck} />
            ))}
          </ul>
        </main>
      </div>
    </>
  )
}
