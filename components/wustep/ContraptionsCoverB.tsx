import { useId } from 'react'

import styles from './ContraptionsCoverB.module.css'
import {
  Bell,
  CELL,
  Conveyor,
  Gears,
  INK,
  type Motif,
  Orbit,
  PALETTE,
  Pendulum,
  Pipe,
  Pulse,
  Signal,
  Slope,
  Spring,
  Wavy,
  Windmill
} from './ContraptionsMotifs'

/**
 * Variant B — poster treatment.
 *
 * The wordmark set on paper between two rules, with the machines demoted to a
 * band of ornament along the top and bottom edges. Hover starts the ornaments
 * and sends a bead down the lower rule, so the poster turns out to be wired.
 */

const STAGE_W = 960
const STAGE_H = 200
const MID = STAGE_W / 2

/** Ornament bands, far enough out that the wordmark keeps the centre. */
const BAND: Motif[] = [
  Gears,
  Pendulum,
  Pulse,
  Windmill,
  Pipe,
  Orbit,
  Bell,
  Slope,
  Conveyor,
  Spring,
  Signal,
  Wavy
]

const IDLE = new Map<Motif, string | undefined>([
  [Gears, styles.spin],
  [Windmill, styles.spin],
  [Orbit, styles.spin],
  [Pendulum, styles.swing],
  [Bell, styles.swing],
  [Pulse, styles.breathe]
])

export function ContraptionsCoverB() {
  const uid = useId().replaceAll(':', '')
  const id = (name: string) => `cb-${name}-${uid}`

  // Two rows of ornament running the full stage width; the wordmark sits
  // between them, so the bands read as the top and bottom of a poster.
  const cols = STAGE_W / CELL
  const ornaments = [0, 1].flatMap((row) =>
    Array.from({ length: cols }, (_, c) => {
      const M = BAND[(c * 5 + row * 3) % BAND.length]!
      return {
        key: `${row}-${c}`,
        x: c * CELL + CELL / 2,
        y: row === 0 ? 26 : STAGE_H - 26,
        Motif: M,
        color: PALETTE[(c + row * 2) % PALETTE.length]!,
        move: IDLE.get(M)
      }
    })
  )

  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        <defs>
          <clipPath id={id('stage')}>
            <rect x='0' y='0' width={STAGE_W} height={STAGE_H} />
          </clipPath>
        </defs>

        <g clipPath={`url(#${id('stage')})`}>
          <rect x='0' y='0' width={STAGE_W} height={STAGE_H} fill='#ebf1f4' />

          {/* Ornament is drawn at half weight so it reads as texture and the
              wordmark keeps the hierarchy. */}
          <g
            stroke={INK}
            strokeWidth={1.9}
            strokeLinecap='round'
            strokeLinejoin='round'
            fill='none'
            opacity={0.85}
          >
            {ornaments.map(({ key, x, y, Motif: M, color, move }) => (
              <g key={key} transform={`translate(${x} ${y}) scale(0.86)`}>
                <M c={color} move={move} />
              </g>
            ))}
          </g>

          {/* Rules, with a paper band behind the type so ornament never
              collides with the wordmark at any crop width. */}
          <rect x='0' y='72' width={STAGE_W} height={56} fill='#ebf1f4' />
          <line
            x1='0'
            y1='72'
            x2={STAGE_W}
            y2='72'
            stroke={INK}
            strokeWidth={2.4}
          />
          <line
            x1='0'
            y1='128'
            x2={STAGE_W}
            y2='128'
            stroke={INK}
            strokeWidth={2.4}
          />

          <text className={styles.word} x={MID} y='104'>
            CONTRAPTIONS
          </text>
          <text className={styles.sub} x={MID} y='146'>
            SEEDED · LOOPING · WIRED
          </text>

          {/* The bead runs the lower rule, so the poster turns out to be a
              circuit. It crosses the whole stage, not just the visible crop. */}
          <circle
            className={styles.bead}
            cx={0}
            cy={128}
            r={6}
            fill={PALETTE[4]}
            stroke={INK}
            strokeWidth={2}
          />
        </g>
      </svg>
    </div>
  )
}
