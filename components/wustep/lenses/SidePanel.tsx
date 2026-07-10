import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as React from 'react'

import { isDev } from '@/lib/config'

import { useDeck } from './deck'
import { ignoreDesignPanelOutside, useDesignFlag } from './DesignPanel'
import { ChevronIcon, CloseIcon, ReadingArrowIcon } from './icons'
import { LensBody } from './LensBody'
import styles from './LensesPage.module.css'
import { neighborInDirection } from './navigation'
import { type Lens } from './types'

/**
 * SidePanel — slide-in detail view for a single lens.
 *
 *   The panel cross-fades its body when the active lens changes (via
 *   bumping `bodyKey`) so navigating between related lenses feels like
 *   flipping pages within the same surface rather than re-opening.
 */

/* User-resizable width. The panel is right-anchored, so the drag width
   is simply the distance from the viewport's right edge to the pointer.
   We persist the chosen width and feed it back through a CSS var the
   `.panel` width clamp already reads, so the `min(…, 100vw)` cap and the
   phone full-bleed override still win. */
const RESIZE_STORAGE_KEY = 'lenses:panel-width'
const PANEL_MIN_WIDTH = 384
function panelMaxWidth() {
  return Math.min(window.innerWidth * 0.92, 860)
}
type SidePanelProps = {
  lens: Lens | null
  onClose: () => void
  onOpenLens: (id: string) => void
  dismissOnOutside?: boolean
  previewOverride?: {
    container: HTMLElement
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
}

export function SidePanel({
  lens,
  onClose,
  onOpenLens,
  dismissOnOutside = true,
  previewOverride
}: SidePanelProps) {
  const deck = useDeck()
  const open = !!lens
  const [shown, setShown] = React.useState<Lens | null>(lens)
  const [bodyKey, setBodyKey] = React.useState(0)
  const contentRef = React.useRef<HTMLDivElement>(null)
  /* Body density mode comes from the dev DesignPanel. In production
     this hook always returns 'full' (the schema default), which
     renders the full essay — identical to the prior behavior. */
  const bodyDensity = useDesignFlag<string>('bodyDensity', 'full')
  const ignoreOutsideInteraction = React.useCallback(
    (event: { target: EventTarget | null; preventDefault: () => void }) => {
      if (!dismissOnOutside) {
        event.preventDefault()
        return
      }

      const target = event.target as Element | null
      if (
        previewOverride &&
        target?.closest?.('[data-lenses-preview-toggle]')
      ) {
        event.preventDefault()
        return
      }

      ignoreDesignPanelOutside(event)
    },
    [dismissOnOutside, previewOverride]
  )

  React.useEffect(() => {
    if (lens) {
      setShown(lens)
      setBodyKey((k) => k + 1)
    }
  }, [lens])

  /* Expose "side panel is open" as a global data attribute so the dev
     DesignPanel can dodge to a non-overlapping spot. We don't read
     this from React — DesignPanel is dev-only and uses a CSS-only
     selector against this attribute. No-op cost in prod. */
  React.useEffect(() => {
    if (previewOverride) return undefined
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (open) {
      root.dataset.lensesSideOpen = 'true'
      return () => {
        delete root.dataset.lensesSideOpen
      }
    }
    return undefined
  }, [open, previewOverride])

  const panelPalette =
    shown && previewOverride
      ? previewOverride.palette
      : shown
        ? {
            bg: shown.bg,
            fg: shown.fg,
            accent: shown.accent ?? shown.fg
          }
        : null

  /* Drag-to-resize. `panelWidth === null` means "use the default" so we
     don't emit the var at all (lets the design-panel/default value show
     through). Lab previews keep their fixed framed width. */
  const [panelWidth, setPanelWidth] = React.useState<number | null>(null)
  const resizingRef = React.useRef(false)

  React.useEffect(() => {
    if (previewOverride) return
    try {
      const saved = window.localStorage.getItem(RESIZE_STORAGE_KEY)
      if (saved) {
        const n = Number.parseInt(saved, 10)
        if (Number.isFinite(n)) setPanelWidth(n)
      }
    } catch {
      /* storage disabled — fall back to the default width. */
    }
  }, [previewOverride])

  const handleResizePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (previewOverride) return
      event.preventDefault()
      event.currentTarget.setPointerCapture(event.pointerId)
      resizingRef.current = true
      document.documentElement.dataset.lensesResizing = 'true'
    },
    [previewOverride]
  )

  const handleResizePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!resizingRef.current) return
      const next = Math.round(
        Math.min(
          Math.max(window.innerWidth - event.clientX, PANEL_MIN_WIDTH),
          panelMaxWidth()
        )
      )
      setPanelWidth(next)
    },
    []
  )

  const handleResizePointerUp = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!resizingRef.current) return
      resizingRef.current = false
      event.currentTarget.releasePointerCapture?.(event.pointerId)
      delete document.documentElement.dataset.lensesResizing
      setPanelWidth((w) => {
        if (w != null) {
          try {
            window.localStorage.setItem(RESIZE_STORAGE_KEY, String(w))
          } catch {
            /* ignore */
          }
        }
        return w
      })
    },
    []
  )

  const handleResizeReset = React.useCallback(() => {
    setPanelWidth(null)
    try {
      window.localStorage.removeItem(RESIZE_STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose()
      }}
      /* In dev, run non-modally so the floating DesignPanel keeps
         receiving pointer events. Radix's modal mode wraps the body
         with `react-remove-scroll`, which suppresses interactions on
         everything outside the dialog content tree — including the
         DesignPanel's sliders/selects, even though `z-index: 9999`
         puts it visually on top. Non-modal still keeps ESC; only the
         focus trap, pointer-events lock, and the auto-rendered
         overlay are dropped (we re-render the overlay manually below
         so the dimming/blur treatment still shows). Production stays
         modal. */
      modal={!isDev && !previewOverride}
    >
      <DialogPrimitive.Portal container={previewOverride?.container}>
        {/* Radix only renders <Overlay> in modal mode. In dev (non-
            modal) we paint our own div with identical classes so the
            backdrop blur/dim doesn't disappear. We keep default
            pointer-events so the overlay still blocks card hover/
            click underneath (the lens panel should "pause" the
            canvas, same as production). The DesignPanel sits at a
            higher z-index (9999 > 60), so it stays interactive
            because the browser hit-tests top-down. Clicking the
            overlay itself dismisses, mirroring Radix's modal-mode
            behavior. */}
        {previewOverride ? (
          open ? (
            <div
              className={`${styles.panelOverlay} ${styles.panelPreviewOverlay}`}
              data-state='open'
              aria-hidden='true'
            />
          ) : null
        ) : isDev ? (
          open ? (
            <div
              className={styles.panelOverlay}
              data-state='open'
              aria-hidden='true'
              onClick={onClose}
            />
          ) : null
        ) : (
          <DialogPrimitive.Overlay className={styles.panelOverlay} />
        )}
        <DialogPrimitive.Content
          ref={contentRef}
          className={`${styles.panel} ${
            previewOverride ? styles.panelPreview : ''
          }`}
          tabIndex={-1}
          style={
            {
              ...(panelPalette
                ? {
                    ['--panel-bg' as string]: panelPalette.bg,
                    ['--panel-fg' as string]: panelPalette.fg,
                    ['--panel-accent' as string]: panelPalette.accent
                  }
                : {}),
              ...(panelWidth != null
                ? { ['--panel-user-width' as string]: `${panelWidth}px` }
                : {})
            } as React.CSSProperties
          }
          aria-describedby={undefined}
          onOpenAutoFocus={(event) => {
            // Radix's default is to focus the first focusable element,
            // which is now the prev/next chevron — too loud. Focusing
            // the Close button instead still painted a ring on the X.
            // Park focus on the dialog container itself: keyboard users
            // get ESC to close (Radix handles it at the dialog level)
            // and Enter still closes via the keydown handler below,
            // but no button shows a focus ring on open.
            event.preventDefault()
            contentRef.current?.focus({ preventScroll: true })
          }}
          onKeyDown={(event) => {
            // Keep Enter as a close shortcut only while focus is parked
            // on the container itself. If the user has tabbed to a real
            // control, let that control handle Enter.
            if (event.key === 'Enter' && event.target === contentRef.current) {
              event.preventDefault()
              onClose()
            }
          }}
          /* The dev DesignPanel sits at z-index 9999, visually above
             this dialog, but Radix treats a click anywhere outside
             `Content` as an "outside" interaction and closes the
             dialog. Tell Radix to ignore design-panel clicks so the
             two surfaces compose. No-op in prod (panel isn't mounted). */
          onPointerDownOutside={ignoreOutsideInteraction}
          onInteractOutside={ignoreOutsideInteraction}
        >
          {shown && !previewOverride && (
            <div
              className={styles.panelResizer}
              aria-hidden='true'
              onPointerDown={handleResizePointerDown}
              onPointerMove={handleResizePointerMove}
              onPointerUp={handleResizePointerUp}
              onPointerCancel={handleResizePointerUp}
              onDoubleClick={handleResizeReset}
              title='Drag to resize · double-click to reset'
            />
          )}
          {shown && (
            <>
              <div className={styles.panelHero}>
                <span className={styles.panelArt} aria-hidden='true'>
                  {previewOverride && panelPalette ? (
                    previewOverride.renderIllustration(panelPalette)
                  ) : (
                    <deck.Illustration
                      id={shown.illustration}
                      fg={shown.fg}
                      bg={shown.bg}
                      accent={shown.accent ?? shown.fg}
                    />
                  )}
                </span>
                <div className={styles.panelHeroText}>
                  <span className={styles.panelEyebrow}>{shown.category}</span>
                  <DialogPrimitive.Title className={styles.panelTitle}>
                    {shown.title}
                  </DialogPrimitive.Title>
                  <p className={styles.panelTagline}>{shown.tagline}</p>
                </div>
                <div className={styles.panelControls}>
                  <button
                    type='button'
                    className={styles.panelNavBtn}
                    aria-label='Previous lens'
                    onClick={(event) => {
                      const prev = neighborInDirection(
                        deck.lenses,
                        shown.id,
                        'left'
                      )
                      if (prev) {
                        // Drop focus from the chevron after a mouse
                        // click so the new panel doesn't open with a
                        // ring stuck on a navigation control.
                        event.currentTarget.blur()
                        onOpenLens(prev)
                      }
                    }}
                  >
                    <ChevronIcon direction='left' />
                  </button>
                  <button
                    type='button'
                    className={styles.panelNavBtn}
                    aria-label='Next lens'
                    onClick={(event) => {
                      const next = neighborInDirection(
                        deck.lenses,
                        shown.id,
                        'right'
                      )
                      if (next) {
                        event.currentTarget.blur()
                        onOpenLens(next)
                      }
                    }}
                  >
                    <ChevronIcon direction='right' />
                  </button>
                  <DialogPrimitive.Close
                    className={styles.panelClose}
                    aria-label='Close panel'
                  >
                    <CloseIcon />
                  </DialogPrimitive.Close>
                </div>
              </div>
              <div key={bodyKey} className={styles.panelBody}>
                {bodyDensity === 'tagline' ? (
                  <p>
                    <em>{shown.tagline}</em>
                  </p>
                ) : bodyDensity === 'tldr' ? (
                  // First paragraph only — render the full body and clamp
                  // it via CSS (.panelBodyTldr).
                  <div className={styles.panelBodyTldr}>
                    <LensBody markdown={shown.body} />
                  </div>
                ) : (
                  <LensBody markdown={shown.body} />
                )}
                {((shown.readings && shown.readings.length > 0) ||
                  shown.quote) && (
                  <div className={styles.readingsBlock}>
                    {shown.readings && shown.readings.length > 0 && (
                      <ul className={styles.readingsList}>
                        {shown.readings.map((r) => {
                          const external = /^https?:\/\//.test(r.href)
                          return (
                            <li key={r.href} className={styles.readingsItem}>
                              <a
                                className={styles.readingsLink}
                                href={r.href}
                                target={external ? '_blank' : undefined}
                                rel={
                                  external ? 'noopener noreferrer' : undefined
                                }
                              >
                                <span className={styles.readingsLabel}>
                                  {r.label}
                                </span>
                                <span
                                  className={styles.readingsArrow}
                                  data-external={external ? '' : undefined}
                                  aria-hidden='true'
                                >
                                  <ReadingArrowIcon external={external} />
                                </span>
                              </a>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                    {shown.quote && (
                      <figure className={styles.quoteBlock}>
                        <blockquote className={styles.quoteText}>
                          {shown.quote.text}
                        </blockquote>
                        {shown.quote.cite &&
                          (() => {
                            const href = shown.quote.citeHref
                            if (!href) {
                              return (
                                <figcaption className={styles.quoteCite}>
                                  {shown.quote.cite}
                                </figcaption>
                              )
                            }
                            const external = /^https?:\/\//.test(href)
                            return (
                              <figcaption className={styles.quoteCite}>
                                <a
                                  className={styles.quoteCiteLink}
                                  href={href}
                                  target={external ? '_blank' : undefined}
                                  rel={
                                    external ? 'noopener noreferrer' : undefined
                                  }
                                >
                                  <span className={styles.quoteCiteText}>
                                    {shown.quote.cite}
                                  </span>
                                  <span
                                    className={styles.quoteCiteArrow}
                                    data-external={external ? '' : undefined}
                                    aria-hidden='true'
                                  >
                                    <ReadingArrowIcon external={external} />
                                  </span>
                                </a>
                              </figcaption>
                            )
                          })()}
                      </figure>
                    )}
                  </div>
                )}
                {shown.related && shown.related.length > 0 && (
                  <div className={styles.relatedBlock}>
                    <span className={styles.relatedLabel}>Related</span>
                    <div className={styles.relatedChips}>
                      {shown.related.map((id) => {
                        const r = deck.lensById[id]
                        if (!r) return null
                        return (
                          <button
                            key={id}
                            type='button'
                            className={styles.relatedChip}
                            onClick={() => onOpenLens(id)}
                            style={
                              {
                                ['--chip-bg' as string]: r.bg,
                                ['--chip-fg' as string]: r.fg
                              } as React.CSSProperties
                            }
                          >
                            <span
                              className={styles.relatedChipSwatch}
                              aria-hidden='true'
                            />
                            {r.title}
                            <span
                              className={styles.relatedChipArrow}
                              aria-hidden='true'
                            >
                              <ReadingArrowIcon external={false} />
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
