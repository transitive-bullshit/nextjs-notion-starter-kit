import * as React from 'react'

import styles from './PromptingPage.module.css'

/**
 * Lever — a labeled section with a heading + tagline + body. Used across
 * chapters to break content into clearly-named "moves" the reader can
 * pull (e.g. TOOL, MODEL, ASK, BRIEFING). `num` prints the manual-style
 * section number ("2.1") before the name.
 */
export function Lever({
  num,
  name,
  tagline,
  children
}: {
  num?: string
  name: string
  tagline: string
  children: React.ReactNode
}) {
  return (
    <div className={styles.leverSection}>
      <div className={styles.leverHeading}>
        {num && (
          <span className={styles.leverHeadingNum} aria-hidden='true'>
            {num}
          </span>
        )}
        <span className={styles.leverHeadingName}>{name}</span>
        <span className={styles.leverHeadingTagline}>{tagline}</span>
      </div>
      <div className={styles.leverBody}>{children}</div>
    </div>
  )
}

/**
 * SectionHeading — numbered manual section heading ("6.2 Stagger and
 * overlap"). The number is decorative wayfinding; screen readers get
 * the plain title.
 */
export function SectionHeading({
  num,
  children
}: {
  num: string
  children: React.ReactNode
}) {
  return (
    <h3 className={styles.manualHeading}>
      <span className={styles.manualHeadingNum} aria-hidden='true'>
        {num}
      </span>
      {children}
    </h3>
  )
}

/**
 * Figure — the manual's rule-framed enclosure for every interactive
 * demo and diagram, with a numbered caption plate below
 * ("FIG. 4.1 — the 2D map").
 */
export function Figure({
  num,
  caption,
  children
}: {
  num: string
  caption: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <figure className={styles.manualFigure}>
      <div className={styles.manualFigureBody}>{children}</div>
      <figcaption className={styles.manualFigureCaption}>
        <span className={styles.manualFigureNum}>Fig. {num}</span>
        <span className={styles.manualFigureText}>{caption}</span>
      </figcaption>
    </figure>
  )
}

/**
 * Note — the article's one callout grammar: a soft plinth with a quiet
 * serif-italic "Note" marker. Chapter-closing or mid-chapter.
 */
export function Note({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <aside className={styles.synthesis}>
      <h3 className={styles.synthesisHeading}>
        <span className={styles.synthesisTag}>Note</span>
        {title}
      </h3>
      {children}
    </aside>
  )
}

/**
 * ExamplePrompt — a specimen of a real prompt, set in typewriter with a
 * caption note below.
 */
export function ExamplePrompt({ note, text }: { note: string; text: string }) {
  return (
    <figure className={styles.examplePrompt}>
      <div className={styles.examplePromptCard}>
        <span className={styles.examplePromptLabel}>From the wild</span>
        <p className={styles.examplePromptText}>{text}</p>
      </div>
      <figcaption className={styles.examplePromptNote}>{note}</figcaption>
    </figure>
  )
}
