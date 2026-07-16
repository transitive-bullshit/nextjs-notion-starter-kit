import Link from 'next/link'
import * as React from 'react'

import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

import {
  PER_WORD_STAGGER_MS,
  THINKING_DURATION_MS,
  TITLE,
  TITLE_WORDS
} from './constants'
import { DotMatrixIcon } from './DotMatrixIcon'
import { Figure } from './parts'
import styles from './PromptingPage.module.css'
import { PromptInputDemo } from './PromptInputDemo'
import { bodyDelay } from './types'

/**
 * IntroContent — chapter-zero animated title + body intro + Begin CTA.
 *
 *   The title boots in two phases: a 1.2s "Thinking" sparkle, then the
 *   real title blurs in word-by-word. Body content fades up below as
 *   the title settles and ends with the Begin CTA into chapter 1.
 */
export function IntroContent() {
  const [revealed, setRevealed] = React.useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  React.useEffect(() => {
    if (prefersReducedMotion) {
      setRevealed(true)
      return
    }
    // On the first visit per session, hold just long enough for the
    // dot-matrix to finish one clean cycle (plus a small tail), capped
    // under 3s. After that, snap to the short duration so revisits stay
    // snappy.
    let firstLoad = false
    try {
      firstLoad = !window.sessionStorage.getItem('prompting:intro:seen')
      window.sessionStorage.setItem('prompting:intro:seen', '1')
    } catch {
      /* ignore */
    }
    const wait = firstLoad ? 2000 : THINKING_DURATION_MS
    const id = window.setTimeout(() => setRevealed(true), wait)
    return () => window.clearTimeout(id)
  }, [prefersReducedMotion])

  return (
    <>
      <h1 className={styles.titleSlot} aria-label={TITLE}>
        <span
          className={`${styles.thinking} ${revealed ? styles.thinkingHidden : ''}`}
          aria-hidden={revealed}
        >
          <DotMatrixIcon className={styles.sparkle} />
          <span className={styles.thinkingText}>Thinking</span>
        </span>

        <span
          className={`${styles.title} ${revealed ? styles.titleVisible : ''}`}
          aria-hidden={!revealed}
        >
          {TITLE_WORDS.map((word, i) => (
            <React.Fragment key={`${word}-${i}`}>
              <span
                className={styles.titleWord}
                style={{
                  transitionDelay: revealed
                    ? `${i * PER_WORD_STAGGER_MS}ms`
                    : '0ms'
                }}
              >
                {word}
              </span>
              {i < TITLE_WORDS.length - 1 ? ' ' : null}
            </React.Fragment>
          ))}
        </span>
      </h1>

      <div className={`${styles.prose} ${revealed ? styles.bodyVisible : ''}`}>
        <p className={styles.bodyItem} style={bodyDelay(0)}>
          It&apos;s 2026, and more and more of coding looks like this:
        </p>

        <div className={styles.bodyItem} style={bodyDelay(1)}>
          <Figure
            num='0.1'
            caption='What a lot of programming looks like now. Try sending it.'
          >
            <PromptInputDemo start={revealed} />
          </Figure>
        </div>

        <p className={styles.bodyItem} style={bodyDelay(2)}>
          You don&apos;t write code so much as describe what you want and watch
          it appear. The job is shifting from writing the code to talking to the
          thing that writes it.
        </p>

        <p className={styles.bodyItem} style={bodyDelay(3)}>
          So what does it mean to be good at talking to Claude, Codex, or
          whatever comes next?
        </p>

        <div
          className={`${styles.bodyItem} ${styles.beginRow}`}
          style={bodyDelay(5)}
        >
          <Link href='/prompting/mindset' className={styles.beginCta}>
            <span>Begin: The beginner&rsquo;s mindset</span>
            <span className={styles.beginCtaArrow} aria-hidden='true'>
              →
            </span>
          </Link>

          <span className={styles.altVersion}>
            Or view the{' '}
            <Link href='/prompting/present' className={styles.altVersionLink}>
              presentation
            </Link>
          </span>
        </div>
      </div>
    </>
  )
}
