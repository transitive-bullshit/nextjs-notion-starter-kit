import * as React from 'react'

import { useInView } from '@/lib/use-in-view'

import { ChapterBody } from './ChapterBody'
import { Figure, Note, SectionHeading } from './parts'
import styles from './PromptingPage.module.css'

export function MindsetContent() {
  return (
    <ChapterBody>
      <p>
        If you&apos;ve been writing software with agents for a while, you might
        be starting to feel competent. Don&apos;t trust the feeling.
      </p>

      <Figure
        num='1.1'
        caption='Most chess players sit in the 600–1000 range. Three years of practice gets you to about 1200.'
      >
        <EloChart />
      </Figure>

      <p>
        AI coding is roughly three years old. Chess is five hundred. Three years
        of chess gets you to maybe 1200 ELO, enough to beat casual players and
        get crushed by anyone serious. A grandmaster beats a 1200 every single
        game. I don&apos;t think the gap in AI coding is that wide yet, but the
        people at the frontier are getting far more done than the people who
        decided they&apos;d figured it out.
      </p>

      <p>
        The trouble with deciding you&apos;re an expert is that your learning
        stalls. You stop reading tutorials, skip the bootcamp, ignore the
        patterns the model enabled last week. Look at where your workflow was
        twelve months ago, then project that forward. Most of the meta
        hasn&apos;t been uncovered yet, which is the fun part.
      </p>

      <SectionHeading num='1.1'>Two responses</SectionHeading>

      <p>
        Sooner or later the model lets you down: wrong code, wrong abstraction,
        a hallucinated API, or a confident sprint in the exact opposite
        direction of what you asked. What you do next decides how fast you
        learn.
      </p>

      <div className={styles.mindsetPair}>
        <section
          className={`${styles.mindsetCard} ${styles.mindsetCardClosed}`}
        >
          <h4 className={styles.mindsetCardHeading}>Closed: Blame the AI.</h4>
          <p>
            &ldquo;The model is bad.&rdquo; &ldquo;AI&apos;s overhyped.&rdquo;
            &ldquo;It can&apos;t do real work.&rdquo;
          </p>
        </section>

        <section className={`${styles.mindsetCard} ${styles.mindsetCardOpen}`}>
          <h4 className={styles.mindsetCardHeading}>
            Open: Ask what you could have done differently.
          </h4>
          <p>
            Was the prompt clear? What context was missing? What levers can you
            change?
          </p>
        </section>
      </div>

      <p>
        Gaming culture has a useful phrase for this: <em>skill issue</em>. When
        your character keeps dying, the level isn&apos;t broken, you&apos;re
        unskilled. It sounds flippant, but the move underneath is serious:
        assume, provisionally, that the bottleneck is you. It isn&apos;t always
        true. But this assumption helps you grow when it is.
      </p>

      <p>
        Most of the time the model isn&apos;t the limit. Your prompt is, or your
        context, or your patience. Assume it&apos;s you, and the same
        frustrating moment turns into a puzzle: which lever would have changed
        the result? Puzzles are more interesting than grudges, and you learn
        more from them.
      </p>

      <SectionHeading num='1.2'>Every failure is a puzzle</SectionHeading>

      <p>
        Treat each disappointment like a chess puzzle: try something, notice
        what actually worked, update your repertoire. You won&apos;t feel the
        difference in a week. You&apos;ll feel it in a quarter.
      </p>

      <Figure
        num='1.2'
        caption='The open loop climbs; the closed loop slides back.'
      >
        <PracticeLoop />
      </Figure>

      <p>
        The beginner&apos;s mindset is the faster path. Three years in, the
        people pulling away are the ones still treating themselves like
        beginners: still reading, still experimenting, still curious when the
        model surprises them.
      </p>

      <Note title="We're all beginners">
        <p>
          Closed minds blame the model. Open minds ask what they missed, and
          find something to learn in almost every transcript. Only one of those
          is still improving a year from now.
        </p>
      </Note>
    </ChapterBody>
  )
}

/* ─────────────────────────────────────────────────────────
 * ELO CHART STORYBOARD
 *
 *    0ms   waiting for IntersectionObserver (threshold 0.4)
 *  200ms   density curve fill fades in
 *  300ms   density curve stroke draws left → right (1400ms)
 * 1400ms   axis ticks + tier labels fade in
 * 1600ms   "You · 1200" marker fades in (line + dot + label)
 * 1900ms   gap arrow draws between the two markers
 * 2200ms   "Magnus · 2840" marker fades in
 * 2600ms   caption fades in below
 * ───────────────────────────────────────────────────────── */

/**
 * Smooth bell-shaped density curve. Three cubic beziers stitched with
 * C¹ continuity (horizontal tangent at the peak so it reads as a round
 * dome, not a V). Peak around ELO ~1050 (x=140).
 * x mapping: x = 40 + (ELO - 600) / 4.62.
 *
 * Marker height at ELO 1200 (x=170) ≈ y=35.
 */
const CURVE_PATH =
  'M 40,70 C 60,55 100,30 140,30 C 180,30 215,60 240,80 C 265,100 310,124 360,130 L 560,130'
const CURVE_FILL_PATH = `${CURVE_PATH} L 40,130 Z`

const YOU_X = 170
const YOU_Y = 35

function EloChart() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.35 })

  return (
    <div
      ref={ref}
      className={`${styles.eloChart} ${inView ? styles.eloChartVisible : ''}`}
    >
      <svg
        viewBox='0 0 600 180'
        className={styles.eloChartSvg}
        role='img'
        aria-label='Chess ELO distribution. Player density peaks around 1200 — where about three years of practice puts you. Magnus Carlsen, the world #1, sits at 2840 ELO, far out in the right tail.'
        preserveAspectRatio='xMidYMid meet'
      >
        <path
          d={CURVE_FILL_PATH}
          className={`${styles.eloChartCurveFill} ${styles.eloChartFillInk}`}
        />

        <path
          d={CURVE_PATH}
          fill='none'
          strokeWidth='1.75'
          strokeLinecap='round'
          pathLength={100}
          className={`${styles.eloChartCurveStroke} ${styles.eloChartStrokeInk}`}
        />

        <line
          x1='40'
          y1='130'
          x2='560'
          y2='130'
          className={styles.eloChartAxis}
        />

        <g className={styles.eloChartTicks}>
          <line x1='40' y1='130' x2='40' y2='135' />
          <line x1='170' y1='130' x2='170' y2='135' />
          <line x1='300' y1='130' x2='300' y2='135' />
          <line x1='430' y1='130' x2='430' y2='135' />
          <line x1='560' y1='130' x2='560' y2='135' />
        </g>

        <g className={styles.eloChartTierLabels}>
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

        <g className={styles.eloChartGap}>
          <line x1='176' y1='38' x2='519' y2='128' strokeDasharray='2 4' />
          <text x='347' y='76' textAnchor='middle'>
            Tons more to learn
          </text>
        </g>

        <g className={`${styles.eloChartMarker} ${styles.eloChartMarkerYou}`}>
          <line x1={YOU_X} y1={YOU_Y} x2={YOU_X} y2='130' />
          <circle cx={YOU_X} cy={YOU_Y} r='5.5' />
          <text x={YOU_X} y={YOU_Y - 13} textAnchor='middle'>
            You · 1200
          </text>
        </g>

        <g
          className={`${styles.eloChartMarker} ${styles.eloChartMarkerMagnus}`}
        >
          <line x1='525' y1='100' x2='525' y2='130' />
          <circle cx='525' cy='130' r='5.5' />
          <text x='525' y='91' textAnchor='middle'>
            Magnus · 2840
          </text>
        </g>
      </svg>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
 * PRACTICE LOOP
 *
 * Two ladders, side by side. The open loop climbs (try → notice →
 * update); the closed loop slides back (blame → stop → regress). Bars
 * fade up with a stagger once the figure scrolls into view. Reuses the
 * fork's color coding: open = orange, closed = ember.
 * ───────────────────────────────────────────────────────── */

const PRACTICE_OPEN = [1200, 1204, 1211, 1218, 1227]
const PRACTICE_CLOSED = [1200, 1198, 1192, 1186]

function PracticeLoop() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 })

  return (
    <div
      ref={ref}
      className={`${styles.practiceLoop} ${
        inView ? styles.practiceLoopVisible : ''
      }`}
    >
      <section className={`${styles.practiceCard} ${styles.practiceCardOpen}`}>
        <span className={styles.practiceLabel}>Open loop</span>
        <div className={styles.practiceLadder} aria-hidden='true'>
          {PRACTICE_OPEN.map((elo, i) => (
            <b key={elo} style={{ transitionDelay: `${200 + i * 90}ms` }}>
              {elo}
            </b>
          ))}
        </div>
        <strong className={styles.practiceFlow}>
          try &rarr; notice &rarr; update
        </strong>
        <p>One chess puzzle a day, and the curve climbs.</p>
      </section>

      <section
        className={`${styles.practiceCard} ${styles.practiceCardClosed}`}
      >
        <span className={styles.practiceLabel}>Closed loop</span>
        <div className={styles.practiceLadder} aria-hidden='true'>
          {PRACTICE_CLOSED.map((elo, i) => (
            <b key={elo} style={{ transitionDelay: `${200 + i * 90}ms` }}>
              {elo}
            </b>
          ))}
        </div>
        <strong className={styles.practiceFlow}>
          blame &rarr; stop &rarr; regress
        </strong>
        <p>The edge you had rusts.</p>
      </section>
    </div>
  )
}
