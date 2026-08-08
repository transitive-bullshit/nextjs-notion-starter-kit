import * as React from 'react'

import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

import styles from './PromptingPage.module.css'

type Area = 'ux' | 'perf' | 'debug' | 'arch'
type Depth = 'high' | 'mid' | 'low'
type Action = 'ask' | 'plan' | 'delegate'

const AREAS: Array<{ id: Area; label: string; short: string }> = [
  { id: 'ux', label: 'UX', short: 'UX' },
  { id: 'perf', label: 'Performance', short: 'Perf' },
  { id: 'debug', label: 'Debugging', short: 'Debug' },
  { id: 'arch', label: 'Architecture', short: 'Arch' }
]

const DEPTHS: Array<{ id: Depth; label: string; hint: string }> = [
  { id: 'high', label: 'High', hint: 'the overall feel' },
  { id: 'mid', label: 'Mid', hint: 'a component or flow' },
  { id: 'low', label: 'Low', hint: 'one specific line' }
]

function AskIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M7.9 20A9 9 0 1 0 4 16.1L2 22z' />
      <path d='M9.1 9a3 3 0 1 1 5.4 1.8c-.6.8-1.5 1.2-1.5 2.2' />
      <path d='M12 17h.01' />
    </svg>
  )
}

function PlanIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M8 6h13' />
      <path d='M8 12h13' />
      <path d='M8 18h13' />
      <circle cx='4' cy='6' r='1' />
      <circle cx='4' cy='12' r='1' />
      <circle cx='4' cy='18' r='1' />
    </svg>
  )
}

function DelegateIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M5 12h14' />
      <path d='m13 6 6 6-6 6' />
      <path d='M3 6v12' />
    </svg>
  )
}

const ACTIONS: Array<{
  id: Action
  label: string
  verb: string
  Icon: React.FC
}> = [
  { id: 'ask', label: 'Ask', verb: 'pull info back', Icon: AskIcon },
  { id: 'plan', label: 'Plan', verb: 'get a strategy', Icon: PlanIcon },
  { id: 'delegate', label: 'Delegate', verb: 'hand it off', Icon: DelegateIcon }
]

const PROMPTS: Record<Area, Record<Depth, Record<Action, string>>> = {
  ux: {
    high: {
      ask: 'What feels off about this whole page?',
      plan: 'How would you make this flow feel more polished — what should I do first?',
      delegate: 'Make this page prettier.'
    },
    mid: {
      ask: 'Why does the card hierarchy feel cluttered?',
      plan: 'Plan a redesign of the card component for better scannability.',
      delegate: 'Tighten the card spacing and visual weight.'
    },
    low: {
      ask: 'Why does the radius on these buttons look off?',
      plan: 'Walk me through a sensible radius and shadow for these buttons.',
      delegate: 'Set the buttons to border-radius 16px.'
    }
  },
  perf: {
    high: {
      ask: 'Where is time being spent on first paint?',
      plan: 'Plan an attack on first-paint, biggest wins first.',
      delegate: 'Cut first-paint time. Start with the heaviest hitters.'
    },
    mid: {
      ask: 'Why is this list re-rendering on every keystroke?',
      plan: 'Plan how to memoize this list without breaking selection.',
      delegate: 'Memoize this list. Verify selection still works.'
    },
    low: {
      ask: 'Why is this useEffect firing twice?',
      plan: 'How should I fix this useEffect double-fire safely?',
      delegate: 'Fix the dependency array on this useEffect.'
    }
  },
  debug: {
    high: {
      ask: 'What is most likely breaking in this checkout flow?',
      plan: 'Plan a triage approach for the failing checkout flow.',
      delegate: 'Get checkout green again.'
    },
    mid: {
      ask: 'Why is this auth middleware sometimes returning 401?',
      plan: 'Plan how to reproduce this auth flake locally.',
      delegate: 'Find and fix the intermittent 401 in auth.'
    },
    low: {
      ask: 'Why is this regex not matching trailing newlines?',
      plan: 'How should I update this regex to match trailing newlines safely?',
      delegate: 'Fix this regex to match trailing newlines.'
    }
  },
  arch: {
    high: {
      ask: "Where is this codebase heading that it isn't yet?",
      plan: 'Plan how to split this into clear modules.',
      delegate: 'Restructure this into clear modules. Propose, then do.'
    },
    mid: {
      ask: 'Should this state live in context or be lifted?',
      plan: 'Plan the migration of this slice from local state to a store.',
      delegate: 'Move this state into the store and update consumers.'
    },
    low: {
      ask: "Why does this file import three things from utils.ts that aren't used?",
      plan: 'Plan the cleanup of unused imports across this file.',
      delegate: 'Remove unused imports in this file.'
    }
  }
}

const TOUR: Array<{ area: Area; depth: Depth; action: Action }> = [
  { area: 'ux', depth: 'high', action: 'delegate' },
  { area: 'ux', depth: 'low', action: 'delegate' },
  { area: 'perf', depth: 'mid', action: 'plan' },
  { area: 'debug', depth: 'low', action: 'ask' },
  { area: 'arch', depth: 'high', action: 'plan' }
]

/** How long the tour holds on each step before advancing. Kept the same
 * regardless of prefers-reduced-motion — reduced motion means "don't
 * animate the swap," not "cycle through it faster." */
const TOUR_STEP_MS = 1700

/* ─────────────────────────────────────────────────────────
 * TREE DEMO INTERACTION
 *
 *    Coordinate state lives at the parent: { area, depth, action }
 *    Hover a cell  →  preview-update area + depth (no lock)
 *    Click a cell  →  same as hover but stops the running tour
 *    Action chip   →  swaps the verb on the generated prompt
 *
 *    Tour mode: when started, advances through TOUR every
 *    TOUR_STEP_MS, cycling through area/depth/action triples. Any user
 *    interaction (chip click, chip arrow-key, cell click, button click)
 *    stops it. Under prefers-reduced-motion the tour keeps the same
 *    cadence — it still needs to be readable — but the generated-prompt
 *    swap reuses the same DOM node instead of remounting into a fresh
 *    fade-in, so there's no animation for reduced motion to skip.
 * ───────────────────────────────────────────────────────── */

export function TreeDemo() {
  const [area, setArea] = React.useState<Area>('ux')
  const [depth, setDepth] = React.useState<Depth>('mid')
  const [action, setAction] = React.useState<Action>('ask')
  const [touring, setTouring] = React.useState(false)
  const tourRef = React.useRef<number | null>(null)
  const actionTabRefs = React.useRef<Array<HTMLButtonElement | null>>([])
  const prefersReducedMotion = usePrefersReducedMotion()

  const stopTour = React.useCallback(() => {
    if (tourRef.current != null) {
      window.clearTimeout(tourRef.current)
      tourRef.current = null
    }
    setTouring(false)
  }, [])

  React.useEffect(() => stopTour, [stopTour])

  const startTour = () => {
    if (touring) {
      stopTour()
      return
    }
    setTouring(true)
    let i = 0
    const step = () => {
      const next = TOUR[i % TOUR.length]!
      setArea(next.area)
      setDepth(next.depth)
      setAction(next.action)
      i += 1
      tourRef.current = window.setTimeout(step, TOUR_STEP_MS)
    }
    step()
  }

  // Roving-tabindex tabs pattern: ArrowLeft/ArrowRight move focus AND
  // selection (wrapping at the ends), Home/End jump to the first/last tab.
  const moveAction = (targetIndex: number) => {
    const len = ACTIONS.length
    const nextIndex = ((targetIndex % len) + len) % len
    if (touring) stopTour()
    setAction(ACTIONS[nextIndex]!.id)
    actionTabRefs.current[nextIndex]?.focus()
  }

  const handleActionKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        moveAction(index + 1)
        break
      case 'ArrowLeft':
        e.preventDefault()
        moveAction(index - 1)
        break
      case 'Home':
        e.preventDefault()
        moveAction(0)
        break
      case 'End':
        e.preventDefault()
        moveAction(ACTIONS.length - 1)
        break
      default:
        break
    }
  }

  const prompt = PROMPTS[area][depth][action]
  // Reduced motion: keep the same node so the text swaps in place instead
  // of remounting into the (otherwise CSS-driven) fade-in.
  const promptKey = prefersReducedMotion
    ? 'static'
    : `${area}-${depth}-${action}`

  return (
    <div className={styles.tree}>
      <div className={styles.treeActions} role='tablist' aria-label='Action'>
        {ACTIONS.map((a, i) => {
          const active = action === a.id
          const Icon = a.Icon
          return (
            <button
              key={a.id}
              ref={(el) => {
                actionTabRefs.current[i] = el
              }}
              type='button'
              role='tab'
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              className={`${styles.treeActionButton} ${active ? styles.treeActionActive : ''}`}
              onClick={() => {
                if (touring) stopTour()
                setAction(a.id)
              }}
              onKeyDown={(e) => handleActionKeyDown(e, i)}
            >
              <span className={styles.treeActionIcon} aria-hidden='true'>
                <Icon />
              </span>
              <span className={styles.treeActionText}>
                <span className={styles.treeActionLabel}>{a.label}</span>
                <span className={styles.treeActionVerb}>{a.verb}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div className={styles.treeGridWrap}>
        {/*
         * `.treeGrid` lays its children out with CSS Grid using implicit
         * row placement across one flat list (label cells + action
         * cells, 5 columns wide). A real ARIA grid needs `role="row"`
         * wrappers per row plus 2D arrow-key cell navigation — adding
         * those wrappers here would insert extra DOM nodes into the CSS
         * grid's child list and break the column auto-placement this
         * layout relies on. Since every cell is already a real,
         * individually focusable/operable <button> with its own
         * accessible name (aria-label below), we downgrade honestly to a
         * labelled group of toggle buttons rather than fake grid/gridcell
         * semantics with no matching interaction model.
         */}
        <div
          className={styles.treeGrid}
          role='group'
          aria-label='Area and depth matrix'
        >
          <div />
          {AREAS.map((a) => (
            <div
              key={a.id}
              className={`${styles.treeColLabel} ${a.id === area ? styles.treeAxisActive : ''}`}
            >
              <span className={styles.treeColLabelFull}>{a.label}</span>
              <span className={styles.treeColLabelShort}>{a.short}</span>
            </div>
          ))}
          {DEPTHS.map((d) => (
            <React.Fragment key={d.id}>
              <div
                className={`${styles.treeRowLabel} ${d.id === depth ? styles.treeAxisActive : ''}`}
              >
                <span className={styles.treeRowLabelText}>{d.label}</span>
                <span className={styles.treeRowLabelHint}>{d.hint}</span>
              </div>
              {AREAS.map((a) => {
                const active = area === a.id && depth === d.id
                const onAxis = area === a.id || depth === d.id
                return (
                  <button
                    key={`${a.id}-${d.id}`}
                    type='button'
                    aria-pressed={active}
                    className={`${styles.treeCell} ${active ? styles.treeCellActive : ''} ${
                      !active && onAxis ? styles.treeCellOnAxis : ''
                    }`}
                    onClick={() => {
                      if (touring) stopTour()
                      setArea(a.id)
                      setDepth(d.id)
                    }}
                    onMouseEnter={() => {
                      if (touring) return
                      setArea(a.id)
                      setDepth(d.id)
                    }}
                    aria-label={`${a.label} · ${d.label}`}
                  >
                    <span className={styles.treeCellDot} aria-hidden='true' />
                  </button>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className={styles.treeOutputCard}>
        <div className={styles.treeOutputHeader}>
          <span className={styles.treeOutputLabel}>Generated prompt</span>
          <span className={styles.treeOutputCoord}>
            {AREAS.find((a) => a.id === area)?.label} ·{' '}
            {DEPTHS.find((d) => d.id === depth)?.label} ·{' '}
            {ACTIONS.find((a) => a.id === action)?.label}
          </span>
        </div>
        <div className={styles.treeOutputBody}>
          <p key={promptKey} className={styles.treeOutputText}>
            {prompt}
          </p>
        </div>
      </div>

      <button
        type='button'
        className={`${styles.treeTour} ${touring ? styles.treeTourActive : ''}`}
        onClick={startTour}
      >
        {touring ? 'Stop tour' : 'Take a tour'}{' '}
        <span aria-hidden='true'>{touring ? '■' : '→'}</span>
      </button>
    </div>
  )
}
