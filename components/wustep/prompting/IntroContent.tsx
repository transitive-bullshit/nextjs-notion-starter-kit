import Link from 'next/link'
import * as React from 'react'

import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

import {
  PER_WORD_STAGGER_MS,
  THINKING_DURATION_MS,
  TITLE,
  TITLE_WORDS
} from './constants'
import { DriveLoader, useElapsed } from './DriveLoader'
import { Figure, Note } from './parts'
import styles from './PromptingPage.module.css'
import { PromptInputDemo } from './PromptInputDemo'
import { bodyDelay } from './types'

/**
 * IntroContent — chapter-zero animated title + body intro + Begin CTA.
 *
 *   The title boots in two phases: a short "Thinking" hold — the Drive
 *   pixel loader, shimmer label, and a live elapsed timer — then the
 *   real title blurs in word-by-word. Body content fades up below as
 *   the title settles and ends with the Begin CTA into chapter 1.
 */
export function IntroContent() {
  const [revealed, setRevealed] = React.useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const elapsed = useElapsed(!revealed && !prefersReducedMotion)

  React.useEffect(() => {
    if (prefersReducedMotion) {
      setRevealed(true)
      return
    }
    // On the first visit per session, hold long enough for the Drive
    // wavefront to sweep the grid a couple of times, capped under 3s.
    // After that, snap to the short duration so revisits stay snappy.
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
          <DriveLoader />
          <span className={styles.thinkingText}>Thinking</span>
          <span className={styles.thinkingElapsed}>{elapsed}</span>
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
          <Figure num='0.1' caption='What a lot of programming looks like now.'>
            <PromptInputDemo start={revealed} />
          </Figure>
        </div>

        <p className={styles.bodyItem} style={bodyDelay(2)}>
          You describe what you want and watch it appear. The job is shifting
          from writing code to talking to the thing that writes it.
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

        <div className={styles.bodyItem} style={bodyDelay(6)}>
          <Note title='A timestamp'>
            <p>
              I wrote most of this (with help from agents) in April 2026, for a
              talk for Notion engineers. The field moves fast enough that some
              of it is dated already. I hope something in here is useful anyway.{' '}
              <em>&mdash; Stephen</em>
            </p>
          </Note>
        </div>
      </div>
    </>
  )
}
