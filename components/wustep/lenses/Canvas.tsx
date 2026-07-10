import * as React from 'react'

import { CenterCard, LensCard } from './cards'
import { useDeck } from './deck'
import styles from './LensesPage.module.css'
import { type LensPreviewOverride, STAGE, type Stage } from './types'

/* ─────────────────────────────────────────────────────────
 * Canvas — host for the cards grid + background field.
 *
 *   Cards live in a real CSS grid (.cards), placed by row/column.
 *   The grid uses fixed pixel gaps and outer padding so the deck
 *   has a consistent rhythm at every viewport size — short
 *   viewports just scroll, rather than the cards being squeezed
 *   to fit.
 *
 *   All keyboard navigation lives in `LensesPage` so a single
 *   handler can coordinate the canvas cursor, side panel
 *   swapping, and Enter-to-open. The Canvas stays presentational.
 * ───────────────────────────────────────────────────────── */

type CanvasProps = {
  stage: Stage
  prefersReducedMotion: boolean
  /** Lens currently selected on the canvas — either the open
   *  panel's lens, or the keyboard cursor when no panel is open.
   *  Drives the persistent selection treatment on the matching
   *  card so the user can locate their place on the canvas. */
  activeLensId: string | null
  onOpenCenter: () => void
  onOpenLens: (id: string) => void
  previewOverride?: LensPreviewOverride
}

export function Canvas({
  stage,
  prefersReducedMotion,
  activeLensId,
  onOpenCenter,
  onOpenLens,
  previewOverride
}: CanvasProps) {
  const deck = useDeck()
  return (
    <div
      className={`${styles.canvas} ${stage >= STAGE.canvas ? styles.canvasVisible : ''}`}
    >
      <BackgroundField />

      <div className={styles.cards}>
        {deck.lenses.map((lens) => (
          <LensCard
            key={lens.id}
            lens={lens}
            stage={stage}
            prefersReducedMotion={prefersReducedMotion}
            selected={activeLensId === lens.id}
            onOpen={() => onOpenLens(lens.id)}
            previewOverride={
              previewOverride?.lensId === lens.id ? previewOverride : undefined
            }
          />
        ))}

        <CenterCard
          stage={stage}
          onOpen={onOpenCenter}
          previewOverride={
            previewOverride?.lensId === 'lenses-deck'
              ? previewOverride
              : undefined
          }
        />
      </div>
    </div>
  )
}

function BackgroundField() {
  return (
    <div className={styles.bgWrap} aria-hidden='true'>
      <div className={styles.bgGrid} />
    </div>
  )
}
