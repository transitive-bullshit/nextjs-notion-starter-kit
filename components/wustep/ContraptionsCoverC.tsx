import { useId } from 'react'

import styles from './ContraptionsCoverC.module.css'
import {
  Bell,
  BoxStep,
  CELL,
  Gears,
  Hammer,
  INK,
  type Motif,
  Orbit,
  PALETTE,
  Pendulum,
  Pipe,
  Pulse,
  Slope,
  Spring,
  Wavy,
  Windmill
} from './ContraptionsMotifs'

/**
 * Variant C — the signature mechanic, made huge.
 *
 * Three machines and the conduit between them, blown up until the causal chain
 * is the whole card: the hammer strikes, a bead runs the wire, the gears take
 * a step, another bead, and the bell rings. The rest of the grid is pushed out
 * to the wings at quarter weight so the run has something to be part of.
 */

const STAGE_W = 960
const STAGE_H = 200
const MID_Y = 96

/** Big enough that three fit the narrow crop with the conduit showing. */
const SCALE = 2.5
const SPACING = 122
const HERO_X = [480 - SPACING, 480, 480 + SPACING]

const WING: Motif[] = [
  Pendulum,
  Pulse,
  Pipe,
  BoxStep,
  Orbit,
  Wavy,
  Slope,
  Spring,
  Windmill,
  Gears
]

export function ContraptionsCoverC() {
  const uid = useId().replaceAll(':', '')
  const id = (name: string) => `cc-${name}-${uid}`

  // Wing machines fill everything outside the hero band. Cells that would
  // collide with the heroes are skipped rather than drawn and covered.
  const cols = STAGE_W / CELL
  const rows = STAGE_H / CELL
  const wings: Array<{ key: string; x: number; y: number; Motif: Motif }> = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * CELL + CELL / 2
      const y = r * CELL + CELL / 2
      if (x > 300 && x < 660 && y > 20 && y < 176) continue
      wings.push({
        key: `${r}-${c}`,
        x,
        y,
        Motif: WING[(r * 3 + c * 5) % WING.length]!
      })
    }
  }

  const heroes: Array<{ Motif: Motif; color: string; move?: string }> = [
    { Motif: Hammer, color: PALETTE[4]!, move: styles.strike },
    { Motif: Gears, color: PALETTE[0]!, move: styles.step },
    { Motif: Bell, color: PALETTE[1]!, move: styles.ring }
  ]

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

          <g
            stroke={INK}
            strokeWidth={2}
            strokeLinecap='round'
            strokeLinejoin='round'
            fill='none'
            opacity={0.16}
          >
            {wings.map(({ key, x, y, Motif: M }) => (
              <g key={key} transform={`translate(${x} ${y}) scale(0.9)`}>
                <M c={INK} />
              </g>
            ))}
          </g>

          {/* Conduit first, so it runs behind the machines it feeds. */}
          <g strokeLinecap='round'>
            <line
              x1={HERO_X[0]}
              y1={MID_Y}
              x2={HERO_X[2]}
              y2={MID_Y}
              stroke={INK}
              strokeWidth={13}
            />
            <line
              x1={HERO_X[0]}
              y1={MID_Y}
              x2={HERO_X[2]}
              y2={MID_Y}
              stroke='#ebf1f4'
              strokeWidth={6}
            />
          </g>

          <g
            stroke={INK}
            strokeWidth={2.4 / SCALE}
            strokeLinecap='round'
            strokeLinejoin='round'
            fill='none'
          >
            {heroes.map(({ Motif: M, color, move }, i) => (
              <g
                key={i}
                transform={`translate(${HERO_X[i]} ${MID_Y}) scale(${SCALE})`}
              >
                <M c={color} move={move} />
              </g>
            ))}
          </g>

          <g stroke={INK} strokeWidth={2.6} fill='#ebf1f4'>
            <circle cx={(HERO_X[0]! + HERO_X[1]!) / 2} cy={MID_Y} r={6} />
            <circle cx={(HERO_X[1]! + HERO_X[2]!) / 2} cy={MID_Y} r={6} />
          </g>

          {/* One bead per link, a beat apart — the delay is what makes the run
              read as caused rather than as three machines all going at once. */}
          <g stroke={INK} strokeWidth={2.4}>
            {[0, 1].map((k) => (
              <circle
                key={k}
                className={styles.bead}
                style={{ animationDelay: `${0.5 + k * 0.9}s` }}
                cx={HERO_X[k]}
                cy={MID_Y}
                r={9}
                fill={PALETTE[k === 0 ? 4 : 0]}
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  )
}
