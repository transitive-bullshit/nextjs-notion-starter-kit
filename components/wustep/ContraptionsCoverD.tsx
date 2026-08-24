import { useId } from 'react'

import styles from './ContraptionsCoverD.module.css'
import {
  Bell,
  CELL,
  Conveyor,
  Dominoes,
  Gears,
  Hammer,
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
 * Variant D — specimen sheet.
 *
 * The app's own catalog view as a plate from a reference book: each machine on
 * a shelf rule under a tracked small-caps name. Hover runs a roll call — every
 * specimen performs once, left to right down the row, so the card demonstrates
 * the set rather than a composition made from it.
 */

const STAGE_W = 960
const STAGE_H = 200
/** Low enough that the header, the row and the captions sit centred as a
    block — the plate is the whole composition, so stray empty paper below it
    reads as a mistake rather than as margin. */
const SHELF_Y = 140
const PITCH = 96
/** Centred on the stage so the narrow crop lands on whole specimens. */
const FIRST_X = STAGE_W / 2 - PITCH * 4.5

const SPECIMENS: Array<{ Motif: Motif; label: string; move?: string }> = [
  { Motif: Pendulum, label: 'PENDULUM', move: styles.swing },
  { Motif: Gears, label: 'GEAR PAIR', move: styles.spin },
  { Motif: Hammer, label: 'HAMMER', move: styles.strike },
  { Motif: Pipe, label: 'PIPE', move: styles.drop },
  { Motif: Dominoes, label: 'DOMINOES', move: styles.topple },
  { Motif: Bell, label: 'BELL', move: styles.ring },
  { Motif: Windmill, label: 'WINDMILL', move: styles.spin },
  { Motif: Orbit, label: 'ORBIT', move: styles.spin },
  { Motif: Conveyor, label: 'CONVEYOR', move: styles.march },
  { Motif: Slope, label: 'SLOPE BALL', move: styles.drop }
]

/** Wings, so a wide card reveals more of the plate rather than empty paper. */
const EXTRA: Motif[] = [Pulse, Spring, Wavy, Signal]

export function ContraptionsCoverD() {
  const uid = useId().replaceAll(':', '')
  const id = (name: string) => `cd-${name}-${uid}`

  const wings = [-2, -1, 10, 11].map((i, n) => ({
    key: `w${i}`,
    x: FIRST_X + i * PITCH,
    Motif: EXTRA[n % EXTRA.length]!,
    color: PALETTE[n % PALETTE.length]!
  }))

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

          <text className={styles.header} x={STAGE_W / 2} y='46'>
            37 CONTRAPTIONS · OKAZZ
          </text>

          {/* Wings are unlabelled and unanimated: they are the plate running
              off the edge, not specimens competing for attention. */}
          <g
            stroke={INK}
            strokeWidth={2.2}
            strokeLinecap='round'
            strokeLinejoin='round'
            fill='none'
            opacity={0.5}
          >
            {wings.map(({ key, x, Motif: M, color }) => (
              <g key={key} transform={`translate(${x} ${SHELF_Y - CELL / 2})`}>
                <M c={color} />
              </g>
            ))}
          </g>

          <g
            stroke={INK}
            strokeWidth={2.4}
            strokeLinecap='round'
            strokeLinejoin='round'
            fill='none'
          >
            {SPECIMENS.map(({ Motif: M, move }, i) => (
              <g
                key={i}
                transform={`translate(${FIRST_X + i * PITCH} ${SHELF_Y - CELL / 2})`}
              >
                <M c={PALETTE[i % PALETTE.length]!} move={move} />
              </g>
            ))}
          </g>

          {/* One shelf rule per specimen, so they all stand on the same ground
              line however tall their drawing happens to be. */}
          <g stroke='rgba(33,33,33,0.34)' strokeWidth={1.4}>
            {SPECIMENS.map((_, i) => (
              <line
                key={i}
                x1={FIRST_X + i * PITCH - 32}
                y1={SHELF_Y + 4}
                x2={FIRST_X + i * PITCH + 32}
                y2={SHELF_Y + 4}
              />
            ))}
          </g>

          {SPECIMENS.map(({ label }, i) => (
            <text
              key={i}
              className={styles.caption}
              x={FIRST_X + i * PITCH}
              y={SHELF_Y + 24}
            >
              {label}
            </text>
          ))}
        </g>
      </svg>
    </div>
  )
}
