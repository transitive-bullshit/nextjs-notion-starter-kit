import * as React from 'react'

import { BombermanCover } from '@/components/wustep/BombermanCover'
import { BombermanCoverA } from '@/components/wustep/BombermanCoverA'
import { BombermanCoverC } from '@/components/wustep/BombermanCoverC'
import { BombermanCoverD } from '@/components/wustep/BombermanCoverD'
import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'
import { SplashPanicCover } from '@/components/wustep/SplashPanicCover'
import { SplashPanicCoverB } from '@/components/wustep/SplashPanicCoverB'
import { SplashPanicCoverC } from '@/components/wustep/SplashPanicCoverC'

// Dev-only workbench for playground covers: one tab per project, each
// rendering its covers inside real card markup at the two widths that
// matter — the shipped cover first, then the unshipped variants from the
// exploration (playground-entry skill), kept so the comparison record
// survives the pick.
export const getStaticProps = () =>
  process.env.NODE_ENV === 'production'
    ? { notFound: true as const }
    : { props: {} }

type CoverPreview = {
  label: string
  hint: string
  Cover: React.ComponentType
}

type Tab = {
  id: string
  title: string
  summary: string
  covers: CoverPreview[]
}

// Non-empty tuple type so the active-tab fallback below typechecks under
// noUncheckedIndexedAccess.
const tabs: [Tab, ...Tab[]] = [
  {
    id: 'splashpanic',
    title: 'Splash Panic!',
    summary: 'Multiplayer water-balloon chaos with bubble traps & rescues',
    covers: [
      {
        label: 'Meadow standoff (shipped)',
        hint: 'Hover: the fuse runs — throb, blush, plus-splash along the grid axes, flinch, re-inflate.',
        Cover: SplashPanicCover
      },
      {
        label: 'B — Poster (unshipped)',
        hint: 'Hover: wordmark wiggles, balloon drifts, bubbled Pip bobs, droplets twinkle.',
        Cover: SplashPanicCoverB
      },
      {
        label: 'C — Bubbled! (unshipped)',
        hint: 'Ambient bob; hover pops the bubble — Splash drops free, then it re-forms.',
        Cover: SplashPanicCoverC
      }
    ]
  },
  {
    id: 'bomberman',
    title: 'Bomberman',
    summary: 'Two-player Bomberman clone with pets & power-ups',
    covers: [
      {
        label: 'Board vignette (shipped)',
        hint: 'Hover: the 💣 heats red like in-game, then every blast tile blooms the game’s 🌸 explosion.',
        Cover: BombermanCover
      },
      {
        label: 'A — Prompt → game (unshipped)',
        hint: 'Chat card asks, the arena answers. Hover: typing dots, bomb wobble, plus-burst of 🔥.',
        Cover: BombermanCoverA
      },
      {
        label: 'C — The prompt file (unshipped)',
        hint: 'bomberman.tsx in a dark editor. Hover: caret blinks, literals glow, 💥 beside explode().',
        Cover: BombermanCoverC
      },
      {
        label: 'D — The bomb (unshipped)',
        hint: 'Giant 💣 under a spotlight, tokens drifting. Hover: fuse shiver → hard-cut 💥 + shockwave.',
        Cover: BombermanCoverD
      }
    ]
  }
]

function PreviewCard({
  Cover,
  id,
  title,
  summary,
  width
}: {
  Cover: React.ComponentType
  id: string
  title: string
  summary: string
  width: number
}) {
  // An anchor, like the real card on /playground, so hover/focus behave
  // identically; the self-href keeps it focusable without navigating away.
  return (
    <a
      id={id}
      href={`#${id}`}
      className='group notion-collection-card overflow-hidden'
      style={{ width }}
    >
      <div className='notion-collection-card-cover aspect-video w-full'>
        <Cover />
      </div>
      <div className='notion-collection-card-body p-4'>
        <h3 className='font-semibold mb-1'>{title}</h3>
        <p className='text-sm text-muted-foreground'>{summary}</p>
      </div>
    </a>
  )
}

/* ─────────────────────────────────────────────────────────
 * TAB INTERACTION STORYBOARD
 *
 *  hover    text lifts to foreground, soft wash fades in (150ms)
 *  press    button dips to 98% while held
 *  select   the underline slides and resizes to the new tab
 *           (240ms, ease-out quint — no bounce)
 *  keyboard ←/→ move + select, Home/End jump, ring on :focus-visible
 *  reduced  wash still fades; the underline jumps instead of sliding
 * ───────────────────────────────────────────────────────── */

// Underline slide; hover/press timing lives in the Tailwind classes below.
const TAB_SLIDE_MS = 240
const TAB_SLIDE_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

export default function CoversPreviewPage() {
  const [active, setActive] = React.useState(0)
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([])
  const listRef = React.useRef<HTMLDivElement | null>(null)
  const [indicator, setIndicator] = React.useState({ left: 0, width: 0 })
  const [reduceMotion, setReduceMotion] = React.useState(false)

  React.useEffect(() => {
    setReduceMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  }, [])

  // The underline is one shared element measured off the active tab, so it
  // can travel between tabs instead of blinking from one to the other.
  const measure = React.useCallback(() => {
    const el = tabRefs.current[active]
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth })
  }, [active])

  React.useEffect(() => {
    measure()
    // Re-measure on reflow (sidebar collapse, font swap, window resize).
    const list = listRef.current
    if (!list || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [measure])

  // Standard tablist keyboarding: arrows move + select, Home/End jump.
  const onTabKeyDown = (event: React.KeyboardEvent) => {
    const last = tabs.length - 1
    let next: number | null = null
    if (event.key === 'ArrowRight') next = active === last ? 0 : active + 1
    else if (event.key === 'ArrowLeft') next = active === 0 ? last : active - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    if (next !== null) {
      event.preventDefault()
      setActive(next)
      tabRefs.current[next]?.focus()
    }
  }

  const activeTab = tabs[active] ?? tabs[0]

  return (
    <PlaygroundLayout
      title='Covers preview'
      breadcrumbs={[{ label: 'Covers preview' }]}
    >
      <div className='space-y-8'>
        <p className='text-muted-foreground'>
          Playground covers inside real card markup, at grid width (420px) and
          full-column width (620px). Hover or focus a card to run its animation.
        </p>

        <div
          ref={listRef}
          role='tablist'
          aria-label='Cover previews by project'
          className='relative flex gap-1 border-b border-border pb-0.5'
        >
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              role='tab'
              id={`tab-${tab.id}`}
              aria-selected={i === active}
              aria-controls={`panel-${tab.id}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onTabKeyDown}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition-all duration-150 hover:bg-muted/60 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent motion-reduce:active:scale-100 ${
                i === active
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.title}
            </button>
          ))}
          {/* Shared underline; travels between tabs (see storyboard). The
              transition is inlined because arbitrary transition-property
              utilities proved unreliable here; reduced motion zeroes the
              duration so the underline jumps instead. */}
          <span
            aria-hidden='true'
            className='absolute -bottom-px left-0 h-0.5 rounded-full bg-foreground'
            style={{
              transform: `translateX(${indicator.left}px)`,
              width: indicator.width,
              transitionProperty: 'transform, width',
              transitionDuration: reduceMotion ? '0ms' : `${TAB_SLIDE_MS}ms`,
              transitionTimingFunction: TAB_SLIDE_EASE
            }}
          />
        </div>

        <div
          role='tabpanel'
          id={`panel-${activeTab.id}`}
          aria-labelledby={`tab-${activeTab.id}`}
          className='space-y-8'
        >
          {activeTab.covers.map(({ label, hint, Cover }) => (
            <section key={label} className='space-y-3'>
              <h2 className='font-semibold'>{label}</h2>
              <p className='text-sm text-muted-foreground'>{hint}</p>
              <div className='flex flex-wrap items-start gap-6'>
                <PreviewCard
                  Cover={Cover}
                  id={`${activeTab.id}-420`}
                  title={activeTab.title}
                  summary={activeTab.summary}
                  width={420}
                />
                <PreviewCard
                  Cover={Cover}
                  id={`${activeTab.id}-620`}
                  title={activeTab.title}
                  summary={activeTab.summary}
                  width={620}
                />
              </div>
            </section>
          ))}
        </div>
      </div>
    </PlaygroundLayout>
  )
}
