import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as React from 'react'

import { isDev } from '@/lib/config'

import type { Lens } from './types'
import { useDeck } from './deck'
import { ignoreDesignPanelOutside, useDesignFlag } from './DesignPanel'
import { CloseIcon } from './icons'
import styles from './LensesPage.module.css'

/**
 * CenterDialog — the central "Lenses" index.
 *
 *   Two jobs share one frame:
 *     • A short philosophy lede (the deck's premise)
 *     • A grid of every lens, immediately browsable.
 *
 *   The lede stays small on top so the index isn't gated behind 200
 *   words of prose — the most common goal here is "find a lens
 *   quickly," and the grid serves that without scrolling.
 */
type CenterDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenLens: (id: string) => void
}

export function CenterDialog({
  open,
  onOpenChange,
  onOpenLens
}: CenterDialogProps) {
  const deck = useDeck()
  const lenses = deck.lenses
  /* Optional grouping by category. Default keeps the alphabetical
     reading order (the registry's runtime sort) so finding a lens
     scans top-to-bottom on first letter. Grouped mode is for when
     the user wants to browse the deck by family. */
  const grouped = useDesignFlag<boolean>('dialogGroup', false)
  const groups = React.useMemo(() => {
    if (!grouped) return null
    const map = new Map<string, Lens[]>()
    for (const l of lenses) {
      const k = l.category
      if (!map.has(k)) map.set(k, [])
      map.get(k)!.push(l)
    }
    return [...map.entries()].toSorted(([a], [b]) => a.localeCompare(b))
  }, [grouped, lenses])

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      /* See SidePanel for the rationale: non-modal in dev so the
         DesignPanel stays interactive; modal in prod. */
      modal={!isDev}
    >
      <DialogPrimitive.Portal>
        {/* See SidePanel for the full rationale. Manual overlay in
            dev keeps the backdrop and still blocks canvas pointer
            events. Click-to-dismiss mirrors Radix's modal-mode
            overlay. The DesignPanel sits above this at z-index
            9999 and stays interactive. */}
        {isDev ? (
          open ? (
            <div
              className={styles.dialogOverlay}
              data-state='open'
              aria-hidden='true'
              onClick={() => onOpenChange(false)}
            />
          ) : null
        ) : (
          <DialogPrimitive.Overlay className={styles.dialogOverlay} />
        )}
        <DialogPrimitive.Content
          className={styles.dialog}
          aria-describedby={undefined}
          /* Let the dev DesignPanel receive clicks even when this
             dialog is open. Radix would otherwise close on any
             click outside `Content`. No-op in production. */
          onPointerDownOutside={ignoreDesignPanelOutside}
          onInteractOutside={ignoreDesignPanelOutside}
        >
          <header className={styles.dialogHeader}>
            <div className={styles.dialogHeaderText}>
              <span className={styles.dialogEyebrow}>
                The deck · {lenses.length} lenses
              </span>
              <DialogPrimitive.Title className={styles.dialogTitle}>
                {deck.dialog.title}
              </DialogPrimitive.Title>
              {deck.dialog.lede.map((paragraph) => (
                <p key={paragraph} className={styles.dialogLede}>
                  {paragraph}
                </p>
              ))}
            </div>
            <DialogPrimitive.Close
              className={styles.dialogCloseBtn}
              aria-label='Close'
            >
              <CloseIcon />
            </DialogPrimitive.Close>
          </header>

          {groups ? (
            <div className={styles.dialogGroups}>
              {groups.map(([category, lenses], gi) => (
                <section key={category} className={styles.dialogGroup}>
                  <h3 className={styles.dialogGroupHead}>{category}</h3>
                  <ul
                    className={styles.dialogList}
                    aria-label={`${category} lenses`}
                  >
                    {lenses.map((lens, i) => (
                      <DialogJumpItem
                        key={lens.id}
                        lens={lens}
                        index={gi * 100 + i}
                        onOpenLens={onOpenLens}
                      />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <ul
              className={styles.dialogList}
              aria-label={`All ${lenses.length} lenses`}
            >
              {lenses.map((lens, i) => (
                <DialogJumpItem
                  key={lens.id}
                  lens={lens}
                  index={i}
                  onOpenLens={onOpenLens}
                />
              ))}
            </ul>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

function DialogJumpItem({
  lens,
  index,
  onOpenLens
}: {
  lens: Lens
  index: number
  onOpenLens: (id: string) => void
}) {
  const deck = useDeck()
  return (
    <li
      className={styles.dialogListItem}
      style={{ ['--i' as string]: index } as React.CSSProperties}
    >
      <button
        type='button'
        className={styles.dialogJumpBtn}
        aria-label={`Open the ${lens.title} lens`}
        onClick={() => onOpenLens(lens.id)}
        style={
          {
            ['--jump-bg' as string]: lens.bg,
            ['--jump-fg' as string]: lens.fg,
            ['--jump-accent' as string]: lens.accent ?? lens.fg
          } as React.CSSProperties
        }
      >
        <span className={styles.dialogJumpArt} aria-hidden='true'>
          <deck.Illustration
            id={lens.illustration}
            fg={lens.fg}
            bg={lens.bg}
            accent={lens.accent ?? lens.fg}
          />
        </span>
        <span className={styles.dialogJumpText}>
          <span className={styles.dialogJumpCategory}>{lens.category}</span>
          <span className={styles.dialogJumpTitle}>{lens.title}</span>
          <span className={styles.dialogJumpTagline}>{lens.tagline}</span>
        </span>
        <span className={styles.dialogJumpArrow} aria-hidden='true'>
          →
        </span>
      </button>
    </li>
  )
}
