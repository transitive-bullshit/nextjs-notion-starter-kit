'use client'

import Link from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import BodyClassName from 'react-body-classname'

import { LabsButton } from '@/components/wustep/LabsButton'
import { ThemeToggle } from '@/components/wustep/ThemeToggle'
import { isDev } from '@/lib/config'
import { useDarkMode } from '@/lib/use-dark-mode'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

import { Canvas } from './Canvas'
import { CenterDialog } from './CenterDialog'
import { type Deck, DeckProvider, WUSTEP_DECK } from './deck'
import { DesignPanel } from './DesignPanel'
import styles from './LensesPage.module.css'
import { keyToDirection, neighborInDirection } from './navigation'
import { PlayAnimationsButton } from './PlayAnimationsButton'
import { SidePanel } from './SidePanel'
import { type LensesPageProps, STAGE, type Stage, TIMING } from './types'

/**
 * Reflect panel + index-dialog state into the URL.
 *
 *   On the deck's standalone route the open lens lives in the path as a
 *   clean segment — e.g. /lenses/attention — and the index dialog stays
 *   an `?index=open` query flag. Anywhere the page is embedded (e.g.
 *   /playground/lenses, which has no per-lens route) we fall back to the
 *   legacy `?lens=…` query param and never touch the pathname.
 *
 *   We mutate via `history.replaceState` rather than `router.replace` so
 *   we don't trigger a Next re-render (state already reflects the change)
 *   or re-run the entrance animation.
 */
function syncLensUrl(
  basePath: string,
  openLensId: string | null,
  centerOpen: boolean
) {
  const { pathname, search } = window.location
  const isStandalone =
    pathname === basePath || pathname.startsWith(`${basePath}/`)
  const params = new URLSearchParams(search)

  let url: string
  if (isStandalone) {
    // Path carries the open lens; the index dialog stays a query flag.
    params.delete('lens')
    if (centerOpen) params.set('index', 'open')
    else params.delete('index')
    const path = openLensId ? `${basePath}/${openLensId}` : basePath
    const qs = params.toString()
    url = qs ? `${path}?${qs}` : path
  } else {
    // Embedded mount: keep the lens in the query string, pathname intact.
    if (openLensId) params.set('lens', openLensId)
    else params.delete('lens')
    if (centerOpen) params.set('index', 'open')
    else params.delete('index')
    const qs = params.toString()
    url = qs ? `${pathname}?${qs}` : pathname
  }

  if (url === pathname + search) return
  window.history.replaceState(null, '', url)
}

/**
 * LensesPage — top-level Lenses experience.
 *
 *   The page drives a single `stage` integer that fans out to children:
 *     stage 0 → mounted but everything hidden (SSR-safe initial state)
 *     stage 1 → canvas faded in
 *     stage 2 → center "Lenses" card scaled into place
 *     stage 3 → surrounding cards staggering in
 *
 *   Reduced motion? We snap straight to the final stage on mount so
 *   nothing animates — but the visual end-state is identical.
 *
 *   When `embedded` is true, the page renders only the canvas + portaled
 *   panels and skips its own header / theme toggle / body classes. Use
 *   this when mounting `<LensesPage embedded />` inside another chrome
 *   (e.g. `PlaygroundLayout`). `previewOverride` is a lab-only embedding
 *   path: it opens one lens inside the frame and swaps that panel's art.
 *
 *   `deck` selects which deck the page renders (lenses, copy, art,
 *   standalone base route). Defaults to the original /lenses deck, so
 *   existing mounts are unchanged; the Claude decks pass their own.
 */
export function LensesPage({
  embedded = false,
  dismissPanelOnOutside = true,
  previewOverride,
  deck = WUSTEP_DECK
}: LensesPageProps & { deck?: Deck } = {}) {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const previewLensId = previewOverride?.lensId
  const [hasMounted, setHasMounted] = React.useState(false)
  const [stage, setStage] = React.useState<Stage>(() =>
    previewLensId ? STAGE.cards : STAGE.hidden
  )
  const prefersReducedMotion = usePrefersReducedMotion()
  const [previewContainer, setPreviewContainer] =
    React.useState<HTMLDivElement | null>(null)

  const router = useRouter()
  const [hydratedFromUrl, setHydratedFromUrl] = React.useState(false)

  const [openLensId, setOpenLensId] = React.useState<string | null>(
    previewLensId ?? null
  )
  const [centerOpen, setCenterOpen] = React.useState(false)
  const [playAllAnimations, setPlayAllAnimations] = React.useState(false)

  /* Keyboard cursor across the canvas. The cursor is the lens that
     currently shows the "selected" treatment when no panel is open —
     a way to steer with arrow keys without committing to opening a
     panel. Pressing Enter promotes the cursor to an open panel.

     When a panel is open, the cursor is conceptually pinned to
     `openLensId` (the open lens is what's "selected"). Rather than
     try to keep two state slots aligned, we derive the canvas
     selection from `openLensId ?? cursorLensId` at render time. */
  const [cursorLensId, setCursorLensId] = React.useState<string | null>(
    previewLensId ?? null
  )

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  /* Hydrate panel + dialog state from the URL once the router is ready.
     `router.isReady` flips to true on the client after Next has parsed
     `query`. Reading on first render in SSR would yield empty values
     and overwrite a real lens after hydration, hence this guard.

     The open lens comes from the `/lenses/<id>` path segment
     (`router.query.lensId`) on the standalone route, falling back to the
     legacy `?lens=…` query param so old links and the embedded mount
     keep working. We only seed once — the user takes over from there. */
  React.useEffect(() => {
    if (previewLensId) return
    if (!router.isReady || hydratedFromUrl) return
    const lensRaw =
      typeof router.query.lensId === 'string'
        ? router.query.lensId
        : typeof router.query.lens === 'string'
          ? router.query.lens
          : null
    const indexRaw =
      typeof router.query.index === 'string' ? router.query.index : null
    if (lensRaw && deck.lensById[lensRaw]) {
      setOpenLensId(lensRaw)
      setCursorLensId(lensRaw)
    }
    if (indexRaw === 'open') setCenterOpen(true)
    setHydratedFromUrl(true)
  }, [
    router.isReady,
    router.query.lensId,
    router.query.lens,
    router.query.index,
    hydratedFromUrl,
    previewLensId,
    deck.lensById
  ])

  /* Push state -> URL whenever the user opens / closes / swaps a panel
     or the index dialog. `syncLensUrl` uses `history.replaceState` (not
     `router.replace`) so we don't re-render the page tree or re-trigger
     the entrance animation. On the standalone /lenses route it writes a
     path segment (/lenses/<id>); on the embedded mount it falls back to
     the `?lens=` query param. */
  React.useEffect(() => {
    if (previewLensId) return
    if (!hydratedFromUrl) return
    syncLensUrl(deck.basePath, openLensId, centerOpen)
  }, [hydratedFromUrl, openLensId, centerOpen, previewLensId, deck.basePath])

  /* Drive the entrance storyboard. Snap to final stage instantly when
     the user prefers reduced motion.
     `entranceTick` is bumped by the dev DesignPanel ("Replay" action)
     to re-run the entrance from stage 0 — handy when tweaking timing.

     Repeat-visit skip: once a user has seen the entrance during this
     browser session, subsequent navigations to the page snap straight
     to the final stage. The flag lives in sessionStorage so it resets
     on a new tab/window but persists across in-session navigation.
     The dev panel's "Replay" path bypasses the flag (entranceTick > 0)
     so designers can re-run the storyboard at will. */
  const [entranceTick, setEntranceTick] = React.useState(0)

  React.useEffect(() => {
    if (!hasMounted) return
    if (previewLensId) {
      setStage(STAGE.cards)
      return
    }

    const SESSION_KEY = `lenses:entrance-played:${deck.key}`
    const replayRequested = entranceTick > 0
    let alreadyPlayed = false
    try {
      alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === '1'
    } catch {
      /* Private mode or storage disabled — fall through to the
         normal entrance. Not worth blocking on. */
    }

    if (prefersReducedMotion || (alreadyPlayed && !replayRequested)) {
      setStage(STAGE.cards)
      return
    }

    setStage(STAGE.hidden)
    const timers: ReturnType<typeof setTimeout>[] = [
      setTimeout(() => setStage(STAGE.canvas), TIMING.canvasIn),
      setTimeout(() => setStage(STAGE.center), TIMING.centerIn),
      setTimeout(() => {
        setStage(STAGE.cards)
        try {
          sessionStorage.setItem(SESSION_KEY, '1')
        } catch {}
      }, TIMING.cardsInBase)
    ]
    return () => {
      for (const t of timers) clearTimeout(t)
    }
  }, [hasMounted, prefersReducedMotion, entranceTick, previewLensId, deck.key])

  React.useEffect(() => {
    if (!previewLensId) return
    setStage(STAGE.cards)
    setOpenLensId(previewLensId)
    setCursorLensId(previewLensId)
    setCenterOpen(false)
  }, [previewLensId])

  /* Listen for the dev panel's replay event. Only relevant in dev,
     and the listener is cheap when no event is dispatched. */
  React.useEffect(() => {
    if (!isDev || previewLensId) return
    const onReplay = () => setEntranceTick((t) => t + 1)
    window.addEventListener('lenses:replay-entrance', onReplay)
    return () => window.removeEventListener('lenses:replay-entrance', onReplay)
  }, [previewLensId])

  /* Cursor parallax — sets `--mx` / `--my` on the document root
     so the .cards CSS rule (gated by data-design-parallax) can
     translate the deck. Throttled with rAF, cheap, and only
     active when the design panel turns parallax on. */
  React.useEffect(() => {
    if (!isDev || previewLensId) return
    let raf = 0
    let pendingX = 0
    let pendingY = 0
    const tick = () => {
      raf = 0
      document.documentElement.style.setProperty('--mx', String(pendingX))
      document.documentElement.style.setProperty('--my', String(pendingY))
    }
    const onMove = (e: MouseEvent) => {
      pendingX = (e.clientX / window.innerWidth - 0.5) * -2
      pendingY = (e.clientY / window.innerHeight - 0.5) * -2
      if (!raf) raf = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [previewLensId])

  const openLens = React.useCallback((id: string) => {
    setCenterOpen(false)
    setOpenLensId(id)
    setCursorLensId(id)
  }, [])

  const closeLens = React.useCallback(() => {
    /* Park the cursor on the lens that was open so the next arrow
       press picks up where the user left off, instead of resetting
       to "no cursor" and re-seeding from the canvas center. */
    setOpenLensId((prev) => {
      if (prev) setCursorLensId(prev)
      return null
    })
  }, [])

  /* Single keyboard handler for the whole Lenses experience. Three
     distinct modes, in priority order:

       1. Center dialog open → ignore arrows entirely; the dialog has
          its own focus + scroll behavior.
       2. Side panel open → arrows swap the open lens to its
          spatial / reading-order neighbor.
       3. Otherwise → arrows move the canvas cursor (selection
          treatment without opening the panel). Enter / Space on
          the cursor lens opens its panel. If a card button currently
          has DOM focus, we move focus along with the cursor so the
          two stay aligned for screen reader / keyboard users.

     We always skip arrows when the user is typing somewhere
     (input, textarea, contentEditable). */
  React.useEffect(() => {
    if (centerOpen || previewLensId) return
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const tag = target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) {
        return
      }
      // Don't steal modifiers; let browser keybindings work.
      if (event.metaKey || event.ctrlKey || event.altKey) return

      const dir = keyToDirection(event.key)

      if (openLensId) {
        if (!dir) return
        const next = neighborInDirection(deck.lenses, openLensId, dir)
        if (!next) return
        event.preventDefault()
        setOpenLensId(next)
        setCursorLensId(next)
        return
      }

      if (dir) {
        const next = neighborInDirection(deck.lenses, cursorLensId, dir)
        if (!next) return
        event.preventDefault()
        setCursorLensId(next)

        const nextEl = document.querySelector<HTMLElement>(
          `[data-lens-id="${next}"]`
        )

        /* Keep the moving cursor on-screen. The deck scrolls on short
           and mobile viewports, so an arrow press can land the
           selected card outside the viewport. `block`/`inline:
           'nearest'` only scrolls when the card is actually clipped,
           so navigating within the visible area stays still. Smooth
           unless the user prefers reduced motion. */
        nextEl?.scrollIntoView({
          block: 'nearest',
          inline: 'nearest',
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        })

        /* If a card button currently has focus, follow the cursor
           with focus too — otherwise leave focus where it was, so
           we don't yank focus into the canvas just because the user
           moved their mouse off-page and tapped an arrow.
           `preventScroll` so focus doesn't fight the smooth scroll
           we just kicked off. */
        const active = document.activeElement as HTMLElement | null
        if (active && active.dataset && active.dataset.lensId) {
          nextEl?.focus({ preventScroll: true })
        }
        return
      }

      if (event.key === 'Enter' || event.key === ' ') {
        /* Buttons handle their own Enter/Space when focused, so we
           only act when focus is *not* on a card button. */
        const active = document.activeElement as HTMLElement | null
        if (active && active.dataset && active.dataset.lensId) return
        if (!cursorLensId) return
        event.preventDefault()
        openLens(cursorLensId)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [
    centerOpen,
    openLensId,
    cursorLensId,
    openLens,
    previewLensId,
    prefersReducedMotion,
    deck.lenses
  ])

  const activeLens = previewLensId
    ? (deck.lensById[previewLensId] ?? null)
    : openLensId
      ? (deck.lensById[openLensId] ?? null)
      : null

  /* Selection treatment on the canvas reflects the open panel when
     one is open, otherwise the keyboard cursor. */
  const selectedLensId = previewLensId ?? openLensId ?? cursorLensId
  const previewPanelOpen = previewOverride?.panelOpen ?? true

  const frameClass = embedded
    ? `${styles.frame} ${styles.frameEmbedded}`
    : styles.frame

  return (
    <DeckProvider value={deck}>
      {/* Standalone mode owns the body class (notion + dark mode). When
          embedded, the host layout (e.g. PlaygroundLayout) sets these. */}
      {!embedded && (
        <BodyClassName className={isDarkMode ? 'notion dark-mode' : 'notion'} />
      )}

      <div
        ref={previewOverride ? setPreviewContainer : undefined}
        className={frameClass}
        data-animations={playAllAnimations ? 'playing' : undefined}
      >
        {!embedded && (
          <header className={styles.header}>
            <div className={styles.headerInner}>
              <Link
                href={deck.backHref}
                className={styles.homeBackButton}
                aria-label={
                  deck.backHref === '/' ? 'Back to home' : 'Back to deck index'
                }
              >
                <span className={styles.homeBackArrow} aria-hidden='true'>
                  ←
                </span>
              </Link>

              <div className={styles.headerRhs}>
                {!prefersReducedMotion && (
                  <PlayAnimationsButton
                    playing={playAllAnimations}
                    onToggle={() => setPlayAllAnimations((on) => !on)}
                  />
                )}
                {/* Quiet door to the model-authored decks — hidden at
                    rest and revealed on header hover, like the play
                    toggle beside it. Only on the original deck; the
                    LLM decks' back button already leads to /lenses/llms. */}
                {deck.key === 'wustep' && (
                  <Link
                    href='/lenses/llms'
                    className={`${styles.headerButton} ${styles.llmsDecksLink} ${styles.headerTip}`}
                    aria-label='Lenses, by language models'
                    data-tooltip='Lenses, by language models'
                  >
                    <SparklesIcon />
                  </Link>
                )}
                <LabsButton className={styles.headerButton} />
                <ThemeToggle
                  isDark={hasMounted ? isDarkMode : false}
                  onToggle={toggleDarkMode}
                  className={styles.headerButton}
                />
              </div>
            </div>
          </header>
        )}

        <Canvas
          stage={stage}
          prefersReducedMotion={prefersReducedMotion}
          activeLensId={selectedLensId}
          onOpenCenter={
            previewLensId ? () => undefined : () => setCenterOpen(true)
          }
          onOpenLens={previewOverride ? () => undefined : openLens}
          previewOverride={previewOverride}
        />
      </div>

      {previewOverride && !previewContainer ? null : (
        <SidePanel
          lens={previewLensId && !previewPanelOpen ? null : activeLens}
          onClose={
            previewOverride
              ? () => previewOverride.onPanelOpenChange?.(false)
              : closeLens
          }
          onOpenLens={previewOverride ? () => undefined : openLens}
          dismissOnOutside={dismissPanelOnOutside}
          previewOverride={
            previewOverride && previewContainer
              ? {
                  container: previewContainer,
                  palette: previewOverride.palette,
                  renderIllustration: previewOverride.renderIllustration
                }
              : undefined
          }
        />
      )}

      {!previewOverride && (
        <CenterDialog
          open={centerOpen}
          onOpenChange={setCenterOpen}
          onOpenLens={openLens}
        />
      )}

      {/* Dev-only design panel. Tree-shakes out in production because
          the JSX is gated on a build-time `isDev` constant. */}
      {isDev && hasMounted && !previewOverride && <DesignPanel />}
    </DeckProvider>
  )
}

/** Sparkles — marks the link to the model-authored decks. Same filled,
 *  single-color hand as the play/pause icons beside it. */
function SparklesIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      <path
        d='M11 4l1.7 4.3L17 10l-4.3 1.7L11 16l-1.7-4.3L5 10l4.3-1.7L11 4Z'
        fill='currentColor'
      />
      <path
        d='M17.75 13.5l.95 2.35 2.3.9-2.3.9-.95 2.35-.9-2.35-2.35-.9 2.35-.9.9-2.35Z'
        fill='currentColor'
      />
    </svg>
  )
}
