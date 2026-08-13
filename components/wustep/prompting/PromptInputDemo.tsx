import * as React from 'react'

import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

import {
  AUTO_PROMPT,
  AUTO_TYPE_CHAR_MS,
  AUTO_TYPE_INITIAL_DELAY_MS,
  AUTO_TYPE_SEND_DELAY_MS,
  ERROR_MESSAGES,
  FAKE_MODELS,
  WORKING_DURATION_MS
} from './constants'
import { DriveLoader, useElapsed } from './DriveLoader'
import { ChevronIcon, ReplayIcon } from './icons'
import styles from './PromptingPage.module.css'

/* ─────────────────────────────────────────────────────────
 * PROMPT INPUT STORYBOARD
 *
 *    0ms   waits for parent to flip `start` (after title reveals)
 * 1400ms   begins typing "Center this div" (70ms/char ≈ 1.2s)
 * 2700ms   typing settles; the prompt waits for the visitor to send
 *
 *  user hits Send / Enter  →  agent "works" (Drive loader + elapsed
 *                             timer) for a couple of seconds, then the
 *                             error appears, card shakes, Replay swaps in
 *  user types again        →  working/error clears, Send returns
 *  user clicks Replay      →  re-runs the typing sequence
 *  prefers-reduced-motion  →  fills value instantly, no auto-send;
 *                             sending fails immediately, no fake work
 *
 *  Direct manipulation always wins: typing, backspacing, or hitting
 *  Enter while the script is "typing" cancels the pending timers and
 *  hands control straight to the visitor.
 * ───────────────────────────────────────────────────────── */

function optionId(index: number) {
  return `model-option-${index}`
}

/** Keys that would actually change the textarea's text content. */
function isEditingKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
  if (e.key === 'Backspace' || e.key === 'Delete') return true
  return e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey
}

export function PromptInputDemo({ start }: { start: boolean }) {
  const [value, setValue] = React.useState('')
  const [model, setModel] = React.useState(FAKE_MODELS[0]!)
  const [open, setOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [error, setError] = React.useState<string | null>(null)
  const [shakeKey, setShakeKey] = React.useState(0)
  const [autoTyping, setAutoTyping] = React.useState(false)
  const [working, setWorking] = React.useState(false)
  const [sent, setSent] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const timersRef = React.useRef<number[]>([])
  const hasRunRef = React.useRef(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  const clearTimers = () => {
    for (const id of timersRef.current) window.clearTimeout(id)
    timersRef.current = []
  }

  const triggerSend = React.useCallback(
    (text: string) => {
      if (text.trim().length === 0) return
      const fail = () => {
        const next =
          ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]!
        setWorking(false)
        setError(next)
        setShakeKey((k) => k + 1)
      }
      setAutoTyping(false)
      setSent(true)
      if (prefersReducedMotion) {
        fail()
        return
      }
      // Let the agent visibly churn before it hits the wall — the same
      // Drive loader + elapsed timer as the intro's Thinking state.
      setWorking(true)
      timersRef.current.push(window.setTimeout(fail, WORKING_DURATION_MS))
    },
    [prefersReducedMotion]
  )

  const runAutoType = React.useCallback(() => {
    clearTimers()
    setError(null)
    setWorking(false)
    setSent(false)
    setValue('')

    if (prefersReducedMotion) {
      setValue(AUTO_PROMPT)
      return
    }

    setAutoTyping(true)
    let i = 0
    const typeStep = () => {
      i += 1
      setValue(AUTO_PROMPT.slice(0, i))
      if (i < AUTO_PROMPT.length) {
        timersRef.current.push(window.setTimeout(typeStep, AUTO_TYPE_CHAR_MS))
      } else {
        // Leave the typed prompt sitting in the input — the visitor sends
        // it themselves (or hits the wall) rather than us auto-firing.
        timersRef.current.push(
          window.setTimeout(() => setAutoTyping(false), AUTO_TYPE_SEND_DELAY_MS)
        )
      }
    }
    timersRef.current.push(window.setTimeout(typeStep, 100))
  }, [prefersReducedMotion])

  React.useEffect(() => {
    if (!start || hasRunRef.current) return
    hasRunRef.current = true
    const id = window.setTimeout(runAutoType, AUTO_TYPE_INITIAL_DELAY_MS)
    timersRef.current.push(id)
  }, [start, runAutoType])

  React.useEffect(() => () => clearTimers(), [])

  const handleSend = () => {
    if (autoTyping || working) return
    triggerSend(value)
  }

  const handleReplay = () => {
    runAutoType()
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (autoTyping) {
      // Any value change while the script is running (typing, paste, IME)
      // hands control back to the visitor — the script never wins a fight
      // over the value.
      clearTimers()
      setAutoTyping(false)
    }
    if (working) {
      // Editing mid-"work" withdraws the request: cancel the pending
      // failure and hand the input back.
      clearTimers()
      setWorking(false)
      setSent(false)
    }
    setValue(e.target.value)
    if (error) setError(null)
    if (sent) setSent(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (autoTyping) {
      if (e.key === 'Enter' && !e.shiftKey) {
        // Enter always submits whatever's in the field so far, scripted
        // or not.
        e.preventDefault()
        clearTimers()
        setAutoTyping(false)
        triggerSend(value)
        return
      }
      if (isEditingKey(e)) {
        // Cancel the pending auto-type timer *before* the keystroke lands
        // so the script doesn't overwrite the edit the visitor is about
        // to make.
        clearTimers()
        setAutoTyping(false)
      }
      return
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const showReplay = sent && !working
  const elapsed = useElapsed(working)

  const selectModel = React.useCallback(
    (m: (typeof FAKE_MODELS)[number]) => {
      setModel(m)
      setOpen(false)
      if (error) setError(null)
      triggerRef.current?.focus()
    },
    [error]
  )

  // WAI-ARIA listbox pattern: focus moves to the listbox itself and
  // aria-activedescendant tracks the active option, rather than moving
  // real focus between the option buttons.
  const handleListboxKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, FAKE_MODELS.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
        break
      case 'Home':
        e.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        e.preventDefault()
        setActiveIndex(FAKE_MODELS.length - 1)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        selectModel(FAKE_MODELS[activeIndex]!)
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
        break
      case 'Tab':
        setOpen(false)
        break
      default:
        break
    }
  }

  React.useEffect(() => {
    if (!open) return
    setActiveIndex(FAKE_MODELS.findIndex((m) => m.name === model.name))
    menuRef.current?.focus()
  }, [open, model])

  React.useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (
        menuRef.current &&
        !menuRef.current.contains(t) &&
        triggerRef.current &&
        !triggerRef.current.contains(t)
      ) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div
      key={shakeKey}
      className={`${styles.promptCard} ${error ? styles.promptCardError : ''}`}
    >
      <div className={styles.promptInputWrap}>
        <textarea
          className={`${styles.promptInput} ${autoTyping ? styles.promptInputTyping : ''}`}
          placeholder='What would you like to build today?'
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={2}
          spellCheck={false}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'prompt-error' : undefined}
        />
        {autoTyping && (
          <div className={styles.promptInputGhost} aria-hidden='true'>
            <span>{value}</span>
            <span className={styles.promptInputGhostCursor} />
          </div>
        )}
      </div>

      {working && (
        <div className={styles.promptWorking}>
          <DriveLoader />
          <span
            role='status'
            className={`${styles.thinkingText} ${styles.promptWorkingText}`}
          >
            Thinking
          </span>
          <span className={styles.thinkingElapsed} aria-hidden='true'>
            {elapsed}
          </span>
        </div>
      )}

      {error && (
        <div id='prompt-error' className={styles.promptError} role='alert'>
          <ErrorIcon />
          <span>{error}</span>
        </div>
      )}

      <div className={styles.promptFooter}>
        <div className={styles.modelWrap}>
          <button
            ref={triggerRef}
            type='button'
            className={styles.modelButton}
            onClick={() => setOpen((o) => !o)}
            aria-haspopup='listbox'
            aria-expanded={open}
          >
            <span className={styles.modelDot} aria-hidden='true' />
            <span className={styles.modelName}>{model.name}</span>
            <ChevronIcon className={styles.modelChevron} />
          </button>

          {open && (
            <div
              ref={menuRef}
              className={styles.modelMenu}
              role='listbox'
              tabIndex={-1}
              aria-activedescendant={optionId(activeIndex)}
              onKeyDown={handleListboxKeyDown}
            >
              {FAKE_MODELS.map((m, i) => {
                const selected = m.name === model.name
                return (
                  <button
                    key={m.name}
                    id={optionId(i)}
                    type='button'
                    role='option'
                    aria-selected={selected}
                    tabIndex={-1}
                    className={`${styles.modelOption} ${selected ? styles.modelOptionActive : ''}`}
                    onClick={() => selectModel(m)}
                  >
                    <span className={styles.modelOptionName}>{m.name}</span>
                    <span className={styles.modelOptionTag}>{m.tag}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <button
          type='button'
          className={`${styles.submitButton} ${showReplay ? styles.submitButtonReplay : ''}`}
          aria-label={showReplay ? 'Replay' : 'Send'}
          onClick={showReplay ? handleReplay : handleSend}
          disabled={
            !showReplay && (autoTyping || working || value.trim().length === 0)
          }
        >
          <span className={styles.submitIconStack} aria-hidden='true'>
            <span
              className={`${styles.submitIcon} ${showReplay ? styles.submitIconHidden : ''}`}
            >
              <ArrowUpIcon />
            </span>
            <span
              className={`${styles.submitIcon} ${showReplay ? '' : styles.submitIconHidden}`}
            >
              <ReplayIcon />
            </span>
          </span>
        </button>
      </div>
    </div>
  )
}

function ErrorIcon() {
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
      <circle cx='12' cy='12' r='10' />
      <path d='M12 8v4' />
      <path d='M12 16h.01' />
    </svg>
  )
}

function ArrowUpIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2.25'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M12 19V5' />
      <path d='m5 12 7-7 7 7' />
    </svg>
  )
}
