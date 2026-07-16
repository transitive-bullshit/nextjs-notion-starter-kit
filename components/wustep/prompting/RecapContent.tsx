import Link from 'next/link'
import * as React from 'react'

import { ChapterBody } from './ChapterBody'
import { Bracket, Group, Op } from './EquationDemo'
import { Note } from './parts'
import styles from './PromptingPage.module.css'

export function RecapContent() {
  return (
    <ChapterBody>
      <RecapItem
        index={1}
        title='The beginner’s mindset'
        href='/prompting/mindset'
      >
        <RecapMindsetViz />
        <p>
          We&apos;re three years into a five-hundred-year skill. About 1200 ELO.
          When the model lets you down, the closed-minded blame the AI; the
          open-minded ask what they could have done differently. The second is
          the faster path &mdash; by a lot.
        </p>
      </RecapItem>

      <RecapItem index={2} title='The equation' href='/prompting/equation'>
        <RecapEquationViz />
        <p>
          When the output disappoints, walk the four levers. Better tool. Better
          model. Better prompt. Better context. The biggest lever is almost
          always context.
        </p>
      </RecapItem>

      <RecapItem index={3} title='Techniques' href='/prompting/techniques'>
        <p className={styles.recapTechniquesIntro}>
          Practice a repertoire of techniques, like:
        </p>
        <ul className={styles.recapList}>
          <li>What questions should you ask me before starting?</li>
          <li>What&apos;s the smallest version of this that ships?</li>
          <li>Give me 3 options, rank them, name the trade-offs.</li>
          <li>Argue against your last suggestion.</li>
          <li>What did you skip?</li>
          <li>How would a senior engineer review this?</li>
          <li>
            Match the style of <code>components/PostCard.tsx</code>.
          </li>
          <li>Update CLAUDE.md with what you just learned.</li>
        </ul>
      </RecapItem>

      <RecapItem index={4} title='The tree' href='/prompting/tree'>
        <RecapTreeViz />
        <p>
          Every change lives somewhere on a 2D map: <em>breadth</em> (which area
          of code) × <em>depth</em> (how zoomed in). At any cell, three moves:{' '}
          <strong>ask</strong>, <strong>plan</strong>, <strong>delegate</strong>
          . Most non-trivial work moves through all three.
        </p>
      </RecapItem>

      <RecapItem index={5} title='The colleague' href='/prompting/colleague'>
        <RecapColleagueViz />
        <p>
          Treat the agent as a colleague &mdash; a fast, knowledgeable{' '}
          <s>junior</s> senior who only sees what you&apos;ve shown them. The
          discipline gets <em>more</em> important, not less, as the models get
          smarter.
        </p>
      </RecapItem>

      <RecapItem
        index={6}
        title='Orchestration'
        href='/prompting/orchestration'
      >
        <RecapOrchestrationViz />
        <p>
          One agent makes you faster &mdash; but now you have access to a whole
          team. The bottleneck stops being model speed and becomes <em>you</em>:
          how well you can brief them, unblock them, and manage several at once.
          Optimize the hour, not the message.
        </p>
      </RecapItem>

      <Note title='One more thing'>
        <p>
          We&apos;re all early in this. Three years in. Maybe 1200 ELO. The next
          1200 is wide open &mdash; and the most useful move is paying attention
          while everyone else assumes they&apos;ve figured it out.
        </p>
        <p>Go talk to a machine.</p>
      </Note>

      <section className={styles.resources}>
        <h3 className={styles.resourcesHeading}>Additional readings</h3>
        <ul className={styles.resourcesList}>
          <li className={styles.resourcesItem}>
            <a
              href='https://github.com/cursor/plugins/blob/main/pstack/README.md'
              target='_blank'
              rel='noopener noreferrer'
              className={styles.resourcesLink}
            >
              pstack
            </a>
            <span className={styles.resourcesDesc}>
              a grab bag of excellent skills
            </span>
          </li>
          <li className={styles.resourcesItem}>
            <a
              href='https://x.com/bcherny'
              target='_blank'
              rel='noopener noreferrer'
              className={styles.resourcesLink}
            >
              Boris Cherny
            </a>
            <span className={styles.resourcesDesc}>on Twitter/X</span>
          </li>
          <li className={styles.resourcesItem}>
            <a
              href='https://x.com/trq212/articles'
              target='_blank'
              rel='noopener noreferrer'
              className={styles.resourcesLink}
            >
              Thariq
            </a>
            <span className={styles.resourcesDesc}>&apos;s articles</span>
          </li>
        </ul>
      </section>
    </ChapterBody>
  )
}

function RecapItem({
  index,
  title,
  href,
  children
}: {
  index: number
  title: string
  href: string
  children: React.ReactNode
}) {
  return (
    <section className={styles.recapItem}>
      <header className={styles.recapHeader}>
        <span className={styles.recapIndex} aria-hidden='true'>
          {String(index).padStart(2, '0')}
        </span>
        <Link href={href} className={styles.recapTitle}>
          {title}
          <span className={styles.recapTitleArrow} aria-hidden='true'>
            →
          </span>
        </Link>
      </header>
      <div className={styles.recapBody}>{children}</div>
    </section>
  )
}

function RecapEquationViz() {
  return (
    <div className={styles.recapEquationViz} aria-hidden='true'>
      <Group>
        <Bracket>(</Bracket>
        <span className={`${styles.recapToken} ${styles.recapTokenLever}`}>
          TOOL
        </span>
        <Op subtle>+</Op>
        <span className={`${styles.recapToken} ${styles.recapTokenLever}`}>
          MODEL
        </span>
        <Bracket>)</Bracket>
      </Group>
      <Op>×</Op>
      <Group>
        <Bracket>(</Bracket>
        <span className={`${styles.recapToken} ${styles.recapTokenLever}`}>
          PROMPT
        </span>
        <Op subtle>+</Op>
        <span className={`${styles.recapToken} ${styles.recapTokenLever}`}>
          CONTEXT
        </span>
        <Bracket>)</Bracket>
      </Group>
      <Op>→</Op>
      <span className={`${styles.recapToken} ${styles.recapTokenOutput}`}>
        OUTPUT
      </span>
    </div>
  )
}

function RecapTreeViz() {
  // 4 columns × 3 rows. The (mid · UX) cell is "active"; cells on either
  // axis get a faint tint to evoke the crosshair from the tree demo.
  const ROWS = 3
  const COLS = 4
  const ACTIVE = { row: 1, col: 0 }

  return (
    <div className={styles.recapTreeViz} aria-hidden='true'>
      <div className={styles.recapTreeGrid}>
        {Array.from({ length: ROWS }).map((_, r) =>
          Array.from({ length: COLS }).map((__, c) => {
            const isActive = r === ACTIVE.row && c === ACTIVE.col
            const onAxis = !isActive && (r === ACTIVE.row || c === ACTIVE.col)
            return (
              <span
                key={`${r}-${c}`}
                className={`${styles.recapTreeCell} ${isActive ? styles.recapTreeCellActive : ''} ${onAxis ? styles.recapTreeCellOnAxis : ''}`}
              />
            )
          })
        )}
      </div>
      <div className={styles.recapTreeMoves}>
        <span>ask</span>
        <span className={styles.recapTreeMovesActive}>plan</span>
        <span>delegate</span>
      </div>
    </div>
  )
}

function RecapColleagueViz() {
  return (
    <div className={styles.recapColleagueViz} aria-hidden='true'>
      <span className={styles.recapColleagueStep}>Onboard</span>
      <span className={styles.recapColleagueArrow}>→</span>
      <span className={styles.recapColleagueStep}>Brief</span>
      <span className={styles.recapColleagueArrow}>→</span>
      <span className={styles.recapColleagueStep}>Review</span>
    </div>
  )
}

// Mindset viz — a tiny ELO distribution: you near the hump (~1200),
// Magnus far out in the right tail, a dashed gap between.
function RecapMindsetViz() {
  return (
    <div className={styles.recapMindsetViz} aria-hidden='true'>
      <svg
        viewBox='0 0 240 64'
        className={styles.recapMindsetSvg}
        preserveAspectRatio='xMidYMid meet'
      >
        <line
          x1='6'
          y1='52'
          x2='234'
          y2='52'
          className={styles.recapMindsetAxis}
        />

        <path
          d='M 6,46 C 26,30 50,16 74,16 C 100,16 122,34 144,44 C 168,52 204,52 234,52'
          className={styles.recapMindsetCurve}
        />

        <line
          x1='100'
          y1='22'
          x2='216'
          y2='50'
          className={styles.recapMindsetGap}
        />

        <g>
          <line
            x1='100'
            y1='22'
            x2='100'
            y2='52'
            className={styles.recapMindsetStem}
          />
          <circle
            cx='100'
            cy='22'
            r='3.4'
            className={styles.recapMindsetDotYou}
          />
          <text
            x='100'
            y='13'
            textAnchor='middle'
            className={styles.recapMindsetLabelYou}
          >
            you · 1200
          </text>
        </g>

        <g>
          <circle
            cx='216'
            cy='50'
            r='3.4'
            className={styles.recapMindsetDotMagnus}
          />
          <text
            x='216'
            y='42'
            textAnchor='end'
            className={styles.recapMindsetLabel}
          >
            Magnus
          </text>
        </g>
      </svg>
    </div>
  )
}

// Orchestration viz — one prompt fans out into three parallel agent
// lanes that converge on a single merge point. Geometry is fully
// connected: branches leave the prompt node, lanes share a right edge,
// and merge lines pull that edge back to one dot.
function RecapOrchestrationViz() {
  const lanes = [14, 34, 54] // vertical centers of the three agent lanes
  const NODE_RIGHT = 54
  const LANE_LEFT = 92
  const LANE_RIGHT = 184
  const MERGE_X = 214
  const MERGE_Y = 34

  return (
    <div className={styles.recapOrchViz} aria-hidden='true'>
      <svg
        viewBox='0 0 240 68'
        className={styles.recapOrchSvg}
        preserveAspectRatio='xMidYMid meet'
      >
        <rect
          x='4'
          y='25'
          width='50'
          height='18'
          rx='2'
          className={styles.recapOrchYou}
        />
        <text x='29' y='34.5' className={styles.recapOrchYouLabel}>
          you
        </text>

        {lanes.map((cy) => (
          <path
            key={`b-${cy}`}
            d={`M ${NODE_RIGHT},34 C ${NODE_RIGHT + 20},34 ${LANE_LEFT - 20},${cy} ${LANE_LEFT},${cy}`}
            className={styles.recapOrchBranch}
          />
        ))}

        {lanes.map((cy) => (
          <g key={`a-${cy}`}>
            <rect
              x={LANE_LEFT}
              y={cy - 6}
              width={LANE_RIGHT - LANE_LEFT}
              height='12'
              rx='1'
              className={styles.recapOrchAgent}
            />
            <circle
              cx={LANE_LEFT + 9}
              cy={cy}
              r='2.4'
              className={styles.recapOrchAgentDot}
            />
          </g>
        ))}

        {lanes.map((cy) => (
          <path
            key={`m-${cy}`}
            d={`M ${LANE_RIGHT},${cy} C ${LANE_RIGHT + 16},${cy} ${MERGE_X - 14},${MERGE_Y} ${MERGE_X},${MERGE_Y}`}
            className={styles.recapOrchMerge}
          />
        ))}

        <circle
          cx={MERGE_X}
          cy={MERGE_Y}
          r='4.5'
          className={styles.recapOrchMergeDot}
        />
      </svg>
    </div>
  )
}
