import Link from 'next/link'
import * as React from 'react'
import BodyClassName from 'react-body-classname'

import { ColleagueDemo } from './ColleagueDemo'
import { EquationDemo, LeverChip } from './EquationDemo'
import styles from './PromptingPresentation.module.css'
import { PromptInputDemo } from './PromptInputDemo'

type Visual =
  | { kind: 'section'; number: string; label: string }
  | { kind: 'promptDemo' }
  | { kind: 'agenda' }
  | { kind: 'pawn' }
  | { kind: 'elo' }
  | { kind: 'fork' }
  | { kind: 'skillIssue' }
  | { kind: 'eloPractice' }
  | { kind: 'quoteAvatar' }
  | { kind: 'pygmalion' }
  | { kind: 'equationDemo' }
  | { kind: 'none' }
  | { kind: 'toolLever' }
  | { kind: 'modelLever' }
  | { kind: 'effortLever' }
  | { kind: 'promptLever' }
  | { kind: 'contextLever' }
  | { kind: 'moves' }
  | { kind: 'yoloExtract' }
  | { kind: 'rules' }
  | { kind: 'audienceQ' }
  | { kind: 'treeDemo' }
  | { kind: 'choice' }
  | { kind: 'colleagueDemo' }
  | { kind: 'colleague' }
  | { kind: 'brief' }
  | { kind: 'timeline' }
  | { kind: 'stagger' }
  | { kind: 'fanout' }
  | { kind: 'roles' }
  | { kind: 'contract' }
  | { kind: 'close' }
  | { kind: 'finalCard' }
  | { kind: 'qa' }

type Slide = {
  eyebrow: string
  title: string
  body?: string
  note: string
  visual: Visual
  tone?: 'dark' | 'paper'
  layout?: 'standard' | 'visual' | 'icon' | 'quote'
}

export const SLIDES: Slide[] = [
  {
    eyebrow: 'Opening',
    title: 'It’s 2026 and coding looks a lot more like this.',
    note: 'Use the actual intro from the article. More and more, engineering is talking to machines. Let the prompt demo fail; that sets up the rest of the talk.',
    visual: { kind: 'promptDemo' },
    tone: 'dark'
  },
  {
    eyebrow: 'The question',
    title:
      'What does it mean to be good at talking to Claude, Codex, or whatever comes next?',
    note: 'This is the question at the end of the intro chapter. The structure should feel like the article: mindset, equation, techniques, map, orchestration, recap.',
    visual: { kind: 'none' },
    tone: 'dark',
    layout: 'quote'
  },
  {
    eyebrow: 'The plan',
    title: '',
    note: 'Let the structure become the table of contents for the talk.',
    visual: { kind: 'agenda' },
    layout: 'quote'
  },
  {
    eyebrow: 'Section 01',
    title: 'The beginner’s mindset.',
    note: 'Section break. This starts the mindset chapter: we are early, and the people still learning are going to pull away.',
    visual: { kind: 'section', number: '01', label: 'Mindset' },
    tone: 'dark',
    layout: 'visual'
  },
  {
    eyebrow: 'Chess is 500 years old',
    title: 'AI coding is barely 3 years old.',
    note: 'Use the pawn to make the chess analogy concrete. The point: the meta has barely been uncovered.',
    visual: { kind: 'pawn' },
    tone: 'dark',
    layout: 'icon'
  },
  {
    eyebrow: 'Beginner mindset',
    title: 'Three years in is about 1200 ELO.',
    body: 'Past most casual players. Nowhere near expert. Even Magnus is learning new things all the time.',
    note: 'Use the chess analogy from the article. The important bit is: do not trust the feeling of competence too early.',
    visual: { kind: 'elo' }
  },
  {
    eyebrow: 'Two responses',
    title: 'Sooner or later the model will let you down.',
    note: 'This slide should be mostly visual. Closed: blame the AI. Open: ask what you could have done differently. That is the article’s core posture.',
    visual: { kind: 'fork' },
    tone: 'dark'
  },
  {
    eyebrow: 'Gaming culture has a useful phrase',
    title: 'Skill issue.',
    body: "It isn't always true, but it pushes you to get the most out of models.",
    note: 'The article’s strongest mindset line. When your character keeps dying, the level isn’t broken — you’re missing something. Sounds flippant; the move underneath is serious.',
    visual: { kind: 'skillIssue' },
    tone: 'dark',
    layout: 'quote'
  },
  {
    eyebrow: 'Practice curve',
    title: 'Every useful failure can become a little ELO.',
    note: 'Like doing one chess puzzle every day. Try something new, notice what worked, update your repertoire. Or: close the question with “the model is bad,” stop practicing, regress.',
    visual: { kind: 'eloPractice' }
  },
  {
    eyebrow: 'Pragmatic optimism',
    title:
      '“I suggest just being 2 or 10 times more ambitious than before, because it might just work.”',
    note: 'Pragmatic optimism strategy. The point is not blind hype. It is a useful prior: try the slightly more ambitious thing before assuming the boundary is fixed.',
    visual: { kind: 'quoteAvatar' },
    tone: 'dark',
    layout: 'quote'
  },
  {
    eyebrow: 'Q',
    title: 'When the work disappoints you, what do you usually do?',
    note: 'Open-ended — let people share whatever shape this takes for them. Listen for whether they look outward (blame the thing) or inward (what did I miss).',
    visual: { kind: 'audienceQ' },
    tone: 'dark'
  },
  {
    eyebrow: 'Section 02',
    title: 'Pull the levers.',
    note: 'Section break. Shift from posture to diagnosis: what part of the setup produced this output?',
    visual: { kind: 'section', number: '02', label: 'The equation' },
    tone: 'paper',
    layout: 'visual'
  },
  {
    eyebrow: 'The simplest frame is an equation',
    title: 'Better inputs. Better outputs.',
    note: 'Use the article equation. First AGENT × INPUT, then expand it. This is the frame everything else hangs on. Walk the four levers when output disappoints.',
    visual: { kind: 'equationDemo' },
    tone: 'dark',
    layout: 'visual'
  },
  {
    eyebrow: 'Tool',
    title: 'Tools are changing every day.',
    note: 'Most of us are already on agent-native tools. The point is: don’t bolt AI onto VSCode. Cursor, Claude Code, Codex slice context smarter, manage long tasks, persist state, and inject project-aware system prompts. Tool is the smallest of the four levers, but it’s the easiest one to pull.',
    visual: { kind: 'toolLever' },
    tone: 'dark'
  },
  {
    eyebrow: 'Model',
    title: 'Use the best model.',
    note: 'Pick the smartest model the work warrants. Walk down the article guide: fast/Sonnet, taste/Opus, hard/GPT-5.5, ambiguous/thinking on.',
    visual: { kind: 'modelLever' },
    tone: 'dark'
  },
  {
    eyebrow: 'Effort',
    title: 'The cheap dial nobody touches.',
    note: 'Thinking effort is becoming one of the most important levers. Low for trivial edits, medium for executing, high for real decisions, xhigh for novel problems. And: stop using Auto mode. It’s optimized for platform margin, not your output.',
    visual: { kind: 'effortLever' },
    tone: 'dark'
  },
  {
    eyebrow: 'Prompt',
    title: 'Clarity is everything.',
    note: 'Walk the article comparison: “make this faster” vs “first paint is 2.4s, target under 1s, profile and start with the biggest wins.” Then the don’ts: “be careful,” “think step by step,” politeness padding.',
    visual: { kind: 'promptLever' },
    tone: 'dark'
  },
  {
    eyebrow: 'Context',
    title: 'When in doubt, load more context.',
    note: 'Load: project rules, related PR, design doc, screenshots, the failing trace, MCPs into your actual systems. If you’re rewriting the same prompt for the fifth time, stop — the lever you need is the next one.',
    visual: { kind: 'contextLever' },
    tone: 'dark'
  },
  {
    eyebrow: 'Persistent context',
    title: 'Don’t repeat yourself to the agent.',
    body: 'Five minutes of investment that pays back forever.',
    note: 'Project rules are the longest-leverage context you can write. CLAUDE.md, AGENTS.md, .cursorrules — the same paragraph that gets a new hire from “lost” to “useful” in a week does the same for the agent. Capture the things you find yourself correcting twice.',
    visual: { kind: 'rules' },
    tone: 'dark'
  },
  {
    eyebrow: 'Q',
    title:
      'When did you realize you had a lever to pull, and outputs got suddenly better?',
    note: 'Open-ended — the "aha" moment. Look for the specific lever they discovered: switching tools, turning thinking on, dropping in a real doc, writing a CLAUDE.md.',
    visual: { kind: 'audienceQ' },
    tone: 'dark'
  },
  {
    eyebrow: 'Section 03',
    title: 'Collect moves.',
    note: 'Section break. This is the techniques portion of the article: prompting as a repertoire of small moves.',
    visual: { kind: 'section', number: '03', label: 'Techniques' },
    tone: 'dark',
    layout: 'visual'
  },
  {
    eyebrow: 'Techniques',
    title: 'Build a repertoire.',
    note: 'This comes straight from the techniques chapter: openings, tactics, pressure-test, pay it forward. Keep the slide light: the moves are grouped so the structure is part of the lesson.',
    visual: { kind: 'moves' },
    tone: 'dark',
    layout: 'visual'
  },
  {
    eyebrow: 'My new favorite',
    title: 'YOLO and extract.',
    body: 'Big context. Ambitious prompt. Disposable PR. Harvest the wins.',
    note: 'My new favorite technique. Have agents complete a huge chunk of work in a single PR — a whole milestone, not a single change. Then treat the PR as disposable: extract the parts you like as smaller PRs, or as insights. The dial is hands-on (ask along the way, edit the plan) versus YOLO (let it decide). Spec-heavy work goes hands-on; open-ended exploration goes YOLO. Load lots of context — docs, Figma, prior PRs, RFCs. Tell it to commit incrementally so you can cherry-pick. GPT for the run; Opus for the PR description. Trust that something in there is useful, even when most of it is wrong.',
    visual: { kind: 'yoloExtract' },
    tone: 'dark',
    layout: 'visual'
  },
  {
    eyebrow: 'Q',
    title: 'What techniques do you keep coming back to?',
    note: "Open-ended — patterns people lean on, not just prompts. Could be openings, recovery moves, things they stole from a teammate, things they've done since forever.",
    visual: { kind: 'audienceQ' },
    tone: 'dark'
  },
  {
    eyebrow: 'Section 04',
    title: 'Explore the map.',
    note: 'Section break. The next step after collecting moves is knowing where each move belongs.',
    visual: { kind: 'section', number: '04', label: 'The map' },
    tone: 'dark',
    layout: 'visual'
  },
  {
    eyebrow: 'The map',
    title: 'Every change lives somewhere on a 2D map.',
    body: 'Breadth × depth. Where you are tells you what to write.',
    note: 'Use the interactive article map. The axes are breadth (which area of code) and depth (how zoomed in). At any cell, three moves: ask, plan, or delegate. Click around so the room sees the prompt change with the cell.',
    visual: { kind: 'treeDemo' },
    tone: 'dark',
    layout: 'visual'
  },
  {
    eyebrow: 'Choosing your move',
    title: 'Pick the move that fits the cell.',
    body: 'The most expensive prompts are the ones in the wrong cell.',
    note: 'Tie the map to the three moves with real examples. Ask when you don’t know yet. Plan when you know what but not how. Delegate only when the path is clear and the result is gradeable. Calibration is most of the skill.',
    visual: { kind: 'choice' },
    tone: 'dark',
    layout: 'visual'
  },
  {
    eyebrow: 'Q',
    title: 'What’s your mental model for talking to the AI?',
    note: 'Open it up. Listen for metaphors people already use: intern, pair programmer, search engine, compiler, reviewer, weird teammate.',
    visual: { kind: 'audienceQ' },
    tone: 'dark'
  },
  {
    eyebrow: 'Section 05',
    title: 'Conduct the fleet.',
    note: 'Section break. This starts orchestration: from one prompt at a time to managing several runs.',
    visual: { kind: 'section', number: '05', label: 'Orchestration' },
    tone: 'dark',
    layout: 'visual'
  },
  {
    eyebrow: 'Orchestration',
    title: 'Think in hours, not messages.',
    note: 'Use the article’s pinging-versus-full-prompt example. The model loses nothing by knowing the destination; you lose four context switches.',
    visual: { kind: 'brief' },
    tone: 'dark'
  },
  {
    eyebrow: 'Chain, don’t ping',
    title: 'Same work. Less idle time and context switching.',
    note: 'This is the first orchestration visual. The grey blocks are you deciding what to type next. That is the hidden cost.',
    visual: { kind: 'timeline' },
    tone: 'dark',
    layout: 'visual'
  },
  {
    eyebrow: 'Stagger and overlap',
    title: 'They run together. You can’t.',
    note: 'Use the article’s cascade idea. Purple is you and never overlaps. Pink is the agent and overlaps freely. Grey is the small but real cost of switching attention between threads.',
    visual: { kind: 'stagger' },
    tone: 'dark'
  },
  {
    eyebrow: 'Fan out',
    title: 'Try spawning sub-agents.',
    note: 'Good candidates: tests beside implementation, unrelated bugs, library spikes. Bad candidates: chains where B needs A’s output. Budget for the merge — three branches become one review queue.',
    visual: { kind: 'fanout' }
  },
  {
    eyebrow: 'Long jobs',
    title: 'Long runs need a contract, not babysitting.',
    note: 'Talk about the instinct to hover. If the task can survive without you, the agent can return a branch instead of a half-finished conversation. The contract is goal, clarity, success criterion, judgment boundary, and fallback.',
    visual: { kind: 'contract' }
  },
  {
    eyebrow: 'Q',
    title: 'How do you manage many agents at once?',
    note: 'This should pull out practical habits: naming threads, staggered task descriptions, review queues, keeping scope boundaries sharp.',
    visual: { kind: 'audienceQ' },
    tone: 'dark'
  },
  {
    eyebrow: 'Section 06',
    title: 'Keep climbing.',
    note: 'Section break. This is the recap: we are early, the skill is real, and there is a lot left to learn.',
    visual: { kind: 'section', number: '06', label: 'Recap' },
    tone: 'paper',
    layout: 'visual'
  },
  {
    eyebrow: 'Six reminders before you go',
    title: 'The whole talk in one page.',
    note: 'Six recap cards — one per chapter — each with the chapter’s single sharpest line.',
    visual: { kind: 'close' },
    layout: 'visual'
  },
  {
    eyebrow: 'The next 1200 is wide open',
    title: 'Keep climbing.',
    note: 'Final card. Close with a direct invitation to practice.',
    visual: { kind: 'finalCard' },
    tone: 'dark',
    layout: 'quote'
  },
  {
    eyebrow: 'Q&A',
    title: 'Q&A',
    note: 'Open floor. Seed prompts if it goes quiet: what surprised you, what would you push back on, what would you ship tomorrow.',
    visual: { kind: 'qa' },
    tone: 'dark',
    layout: 'quote'
  }
]

function slideIndexFromHash() {
  const raw = window.location.hash.replace('#', '')
  const number = Number.parseInt(raw, 10)

  if (Number.isFinite(number) && number >= 1 && number <= SLIDES.length) {
    return number - 1
  }

  return 0
}

// For any slide, find the most recent `section` slide at or before it and
// return its label. Lets the footer show "Mindset" on slides 4–11 even
// though only slide 4 itself is the section card.
function sectionLabelAt(index: number): string {
  for (let i = index; i >= 0; i--) {
    const slide = SLIDES[i]
    if (slide?.visual.kind === 'section') return slide.visual.label
  }
  return ''
}

export function PromptingPresentation() {
  const [index, setIndex] = React.useState(0)
  const [goToOpen, setGoToOpen] = React.useState(false)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [chromeIdle, setChromeIdle] = React.useState(false)
  const current = SLIDES[index] ?? SLIDES[0]!
  const sectionLabel = sectionLabelAt(index)

  const go = React.useCallback((next: number) => {
    setIndex(Math.max(0, Math.min(SLIDES.length - 1, next)))
  }, [])

  const toggleFullscreen = React.useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    } else {
      document.documentElement.requestFullscreen().catch(() => {})
    }
  }, [])

  React.useEffect(() => {
    const handle = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', handle)
    return () => document.removeEventListener('fullscreenchange', handle)
  }, [])

  // Auto-hide the header/controls/progress in fullscreen after 2.5s
  // of mouse inactivity; reveal on any pointer activity.
  React.useEffect(() => {
    if (!isFullscreen) {
      setChromeIdle(false)
      return
    }
    let timer: number | undefined
    const wake = () => {
      setChromeIdle(false)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setChromeIdle(true), 2500)
    }
    wake()
    window.addEventListener('mousemove', wake)
    window.addEventListener('keydown', wake)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('mousemove', wake)
      window.removeEventListener('keydown', wake)
    }
  }, [isFullscreen])

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLElement &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)
      ) {
        return
      }

      // ESC closes go-to overlay; if not open, it's a no-op.
      if (event.key === 'Escape') {
        if (goToOpen) {
          event.preventDefault()
          setGoToOpen(false)
        }
        return
      }

      // While the overlay is open, swallow nav keys so numbers can be typed.
      if (goToOpen) return

      if (
        event.key === 'ArrowRight' ||
        event.key === 'PageDown' ||
        event.key === ' '
      ) {
        event.preventDefault()
        go(index + 1)
      }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault()
        go(index - 1)
      }
      if (event.key === 'Home') {
        event.preventDefault()
        go(0)
      }
      if (event.key === 'End') {
        event.preventDefault()
        go(SLIDES.length - 1)
      }
      if (event.key === 'g' || event.key === 'G') {
        event.preventDefault()
        setGoToOpen(true)
      }
      if (event.key === 'f' || event.key === 'F') {
        event.preventDefault()
        toggleFullscreen()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [go, index, goToOpen, toggleFullscreen])

  React.useEffect(() => {
    const syncFromHash = () => setIndex(slideIndexFromHash())

    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => {
      window.removeEventListener('hashchange', syncFromHash)
    }
  }, [])

  React.useEffect(() => {
    window.history.replaceState(null, '', `#${index + 1}`)
  }, [index])

  return (
    <>
      <BodyClassName className='notion dark-mode' />
      <main
        className={`${styles.presenter} ${
          isFullscreen ? styles.presenterFullscreen : ''
        } ${chromeIdle ? styles.presenterIdle : ''}`}
      >
        <header className={styles.chrome}>
          <Link href='/prompting' className={styles.backLink}>
            How to talk to coding agents
          </Link>
          <div className={styles.controls}>
            <Link
              href={`/prompting/notes#${index + 1}`}
              className={styles.controlButton}
            >
              Notes
            </Link>
            <button
              type='button'
              className={styles.iconButton}
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title='Toggle fullscreen (F)'
            >
              {isFullscreen ? (
                <FullscreenExitGlyph />
              ) : (
                <FullscreenEnterGlyph />
              )}
            </button>
            <button
              type='button'
              className={styles.iconButton}
              onClick={() => go(index - 1)}
              disabled={index === 0}
              aria-label='Previous slide'
            >
              ←
            </button>
            <span className={styles.counter}>
              {String(index + 1).padStart(2, '0')} / {SLIDES.length}
            </span>
            <button
              type='button'
              className={styles.iconButton}
              onClick={() => go(index + 1)}
              disabled={index === SLIDES.length - 1}
              aria-label='Next slide'
            >
              →
            </button>
          </div>
        </header>

        <section
          key={index}
          className={`${styles.slide} ${
            current.tone === 'dark' ? styles.slideDark : styles.slidePaper
          } ${current.layout === 'visual' ? styles.slideVisualFirst : ''} ${
            current.layout === 'icon' ? styles.slideIconOnly : ''
          } ${current.layout === 'quote' ? styles.slideQuoteOnly : ''}`}
          aria-live='polite'
        >
          {(current.eyebrow || current.title || current.body) && (
            <div className={styles.copy}>
              {current.eyebrow && (
                <div className={styles.eyebrow}>
                  <span className={styles.eyebrowMark} aria-hidden='true' />
                  {current.eyebrow}
                </div>
              )}
              {current.title && <h1>{current.title}</h1>}
              {current.body && <p>{current.body}</p>}
            </div>
          )}
          <VisualBlock slide={current} />
          <div className={styles.slideFooter}>
            <span>
              {String(index + 1).padStart(2, '0')}
              {sectionLabel && (
                <>
                  <i aria-hidden='true'>·</i>
                  {sectionLabel}
                </>
              )}
            </span>
          </div>
        </section>

        <div className={styles.progress} aria-hidden='true'>
          <span
            style={{ transform: `scaleX(${(index + 1) / SLIDES.length})` }}
          />
        </div>

        {goToOpen && (
          <GoToOverlay
            count={SLIDES.length}
            onClose={() => setGoToOpen(false)}
            onPick={(target) => {
              setGoToOpen(false)
              go(target)
            }}
          />
        )}
      </main>
    </>
  )
}

function FullscreenEnterGlyph() {
  return (
    <svg
      viewBox='0 0 16 16'
      width='14'
      height='14'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4' />
    </svg>
  )
}

function FullscreenExitGlyph() {
  return (
    <svg
      viewBox='0 0 16 16'
      width='14'
      height='14'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M6 2v4H2M10 2v4h4M6 14v-4H2M10 14v-4h4' />
    </svg>
  )
}

function GoToOverlay({
  count,
  onClose,
  onPick
}: {
  count: number
  onClose: () => void
  onPick: (target: number) => void
}) {
  const [value, setValue] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const scrimRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const previouslyFocused = document.activeElement
    inputRef.current?.focus()
    return () => {
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [])

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const parsed = Number.parseInt(value, 10)
    if (Number.isFinite(parsed) && parsed >= 1 && parsed <= count) {
      onPick(parsed - 1)
    } else {
      onClose()
    }
  }

  // Modal behavior the window-level handler can't provide: Escape works
  // even while the input is focused, and Tab cycles inside the dialog.
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      onClose()
      return
    }
    if (event.key !== 'Tab') return
    const focusables =
      scrimRef.current?.querySelectorAll<HTMLElement>('button, input')
    if (!focusables?.length) return
    const first = focusables[0]
    const last = focusables.at(-1)
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }

  return (
    <div
      ref={scrimRef}
      className={styles.goToScrim}
      role='dialog'
      aria-modal='true'
      aria-label='Go to slide'
    >
      {/* The key handler sits on each interactive element (focus is
          trapped among them) — jsx-a11y disallows it on the dialog div. */}
      <button
        type='button'
        className={styles.goToScrimButton}
        aria-label='Close'
        onClick={onClose}
        onKeyDown={handleKeyDown}
      />
      <form className={styles.goTo} onSubmit={submit}>
        <label htmlFor='go-to-input'>Go to slide</label>
        <input
          id='go-to-input'
          ref={inputRef}
          type='number'
          inputMode='numeric'
          min={1}
          max={count}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={`1–${count}`}
          onKeyDown={handleKeyDown}
        />
        <button type='submit' onKeyDown={handleKeyDown}>
          jump
        </button>
      </form>
    </div>
  )
}

function VisualBlock({ slide }: { slide: Slide }) {
  switch (slide.visual.kind) {
    case 'section':
      return (
        <SectionVisual
          number={slide.visual.number}
          label={slide.visual.label}
        />
      )
    case 'promptDemo':
      return <PromptDemoVisual />
    case 'agenda':
      return <AgendaVisual />
    case 'pawn':
      return <PawnVisual />
    case 'elo':
      return <EloVisual />
    case 'fork':
      return <ForkVisual />
    case 'skillIssue':
      return <SkillIssueVisual />
    case 'eloPractice':
      return <EloPracticeVisual />
    case 'quoteAvatar':
      return <QuoteAvatarVisual />
    case 'pygmalion':
      return <PygmalionVisual />
    case 'equationDemo':
      return <ArticleEquationVisual />
    case 'none':
      return null
    case 'toolLever':
      return <ToolLeverVisual />
    case 'modelLever':
      return <ModelLeverVisual />
    case 'effortLever':
      return <EffortLeverVisual />
    case 'promptLever':
      return <PromptLeverVisual />
    case 'contextLever':
      return <ContextLeverVisual />
    case 'moves':
      return <MovesVisual />
    case 'yoloExtract':
      return <YoloExtractVisual />
    case 'rules':
      return <RulesVisual />
    case 'audienceQ':
      return <AudienceQuestionVisual />
    case 'treeDemo':
      return <ArticleTreeVisual />
    case 'choice':
      return <ChoiceVisual />
    case 'colleagueDemo':
      return <ArticleColleagueVisual />
    case 'colleague':
      return <ColleagueVisual />
    case 'brief':
      return <BriefVisual />
    case 'timeline':
      return <TimelineVisual />
    case 'stagger':
      return <StaggerVisual />
    case 'fanout':
      return <FanoutVisual />
    case 'roles':
      return <RolesVisual />
    case 'contract':
      return <ContractVisual />
    case 'close':
      return <CloseVisual />
    case 'finalCard':
      return <FinalCardVisual />
    case 'qa':
      return null
  }
}

function SectionVisual({ number, label }: { number: string; label: string }) {
  return (
    <div className={styles.sectionCard}>
      <span className={styles.sectionNumber}>{number}</span>
      <span className={styles.sectionLabel}>{label}</span>
    </div>
  )
}

function PromptDemoVisual() {
  return (
    <div className={styles.articlePromptDemo}>
      <PromptInputDemo start />
    </div>
  )
}

function AgendaVisual() {
  return (
    <ol className={styles.agenda}>
      {[
        ['01', 'beginner’s mindset'],
        ['02', 'the equation'],
        ['03', 'techniques'],
        ['04', 'the map'],
        ['05', 'orchestration'],
        ['06', 'recap']
      ].map(([n, text]) => (
        <li key={n}>
          <span>{n}</span>
          <strong>{text}</strong>
        </li>
      ))}
    </ol>
  )
}

function PawnVisual() {
  return (
    <div className={styles.pawnOnly} aria-label='Chess pawn'>
      <svg viewBox='0 0 220 260' role='img' aria-hidden='true'>
        <path d='M110 20c25 0 45 20 45 45 0 17-9 32-23 40 25 8 43 31 43 59v14h-28l16 48h29v14H28v-14h29l16-48H45v-14c0-28 18-51 43-59-14-8-23-23-23-40 0-25 20-45 45-45Z' />
      </svg>
      <p className={styles.pawnCaption}>the meta has barely been uncovered</p>
    </div>
  )
}

// Smooth bell-shaped player-density curve. Peak around ELO ~1050 (x=140).
// Mirrors the article's chart so the presentation tells the same story:
// most players bunch up around 1000 and Magnus is far out in the right tail.
const ELO_CURVE_PATH =
  'M 40,70 C 60,55 100,30 140,30 C 180,30 215,60 240,80 C 265,100 310,124 360,130 L 560,130'
const ELO_CURVE_FILL_PATH = `${ELO_CURVE_PATH} L 40,130 Z`
const ELO_YOU_X = 170
const ELO_YOU_Y = 35

function EloVisual() {
  return (
    <figure className={styles.elo}>
      <svg
        viewBox='0 0 600 180'
        className={styles.eloCurveSvg}
        role='img'
        aria-label='Chess ELO distribution. Player density peaks around 1200 — where about three years of practice puts you. Magnus Carlsen, the world #1, sits at 2840 ELO, far out in the right tail.'
        preserveAspectRatio='xMidYMid meet'
      >
        <defs>
          <linearGradient id='presEloFill' x1='0' x2='0' y1='0' y2='1'>
            <stop offset='0%' stopColor='#c14a30' stopOpacity='0.35' />
            <stop offset='100%' stopColor='#e89042' stopOpacity='0.04' />
          </linearGradient>
          <linearGradient id='presEloStroke' x1='0' x2='1' y1='0' y2='0'>
            <stop offset='0%' stopColor='#c14a30' />
            <stop offset='100%' stopColor='#e89042' />
          </linearGradient>
        </defs>

        <path d={ELO_CURVE_FILL_PATH} fill='url(#presEloFill)' />
        <path
          d={ELO_CURVE_PATH}
          fill='none'
          stroke='url(#presEloStroke)'
          strokeWidth='1.75'
          strokeLinecap='round'
          pathLength={100}
          className={styles.eloCurveStroke}
        />

        <line
          x1='40'
          y1='130'
          x2='560'
          y2='130'
          className={styles.eloCurveAxis}
        />

        <g className={styles.eloCurveTicks}>
          <line x1='40' y1='130' x2='40' y2='135' />
          <line x1='170' y1='130' x2='170' y2='135' />
          <line x1='300' y1='130' x2='300' y2='135' />
          <line x1='430' y1='130' x2='430' y2='135' />
          <line x1='560' y1='130' x2='560' y2='135' />
        </g>

        <g className={styles.eloCurveLabels}>
          <text x='40' y='150' textAnchor='start'>
            600
          </text>
          <text x='300' y='150' textAnchor='middle'>
            1800
          </text>
          <text x='560' y='150' textAnchor='end'>
            3000
          </text>
        </g>

        <g className={styles.eloCurveGap}>
          <line x1='176' y1='38' x2='519' y2='128' strokeDasharray='2 4' />
          <text x='347' y='76' textAnchor='middle'>
            tons more to learn
          </text>
        </g>

        <g className={styles.eloCurveMarkerYou}>
          <line x1={ELO_YOU_X} y1={ELO_YOU_Y} x2={ELO_YOU_X} y2='130' />
          <circle cx={ELO_YOU_X} cy={ELO_YOU_Y} r='5.5' />
          <text x={ELO_YOU_X} y={ELO_YOU_Y - 13} textAnchor='middle'>
            you · 1200
          </text>
        </g>

        <g className={styles.eloCurveMarkerMagnus}>
          <line x1='525' y1='100' x2='525' y2='130' />
          <circle cx='525' cy='130' r='5.5' />
          <text x='525' y='91' textAnchor='middle'>
            Magnus · 2840
          </text>
        </g>
      </svg>
      <figcaption className={styles.eloCaption}>
        Most players sit in the 600–1000 range. Three years gets you to ~1200.
      </figcaption>
    </figure>
  )
}

function ForkVisual() {
  return (
    <div className={styles.fork}>
      <div className={styles.forkRoad} aria-hidden='true'>
        <span className={styles.forkRoadBase} />
        <span className={styles.forkRoadLeft} />
        <span className={styles.forkRoadRight} />
        <span className={styles.forkRoadDot} />
      </div>
      <section className={styles.forkClosed}>
        <span>closed-minded</span>
        <strong>“the model is bad”</strong>
      </section>
      <section className={styles.forkOpen}>
        <span>open-minded</span>
        <strong>“what did I miss?”</strong>
      </section>
    </div>
  )
}

function SkillIssueVisual() {
  return (
    <div className={styles.skillIssue} aria-hidden='true'>
      <div className={styles.skillIssueChat}>
        <span className={styles.skillIssueMessageThem}>
          “claude is so dumb”
        </span>
        <span className={styles.skillIssueMessageYou}>skill issue.</span>
      </div>
    </div>
  )
}

function EloPracticeVisual() {
  return (
    <div className={styles.eloPractice}>
      <section>
        <span>open loop</span>
        <div className={styles.eloLadder}>
          {[1200, 1204, 1211, 1218, 1227].map((elo) => (
            <b key={elo}>{elo}</b>
          ))}
        </div>
        <strong>try → notice → update</strong>
        <p>like doing one chess puzzle every day</p>
      </section>
      <section>
        <span>closed loop</span>
        <div className={styles.eloSlideBack}>
          {[1200, 1198, 1192, 1186].map((elo) => (
            <b key={elo}>{elo}</b>
          ))}
        </div>
        <strong>blame → stop → regress</strong>
        <p>some problems were fixable in theory</p>
      </section>
    </div>
  )
}

function QuoteAvatarVisual() {
  return (
    <div className={styles.quoteAvatar}>
      <img src='/images/prompting/ambitious-avatar.jpeg' alt='' />
    </div>
  )
}

function PygmalionVisual() {
  return (
    <div className={styles.pygmalion}>
      <div className={styles.pygmalionCaption}>self-fulfilling prophecy</div>
      <section className={styles.pygmalionGood}>
        <PygmalionGlyph direction='up' />
        <span>Pygmalion</span>
        <strong>expect capability</strong>
        <p>better setup → stronger response → next ask is more ambitious</p>
        <ol>
          <li>you ask for harder work</li>
          <li>the agent gets clearer context</li>
          <li>success raises the next expectation</li>
        </ol>
      </section>
      <section className={styles.pygmalionBad}>
        <PygmalionGlyph direction='down' />
        <span>Golem</span>
        <strong>expect failure</strong>
        <p>thin setup → weaker response → confirms the low expectation</p>
        <ol>
          <li>you ask for smaller work</li>
          <li>the agent sees less of the problem</li>
          <li>failure confirms what you already believed</li>
        </ol>
      </section>
    </div>
  )
}

/**
 * Editorial replacement for the old AI-face glyph: a stepped arrow that
 * either climbs (Pygmalion) or descends (Golem). Matches the rest of
 * the deck's abstract style.
 */
function PygmalionGlyph({ direction }: { direction: 'up' | 'down' }) {
  const isUp = direction === 'up'
  const path = isUp
    ? 'M 10,68 L 28,68 L 28,52 L 46,52 L 46,36 L 64,36 L 64,20 L 82,20'
    : 'M 10,20 L 28,20 L 28,36 L 46,36 L 46,52 L 64,52 L 64,68 L 82,68'
  const tip = isUp ? 'M 78,16 L 86,20 L 78,24' : 'M 78,64 L 86,68 L 78,72'
  return (
    <div
      className={`${styles.pygmalionGlyph} ${
        isUp ? styles.pygmalionGlyphUp : styles.pygmalionGlyphDown
      }`}
      aria-hidden='true'
    >
      <svg viewBox='0 0 96 80'>
        <path d={path} fill='none' strokeWidth='3' strokeLinejoin='round' />
        <path
          d={tip}
          fill='none'
          strokeWidth='3'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </div>
  )
}

function ArticleEquationVisual() {
  return (
    <div className={styles.articleEquationDemo}>
      <EquationDemo showFooter={false} interactive={false} />
    </div>
  )
}

type EquationLever = 'tool' | 'model' | 'effort' | 'prompt' | 'context'

/**
 * Each lever slide gets the matching article-style badge from the equation
 * illustration. Effort is a sub-lever of Model, so it shows MODEL.
 */
const LEVER_TO_CHIP: Record<
  EquationLever,
  'TOOL' | 'MODEL' | 'PROMPT' | 'CONTEXT'
> = {
  tool: 'TOOL',
  model: 'MODEL',
  effort: 'MODEL',
  prompt: 'PROMPT',
  context: 'CONTEXT'
}

function LeverHeader({ active }: { active: EquationLever }) {
  return (
    <div className={styles.leverHeader}>
      <LeverChip name={LEVER_TO_CHIP[active]} interactive={false} />
    </div>
  )
}

function ToolLeverVisual() {
  return (
    <div className={styles.leverSlide}>
      <LeverHeader active='tool' />
      <div className={styles.toolLadder}>
        <div className={styles.toolLadderRow}>
          <span className={styles.toolLadderTier}>then</span>
          <span className={styles.toolLadderName}>VSCode + Copilot</span>
        </div>
        <div className={`${styles.toolLadderRow} ${styles.toolLadderRowNow}`}>
          <span className={styles.toolLadderTier}>now</span>
          <span className={styles.toolLadderName}>
            Cursor · Claude Code · Codex
          </span>
        </div>
      </div>
      <p className={styles.leverFootnote}>
        Make sure you're on the latest versions.
      </p>
    </div>
  )
}

function ModelLeverVisual() {
  const rows: Array<{ when: string; pick: string; accent?: boolean }> = [
    { when: 'fast and cost-friendly edits', pick: 'Sonnet 4.6 · Composer 2.5' },
    {
      when: 'taste: writing, docs, PRs, UI',
      pick: 'Opus 4.8'
    },
    {
      when: 'gnarly debugging, hard backend',
      pick: 'GPT-5.5'
    }
  ]
  return (
    <div className={styles.leverSlide}>
      <LeverHeader active='model' />
      <div className={styles.modelGuide}>
        {rows.map((row) => (
          <div
            key={row.pick}
            className={`${styles.modelGuideRow} ${
              row.accent ? styles.modelGuideRowAccent : ''
            }`}
          >
            <span className={styles.modelGuideWhen}>{row.when}</span>
            <span className={styles.modelGuideArrow} aria-hidden='true'>
              →
            </span>
            <span className={styles.modelGuidePick}>{row.pick}</span>
          </div>
        ))}
      </div>
      <p className={styles.effortAutoTrap}>
        <b>The trap:</b> &ldquo;Auto&rdquo; mode is optimized for the platform’s
        margin, not your output. Override it whenever the work matters.
      </p>
    </div>
  )
}

function EffortLeverVisual() {
  const rungs: Array<{ tier: string; what: string }> = [
    { tier: 'low', what: 'trivial edits, format fixes, one-line changes' },
    { tier: 'medium', what: 'well-specced work, the model is executing' },
    { tier: 'high', what: 'planning through constraints, real trade-offs' },
    { tier: 'xhigh', what: 'novel design, gnarly bugs, long-horizon plans' }
  ]
  return (
    <div className={styles.leverSlide}>
      <LeverHeader active='effort' />
      <div className={styles.effortDial}>
        {rungs.map((rung, i) => (
          <div key={rung.tier} className={styles.effortRung}>
            <span className={styles.effortRungTier}>{rung.tier}</span>
            <span
              className={styles.effortRungBar}
              style={{ width: `${30 + i * 18}%` }}
            />
            <span className={styles.effortRungWhat}>{rung.what}</span>
          </div>
        ))}
      </div>
      <p className={styles.effortAutoTrap}>
        <b>Tricky or ambiguous?</b> Turn thinking on. Match the effort to how
        much thinking <em>you</em>’d need to solve it.
      </p>
    </div>
  )
}

function PromptLeverVisual() {
  return (
    <div className={styles.leverSlide}>
      <LeverHeader active='prompt' />
      <div className={styles.promptCompare}>
        <section className={styles.promptCompareWeak}>
          <span className={styles.promptCompareLabel}>weak</span>
          <pre>“Make this faster.”</pre>
          <p>nothing to grade against</p>
        </section>
        <span className={styles.promptCompareArrow} aria-hidden='true'>
          →
        </span>
        <section className={styles.promptCompareStrong}>
          <span className={styles.promptCompareLabel}>strong</span>
          <pre>{`“First paint is 2.4s.
Target under 1s.
Profile and start with
the biggest wins.”`}</pre>
          <p>concrete · measurable · scoped</p>
        </section>
      </div>
      <div className={styles.promptDont}>
        <span>doesn’t help:</span>
        <b>“be careful”</b>
        <b>“think step by step”</b>
        <b>politeness padding</b>
      </div>
    </div>
  )
}

function ContextLeverVisual() {
  const items: Array<{ label: string; note: string }> = [
    { label: 'CLAUDE.md', note: 'project rules and conventions' },
    { label: 'the design doc', note: 'reference material' },
    { label: 'stacktrace', note: 'what is actually happening' },
    { label: 'screenshots', note: 'help the model see more clearly' },
    { label: 'MCPs', note: 'wire into your actual systems' }
  ]
  return (
    <div className={styles.leverSlide}>
      <LeverHeader active='context' />
      <div className={styles.contextStackV2}>
        {items.map((item, i) => (
          <div
            key={item.label}
            className={styles.contextStackV2Row}
            style={{ animationDelay: `${200 + i * 80}ms` }}
          >
            <span className={styles.contextStackV2Label}>{item.label}</span>
            <span className={styles.contextStackV2Note}>{item.note}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const MOVE_GROUPS: Array<{ heading: string; moves: string[] }> = [
  {
    heading: 'Before you start',
    moves: [
      'What questions should you ask me before starting?',
      'What are you assuming that I haven’t said?'
    ]
  },
  {
    heading: 'Open the options',
    moves: [
      'Give me 3 options, rank them, name the trade-offs.',
      'Argue against your last suggestion.'
    ]
  },
  {
    heading: 'Pressure-test it',
    moves: ['What did you skip?', 'How would a senior engineer review this?']
  },
  {
    heading: 'Pay it forward',
    moves: [
      'Match the style of components/PostCard.tsx.',
      'How should I improve my CLAUDE.md or skills so we don’t hit this again?'
    ]
  }
]

function MovesVisual() {
  return (
    <div className={styles.moveGroups}>
      {MOVE_GROUPS.map((group) => (
        <section key={group.heading} className={styles.moveGroup}>
          <h3 className={styles.moveGroupHeading}>
            <span aria-hidden='true' className={styles.moveGroupMark} />
            {group.heading}
          </h3>
          <ul className={styles.moveGroupList}>
            {group.moves.map((move) => (
              <li key={move}>
                <span className={styles.moveQuoteMark} aria-hidden='true'>
                  “
                </span>
                {move}
                <span className={styles.moveQuoteMark} aria-hidden='true'>
                  ”
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function RulesVisual() {
  return (
    <div className={styles.rulesFile}>
      <div className={styles.fileTab}>CLAUDE.md</div>
      <pre>{`- Use pnpm. Don't run npm or yarn.
- Tests live next to the source file. No __tests__/ folder.
- No \`any\`. Use the narrow types in lib/types.ts.
- New card UIs should match components/PostCard.tsx.
- Run \`pnpm typecheck && pnpm test\` before saying you're done.`}</pre>
      <p className={styles.rulesFootnote}>write the lesson once</p>
    </div>
  )
}

/** "YOLO and extract" — a horizontal four-stage flow with the disposable
 *  mega-PR as the visual centerpiece, plus a hands-on ↔ YOLO spectrum
 *  below to set expectations on calibration. */
function YoloExtractVisual() {
  return (
    <div className={styles.yolo}>
      <div className={styles.yoloFlow}>
        <section className={styles.yoloStage}>
          <span className={styles.yoloStageLabel}>1 · pile on context</span>
          <div className={styles.yoloContext}>
            <span>docs</span>
            <span>Figma</span>
            <span>prior PRs</span>
            <span>RFCs</span>
            <span>tickets</span>
          </div>
        </section>
        <span className={styles.yoloFlowArrow} aria-hidden='true'>
          →
        </span>
        <section className={styles.yoloStage}>
          <span className={styles.yoloStageLabel}>2 · ambitious prompt</span>
          <div className={styles.yoloPrompt}>
            “build column-based permissions, end-to-end”
          </div>
        </section>
        <span className={styles.yoloFlowArrow} aria-hidden='true'>
          →
        </span>
        <section className={`${styles.yoloStage} ${styles.yoloStageBig}`}>
          <span className={styles.yoloStageLabel}>3 · one giant PR</span>
          <div className={styles.yoloBigPr}>
            <span className={styles.yoloBigPrTitle}>+2,847 / −213</span>
            <span className={styles.yoloBigPrTag}>disposable</span>
          </div>
        </section>
        <span className={styles.yoloFlowArrow} aria-hidden='true'>
          →
        </span>
        <section className={styles.yoloStage}>
          <span className={styles.yoloStageLabel}>4 · extract the wins</span>
          <div className={styles.yoloExtract}>
            <span>PR #1</span>
            <span>PR #2</span>
            <span>PR #3</span>
            <em>insights</em>
          </div>
        </section>
      </div>
      <div className={styles.yoloSpectrum} aria-hidden='true'>
        <div className={styles.yoloSpectrumBar}>
          <span className={styles.yoloSpectrumLeft}>hands-on</span>
          <span className={styles.yoloSpectrumTrack}>
            <span className={styles.yoloSpectrumDot} />
          </span>
          <span className={styles.yoloSpectrumRight}>YOLO</span>
        </div>
        <div className={styles.yoloSpectrumLabels}>
          <span>ask along the way · edit the plan</span>
          <span>let it decide · trust the harvest</span>
        </div>
        <div className={styles.yoloSpectrumWhen}>
          <span>when you have a spec</span>
          <span>when you don’t</span>
        </div>
      </div>
    </div>
  )
}

function AudienceQuestionVisual() {
  return (
    <div className={styles.audienceQuestion}>
      <span className={styles.audienceQuestionFrame} aria-hidden='true' />
      <strong>Q</strong>
    </div>
  )
}

function ArticleTreeVisual() {
  const areas = ['UX', 'Performance', 'Debugging', 'Architecture']
  const depths = ['High', 'Mid', 'Low']
  const actions = [
    ['ask', 'Ask'],
    ['plan', 'Plan'],
    ['delegate', 'Delegate']
  ] as const
  type TreeAction = (typeof actions)[number][0]
  const [selected, setSelected] = React.useState({
    area: 'UX',
    depth: 'Mid',
    action: 'ask' as TreeAction
  })
  const articlePrompts: Record<
    string,
    Record<string, Record<TreeAction, string>>
  > = {
    UX: {
      High: {
        ask: 'What feels off about this whole page?',
        plan: 'How would you make this flow feel more polished? What should I do first?',
        delegate: 'Make this page prettier.'
      },
      Mid: {
        ask: 'Why does the card hierarchy feel cluttered?',
        plan: 'Plan a redesign of the card component for better scannability.',
        delegate: 'Tighten the card spacing and visual weight.'
      },
      Low: {
        ask: 'Why does the radius on these buttons look off?',
        plan: 'Walk me through a sensible radius and shadow for these buttons.',
        delegate: 'Set the buttons to border-radius 16px.'
      }
    },
    Performance: {
      High: {
        ask: 'Where is time being spent on first paint?',
        plan: 'Plan an attack on first-paint, biggest wins first.',
        delegate: 'Cut first-paint time. Start with the heaviest hitters.'
      },
      Mid: {
        ask: 'Why is this list re-rendering on every keystroke?',
        plan: 'Plan how to memoize this list without breaking selection.',
        delegate: 'Memoize this list. Verify selection still works.'
      },
      Low: {
        ask: 'Why is this useEffect firing twice?',
        plan: 'How should I fix this useEffect double-fire safely?',
        delegate: 'Fix the dependency array on this useEffect.'
      }
    },
    Debugging: {
      High: {
        ask: 'What is most likely breaking in this checkout flow?',
        plan: 'Plan a triage approach for the failing checkout flow.',
        delegate: 'Get checkout green again.'
      },
      Mid: {
        ask: 'Why is this auth middleware sometimes returning 401?',
        plan: 'Plan how to reproduce this auth flake locally.',
        delegate: 'Find and fix the intermittent 401 in auth.'
      },
      Low: {
        ask: 'Why is this regex not matching trailing newlines?',
        plan: 'How should I update this regex to match trailing newlines safely?',
        delegate: 'Fix this regex to match trailing newlines.'
      }
    },
    Architecture: {
      High: {
        ask: "Where is this codebase heading that it isn't yet?",
        plan: 'Plan how to split this into clear modules.',
        delegate: 'Restructure this into clear modules. Propose, then do.'
      },
      Mid: {
        ask: 'Should this state live in context or be lifted?',
        plan: 'Plan the migration of this slice from local state to a store.',
        delegate: 'Move this state into the store and update consumers.'
      },
      Low: {
        ask: "Why does this file import three things from utils.ts that aren't used?",
        plan: 'Plan the cleanup of unused imports across this file.',
        delegate: 'Remove unused imports in this file.'
      }
    }
  }
  const prompt =
    articlePrompts[selected.area]?.[selected.depth]?.[selected.action] ?? ''

  return (
    <div className={styles.treeStage}>
      <div className={styles.mapDemo}>
        <div className={styles.mapHeader}>
          <span>breadth</span>
          <b>what part of the system?</b>
        </div>
        <div className={styles.mapGrid}>
          {areas.map((area) => (
            <span key={`col-${area}`} className={styles.mapCol}>
              {area}
            </span>
          ))}
          {depths.map((depth) =>
            areas.map((area) => {
              const active = area === selected.area && depth === selected.depth
              return (
                <button
                  type='button'
                  key={`${area}-${depth}`}
                  className={`${styles.mapCell} ${
                    active ? styles.mapCellActive : ''
                  }`}
                  onClick={() =>
                    setSelected((current) => ({ ...current, area, depth }))
                  }
                >
                  <span>{depth}</span>
                  {active && (
                    <b>{actions.find(([id]) => id === selected.action)?.[1]}</b>
                  )}
                </button>
              )
            })
          )}
        </div>
        <div className={styles.mapActions}>
          {actions.map(([id, label]) => (
            <button
              key={id}
              type='button'
              className={id === selected.action ? styles.mapActionActive : ''}
              onClick={() =>
                setSelected((current) => ({ ...current, action: id }))
              }
            >
              {label}
            </button>
          ))}
        </div>
        <div className={styles.mapAxis}>
          <span>high: overall feel</span>
          <span>mid: component or flow</span>
          <span>low: one specific line</span>
        </div>
      </div>
      <div className={styles.treePromptBadge}>
        <span>Generated prompt</span>
        <strong>{prompt}</strong>
      </div>
    </div>
  )
}

function ChoiceVisual() {
  const moves: Array<{
    verb: string
    when: string
    example: string
  }> = [
    {
      verb: 'Ask',
      when: 'you don’t know yet',
      example: '“Why is this list re-rendering on every keystroke?”'
    },
    {
      verb: 'Plan',
      when: 'you know what, not how',
      example: '“Plan how to memoize this list without breaking selection.”'
    },
    {
      verb: 'Delegate',
      when: 'the path is clear and gradeable',
      example: '“Memoize this list. Verify selection still works.”'
    }
  ]

  return (
    <div className={styles.choice}>
      {moves.map((move, i) => (
        <section
          key={move.verb}
          className={styles.choiceRow}
          style={{ animationDelay: `${i * 160}ms` }}
        >
          <div className={styles.choiceHeader}>
            <strong>{move.verb}</strong>
            <span className={styles.choiceWhen}>when {move.when}</span>
          </div>
          <p className={styles.choiceExample}>{move.example}</p>
        </section>
      ))}
    </div>
  )
}

function ArticleColleagueVisual() {
  return (
    <div className={styles.articleColleagueDemo}>
      <ColleagueDemo />
    </div>
  )
}

function ColleagueVisual() {
  const stages: Array<{
    n: string
    phase: string
    verb: string
    items: string[]
    cadence: string
  }> = [
    {
      n: '01',
      phase: 'before',
      verb: 'Onboard',
      items: ['CLAUDE.md', 'conventions', 'shared examples'],
      cadence: 'one-time setup'
    },
    {
      n: '02',
      phase: 'during',
      verb: 'Prompt',
      items: ['the goal', 'constraints', 'success criteria'],
      cadence: 'every task'
    },
    {
      n: '03',
      phase: 'after',
      verb: 'Review',
      items: ['read the diff', 'run the code', 'push back'],
      cadence: 'every task'
    }
  ]

  return (
    <div className={styles.colleague}>
      <div className={styles.colleagueRow}>
        {stages.map((stage, i) => (
          <React.Fragment key={stage.verb}>
            <section
              className={styles.colleagueCard}
              style={{ animationDelay: `${i * 180}ms` }}
            >
              <header>
                <span className={styles.colleagueN}>{stage.n}</span>
                <span className={styles.colleaguePhase}>{stage.phase}</span>
              </header>
              <strong className={styles.colleagueVerb}>{stage.verb}</strong>
              <ul className={styles.colleagueItems}>
                {stage.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <span className={styles.colleagueCadence}>{stage.cadence}</span>
            </section>
            {i < stages.length - 1 && (
              <span
                className={styles.colleagueArrow}
                aria-hidden='true'
                style={{ animationDelay: `${i * 180 + 90}ms` }}
              >
                →
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
      <p className={styles.colleagueCaption}>same shape as a teammate</p>
    </div>
  )
}

/** Renders a chat transcript with user lines (starting with `> `) styled
 *  one way and agent lines (parenthetical) styled another. */
function BriefTranscript({ lines }: { lines: string[] }) {
  return (
    <div className={styles.briefTranscript}>
      {lines.map((line, i) => {
        if (line === '') return <span key={i} className={styles.briefGap} />
        const isUser = line.startsWith('> ')
        return (
          <span
            key={i}
            className={isUser ? styles.briefUser : styles.briefAgent}
          >
            {isUser ? line.slice(2) : line}
          </span>
        )
      })}
    </div>
  )
}

function BriefVisual() {
  const pingLines = [
    '> Read the auth module.',
    '(reads, waits)',
    '',
    '> Now find the session bug.',
    '(finds, waits)',
    '',
    '> Now write a test.',
    '(writes, waits)',
    '',
    '> Now open a PR.'
  ]
  const promptLines = [
    '> Read the auth module, find the session bug we keep seeing on refresh, write a regression test, and open a PR. If you hit a fork, pick the smaller change and note the alternative in the PR body.'
  ]
  return (
    <div className={styles.briefPair}>
      <section>
        <span className={styles.briefLabel}>Ping pong</span>
        <BriefTranscript lines={pingLines} />
      </section>
      <section className={styles.briefGood}>
        <span className={styles.briefLabel}>Full prompt</span>
        <BriefTranscript lines={promptLines} />
      </section>
    </div>
  )
}

function TimelineVisual() {
  return (
    <div className={styles.timeline}>
      <div className={styles.timelineRow}>
        <b>ping pong</b>
        <div className={styles.timelineBars}>
          {Array.from({ length: 6 }).map((_, i) => (
            <React.Fragment key={i}>
              <span className={styles.you} />
              <span className={styles.agent} />
              <span className={styles.idle} />
            </React.Fragment>
          ))}
        </div>
        <span className={styles.timelineDuration}>~14 min</span>
      </div>
      <div className={styles.timelineRow}>
        <b>full prompt</b>
        <div className={styles.timelineBars}>
          <span className={styles.youWide} />
          <span className={styles.agentWide} />
        </div>
        <span className={styles.timelineDuration}>~5 min</span>
      </div>
      <div className={styles.timelineAxis} aria-hidden='true'>
        <span>time →</span>
      </div>
    </div>
  )
}

function StaggerVisual() {
  const tracks = [
    ['you', 'agent', 'idle', 'you', 'agent'],
    ['gap', 'you', 'agent', 'idle', 'you', 'agent'],
    ['gap', 'gap', 'you', 'agent', 'idle', 'you', 'agent']
  ]

  return (
    <div className={styles.stagger}>
      {tracks.map((track, i) => (
        <div key={i}>
          <b>thread {i + 1}</b>
          {track.map((kind, j) => (
            <span
              key={`${kind}-${j}`}
              className={
                kind === 'you'
                  ? styles.staggerYou
                  : kind === 'agent'
                    ? styles.staggerAgent
                    : kind === 'idle'
                      ? styles.staggerIdle
                      : styles.staggerGap
              }
            />
          ))}
        </div>
      ))}
    </div>
  )
}

/** Article-style fan-out: one prompt drops three parallel agent tracks
 *  into a single merge point. */
function FanoutVisual() {
  const tracks: Array<{ y: number; end: number; label: string }> = [
    { y: 70, end: 420, label: 'agent · tests' },
    { y: 105, end: 380, label: 'agent · docs' },
    { y: 140, end: 460, label: 'agent · refactor' }
  ]

  return (
    <figure className={styles.fanout}>
      <svg
        viewBox='0 0 600 200'
        className={styles.fanoutSvg}
        role='img'
        aria-label='One prompt feeds three parallel agent tracks; the three streams converge at a single merge point on the right.'
        preserveAspectRatio='xMidYMid meet'
      >
        <defs>
          <linearGradient id='presFanYou' x1='0' x2='1' y1='0' y2='0'>
            <stop offset='0%' stopColor='#6d28d9' />
            <stop offset='100%' stopColor='#7c3aed' />
          </linearGradient>
          <linearGradient id='presFanAgent' x1='0' x2='1' y1='0' y2='0'>
            <stop offset='0%' stopColor='#9d174d' />
            <stop offset='100%' stopColor='#be185d' />
          </linearGradient>
        </defs>

        <rect
          x='40'
          y='20'
          width='130'
          height='22'
          rx='6'
          ry='6'
          fill='url(#presFanYou)'
        />
        <text
          x='105'
          y='35'
          textAnchor='middle'
          className={styles.fanoutBlockLabel}
        >
          you · prompt
        </text>

        {tracks.map((t, i) => (
          <path
            key={`drop-${i}`}
            d={`M 170,42 C 200,42 195,${t.y + 11} 230,${t.y + 11}`}
            fill='none'
            stroke='url(#presFanYou)'
            strokeWidth='1.25'
            strokeLinecap='round'
            strokeDasharray='3 4'
            className={styles.fanoutDrop}
            style={{ animationDelay: `${i * 140}ms` }}
          />
        ))}

        {tracks.map((t, i) => (
          <g
            key={`track-${i}`}
            style={{ animationDelay: `${300 + i * 140}ms` }}
            className={styles.fanoutTrack}
          >
            <rect
              x='230'
              y={t.y}
              width={t.end - 230}
              height='22'
              rx='6'
              ry='6'
              fill='url(#presFanAgent)'
            />
            <text
              x={235}
              y={t.y + 15}
              textAnchor='start'
              className={styles.fanoutBlockLabel}
            >
              {t.label}
            </text>
          </g>
        ))}

        <g className={styles.fanoutMerge}>
          <path
            d='M 478,68 C 490,68 490,120 502,120 C 490,120 490,172 478,172'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.25'
          />
          <text x='510' y='124' className={styles.fanoutMergeLabel}>
            merge
          </text>
        </g>

        <line
          x1='40'
          y1='185'
          x2='560'
          y2='185'
          className={styles.fanoutAxis}
        />
        <text
          x='560'
          y='199'
          textAnchor='end'
          className={styles.fanoutAxisLabel}
        >
          time →
        </text>
      </svg>
      <figcaption className={styles.fanoutCaption}>
        One prompt fans out · three streams run in parallel · one merge to
        review.
      </figcaption>
    </figure>
  )
}

const ROLES_PIPELINE: Array<{ name: string; verb: string }> = [
  { name: 'Researcher', verb: 'reads & plans' },
  { name: 'Implementer', verb: 'writes the diff' },
  { name: 'Reviewer', verb: 'critiques cold' }
]
const ROLE_HANDOFFS = ['plan.md', 'diff']

function RolesVisual() {
  return (
    <figure className={styles.rolesPipeline}>
      <div className={styles.rolesRow}>
        {ROLES_PIPELINE.map((role, i) => (
          <React.Fragment key={role.name}>
            <div
              className={styles.roleCard}
              style={{ animationDelay: `${i * 220}ms` }}
            >
              <span className={styles.roleName}>{role.name}</span>
              <span className={styles.roleVerb}>{role.verb}</span>
            </div>
            {i < ROLES_PIPELINE.length - 1 && (
              <div
                className={styles.roleHandoff}
                style={{ animationDelay: `${i * 220 + 140}ms` }}
                aria-hidden='true'
              >
                <span className={styles.roleHandoffArtifact}>
                  {ROLE_HANDOFFS[i]}
                </span>
                <span className={styles.roleHandoffArrow}>→</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <figcaption className={styles.rolesCaption}>
        name the artifact that crosses each seam — the handoff stops being fuzzy
      </figcaption>
    </figure>
  )
}

function ContractVisual() {
  const parts = [
    ['goal', 'what outcome should exist at the end'],
    ['clarity', 'enough context to operate without asking you for more'],
    ['success criterion', 'how the agent knows the work is done'],
    ['judgment boundary', 'where it should choose versus stop and ask'],
    ['fallback', 'what to do if the first path fails']
  ]

  return (
    <div className={styles.contract}>
      {parts.map(([title, detail]) => (
        <section key={title}>
          <b>{title}</b>
          <span>{detail}</span>
        </section>
      ))}
    </div>
  )
}

/** A six-card recap, one per chapter. Each card has a tiny inline visual
 *  so the page reads like a leaflet, not a flashcard. */
function CloseVisual() {
  const cards: Array<{
    n: string
    title: string
    line: string
    glyph: React.ReactNode
  }> = [
    {
      n: '01',
      title: 'Beginner’s mindset',
      line: 'Three years in is about 1200 ELO. The bottleneck is usually you.',
      glyph: <CloseGlyphElo />
    },
    {
      n: '02',
      title: 'The equation',
      line: 'Figure out which levers to improve.',
      glyph: <CloseGlyphEquation />
    },
    {
      n: '03',
      title: 'Techniques',
      line: 'Build a repertoire of small moves. Turn your favorites into skills.',
      glyph: <CloseGlyphMoves />
    },
    {
      n: '04',
      title: 'The map',
      line: 'Navigate the breadth and depth of coding.',
      glyph: <CloseGlyphTree />
    },
    {
      n: '05',
      title: 'Orchestration',
      line: 'Conduct the fleet. The hour matters more than the message.',
      glyph: <CloseGlyphFanout />
    }
  ]
  return (
    <div className={styles.closeGrid}>
      {cards.map((card) => (
        <article key={card.n} className={styles.closeCard}>
          <header>
            <span className={styles.closeCardN}>{card.n}</span>
            <h3>{card.title}</h3>
          </header>
          <div className={styles.closeCardGlyph} aria-hidden='true'>
            {card.glyph}
          </div>
          <p>{card.line}</p>
        </article>
      ))}
    </div>
  )
}

function CloseGlyphElo() {
  return (
    <svg viewBox='0 0 120 40' role='img' aria-hidden='true'>
      <path
        d='M4 32 C 14 22 24 10 36 10 C 52 10 60 24 70 30 C 84 36 100 34 116 34'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <circle cx='40' cy='10.3' r='3' fill='currentColor' />
      <circle cx='110' cy='34' r='3' fill='currentColor' />
    </svg>
  )
}

function CloseGlyphEquation() {
  return (
    <div className={styles.closeEquation}>
      <em className={styles.closeEquationGroup}>
        <span>TOOL</span>
        <b>+</b>
        <span>MODEL</span>
      </em>
      <b>×</b>
      <em className={styles.closeEquationGroup}>
        <span>PROMPT</span>
        <b>+</b>
        <span>CONTEXT</span>
      </em>
    </div>
  )
}

function CloseGlyphMoves() {
  return (
    <div className={styles.closeMoves}>
      <span>“ask”</span>
      <span>“rank”</span>
      <span>“argue”</span>
      <span>“skip?”</span>
    </div>
  )
}

function CloseGlyphTree() {
  return (
    <div className={styles.closeTree}>
      {Array.from({ length: 12 }).map((_, i) => {
        const active = i === 4
        const onAxis =
          i === 0 || i === 4 || i === 8 || i === 5 || i === 6 || i === 7
        return (
          <span
            key={i}
            className={`${active ? styles.closeTreeActive : ''} ${onAxis && !active ? styles.closeTreeAxis : ''}`}
          />
        )
      })}
    </div>
  )
}

function CloseGlyphFanout() {
  return (
    <svg viewBox='0 0 120 40' role='img' aria-hidden='true'>
      <rect x='2' y='14' width='22' height='10' rx='2' fill='currentColor' />
      <path
        d='M 24,19 C 36,19 36,8 50,8 M 24,19 C 36,19 36,19 50,19 M 24,19 C 36,19 36,30 50,30'
        fill='none'
        stroke='currentColor'
        strokeWidth='1'
      />
      <rect
        x='50'
        y='4'
        width='30'
        height='10'
        rx='2'
        fill='currentColor'
        opacity='0.7'
      />
      <rect
        x='50'
        y='15'
        width='42'
        height='10'
        rx='2'
        fill='currentColor'
        opacity='0.7'
      />
      <rect
        x='50'
        y='26'
        width='24'
        height='10'
        rx='2'
        fill='currentColor'
        opacity='0.7'
      />
      <path
        d='M 96,9 C 102,9 102,20 108,20 C 102,20 102,31 96,31'
        fill='none'
        stroke='currentColor'
        strokeWidth='1'
      />
    </svg>
  )
}

function FinalCardVisual() {
  return (
    <div className={styles.finalCard}>
      <span className={styles.finalCardCursor} aria-hidden='true'>
        &gt;
      </span>
      <span className={styles.finalCardThanks}>thanks for listening.</span>
    </div>
  )
}
