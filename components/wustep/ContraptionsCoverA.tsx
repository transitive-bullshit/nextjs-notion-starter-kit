import { useId } from 'react'

import styles from './ContraptionsCoverA.module.css'
import {
  Bell,
  BoxStep,
  CELL,
  Conveyor,
  Gears,
  Hammer,
  INK,
  Lamp,
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
 * Variant A — the app in miniature.
 *
 * A patch of the generator's own grid, and on hover the thing the project is
 * actually about: a wired chain fires across the middle, a bead runs each link
 * of conduit in turn, and the lamp on the end lights when the signal reaches
 * it. Everything else in the grid idles.
 */

// The stage is far wider than any card so wide cards reveal more grid rather
// than letterboxing. `slice` keeps the full height; only the middle ~320 units
// survive on the narrowest card, so the chain lives there.
const STAGE_W = 960
const STAGE_H = 200
const COLS = STAGE_W / CELL
const ROWS = STAGE_H / CELL

/** The wired run: row 2, columns 8–12, dead centre of the narrow crop. */
const CHAIN_ROW = 2
const CHAIN_FROM = 8
const CHAIN_TO = 12

/** Filler machines, cycled by cell index so the grid is stable across renders. */
const FILLER: Motif[] = [
  Pendulum,
  Pulse,
  Pipe,
  BoxStep,
  Orbit,
  Wavy,
  Slope,
  Spring,
  Signal,
  Windmill,
  Bell,
  Gears
]

/** Which filler motifs get an idle animation, and which class drives it. */
const IDLE = new Map<Motif, string | undefined>([
  [Pendulum, styles.swing],
  [Orbit, styles.spin],
  [Windmill, styles.spin],
  [Gears, styles.spin],
  [Bell, styles.swingSoft],
  [Pulse, styles.breathe],
  [Wavy, styles.slide]
])

export function ContraptionsCoverA() {
  // defs ids collide across card instances; colons break url(#…) refs.
  const uid = useId().replaceAll(':', '')
  const id = (name: string) => `ca-${name}-${uid}`

  const cells: Array<{
    key: string
    x: number
    y: number
    Motif: Motif
    color: string
    move?: string
    link?: number
  }> = []

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c * CELL + CELL / 2
      const y = r * CELL + CELL / 2
      const onChain = r === CHAIN_ROW && c >= CHAIN_FROM && c <= CHAIN_TO
      const link = onChain ? c - CHAIN_FROM : undefined

      if (onChain) {
        // source -> relay -> relay -> relay -> sink, the grammar the generator
        // enforces when it builds a chain.
        const CHAIN: Motif[] = [Hammer, Gears, Windmill, Conveyor, Lamp]
        const M = CHAIN[link!]!
        cells.push({
          key: `${r}-${c}`,
          x,
          y,
          Motif: M,
          color: PALETTE[link! % PALETTE.length]!,
          move: [
            styles.strike,
            styles.spinFire,
            styles.spinFire,
            styles.marchFire,
            styles.lampFire
          ][link!],
          link
        })
        continue
      }

      const M = FILLER[(r * 7 + c * 3) % FILLER.length]!
      cells.push({
        key: `${r}-${c}`,
        x,
        y,
        Motif: M,
        color: PALETTE[(r * 5 + c) % PALETTE.length]!,
        move: IDLE.get(M)
      })
    }
  }

  const chainY = CHAIN_ROW * CELL + CELL / 2
  const links = CHAIN_TO - CHAIN_FROM

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

          {/* Conduit under the machines, the way the generator draws it: a
              heavy ink channel with a paper core running through it. */}
          <g strokeLinecap='round'>
            <line
              x1={CHAIN_FROM * CELL + CELL / 2}
              y1={chainY}
              x2={CHAIN_TO * CELL + CELL / 2}
              y2={chainY}
              stroke={INK}
              strokeWidth={9}
            />
            <line
              x1={CHAIN_FROM * CELL + CELL / 2}
              y1={chainY}
              x2={CHAIN_TO * CELL + CELL / 2}
              y2={chainY}
              stroke='#ebf1f4'
              strokeWidth={4}
            />
          </g>

          <g
            stroke={INK}
            strokeWidth={2.4}
            strokeLinecap='round'
            strokeLinejoin='round'
            fill='none'
          >
            {cells.map(({ key, x, y, Motif: M, color, move }) => (
              <g key={key} transform={`translate(${x} ${y})`}>
                <M c={color} move={move} />
              </g>
            ))}
          </g>

          {/* Junctions sit where the conduit crosses between cells, never on a
              cell centre — a terminal on a centre punches a hole through the
              machine it feeds. */}
          <g stroke={INK} strokeWidth={2.4} fill='#ebf1f4'>
            {Array.from({ length: links }, (_, k) => (
              <circle
                key={k}
                cx={(CHAIN_FROM + k) * CELL + CELL}
                cy={chainY}
                r={4.2}
              />
            ))}
          </g>

          {/* One bead per link, each crossing during its own slice of the loop. */}
          <g stroke={INK} strokeWidth={2}>
            {Array.from({ length: links }, (_, k) => (
              <circle
                key={k}
                className={styles.bead}
                style={{ animationDelay: `${k * 0.42}s` }}
                cx={(CHAIN_FROM + k) * CELL + CELL / 2}
                cy={chainY}
                r={6}
                fill={PALETTE[k % PALETTE.length]}
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  )
}
