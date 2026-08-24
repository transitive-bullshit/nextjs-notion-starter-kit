import { type ReactNode } from 'react'

/**
 * Shared machine motifs for the Contraptions covers.
 *
 * The generator draws every machine as heavy ink outline plus exactly one flat
 * fill, on paper. These are hand-simplified caricatures of the real ones at
 * card size, in the project's own palette — a cover is a caricature, not a
 * screenshot, and the real p5 machines carry far more detail than survives at
 * 40 units square.
 *
 * Every motif draws inside a 40×40 cell centred on its own origin, so a cover
 * places one with a single translate. The `move` class goes on whichever part
 * of the machine is supposed to animate; each motif's doc comment names the
 * transform-origin that class needs.
 */

/** The `okazz` theme from the generator, which is the app's default look. */
export const INK = '#212121'
export const PAPER = '#ebf1f4'
export const PALETTE = ['#fcb500', '#007eb6', '#009135', '#e76b31', '#eb335e']

/** Cell edge in viewBox units. Every motif is drawn to this. */
export const CELL = 40

export type MotifProps = {
  /** The machine's single flat fill. */
  c: string
  /** Class applied to the moving part. */
  move?: string
}

export type Motif = (props: MotifProps) => ReactNode

const H = CELL / 2

/** Ceiling rail. Rails that touch the cell edge are what knit neighbours together. */
function Ceil() {
  return <line x1={-H} y1={-H} x2={H} y2={-H} />
}
function Floor() {
  return <line x1={-H} y1={H} x2={H} y2={H} />
}

/** Pendulum. `move`: rotate about `50% 0%`. */
export function Pendulum({ c, move }: MotifProps) {
  return (
    <g>
      <Ceil />
      <g className={move}>
        <line x1={0} y1={-H} x2={0} y2={5} />
        <circle cx={0} cy={5} r={6} fill={c} />
      </g>
    </g>
  )
}

/** Radial tooth ticks around a gear centred at `cx`. */
function teeth(cx: number) {
  return Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2
    return (
      <line
        key={i}
        x1={cx + Math.cos(a) * 7}
        y1={Math.sin(a) * 7}
        x2={cx + Math.cos(a) * 10}
        y2={Math.sin(a) * 10}
      />
    )
  })
}

/** Meshing gear pair on a shaft. `move`: rotate about `center`. */
export function Gears({ c, move }: MotifProps) {
  return (
    <g>
      <line x1={-H} y1={0} x2={H} y2={0} />
      {[-8, 8].map((cx) => (
        <g key={cx}>
          <g className={move} style={{ transformOrigin: `${cx}px 0px` }}>
            <circle cx={cx} cy={0} r={7} fill='none' />
            {teeth(cx)}
          </g>
          <circle cx={cx} cy={0} r={2.6} fill={c} />
        </g>
      ))}
    </g>
  )
}

/** A weight fired up its rail. `move`: translateY. */
export function Hammer({ c, move }: MotifProps) {
  return (
    <g>
      <Ceil />
      <Floor />
      <line x1={0} y1={-15} x2={0} y2={15} />
      <circle className={move} cx={0} cy={9} r={6} fill={c} />
    </g>
  )
}

/** Bell on a hanger. `move`: rotate about `50% 0%`. */
export function Bell({ c, move }: MotifProps) {
  return (
    <g>
      <Ceil />
      <g className={move}>
        <line x1={0} y1={-H} x2={0} y2={-11} />
        <path d='M -9 6 C -9 -6 -4 -11 0 -11 C 4 -11 9 -6 9 6 Z' fill={c} />
        <line x1={-9} y1={6} x2={9} y2={6} />
        <circle cx={0} cy={9} r={2.4} fill={c} />
      </g>
    </g>
  )
}

/**
 * A bulb on a post — the machine that most obviously reacts to a signal.
 * `move` toggles the rays and the fill; the bulb reads as dark at rest.
 */
export function Lamp({ c, move }: MotifProps) {
  return (
    <g>
      <Floor />
      <line x1={0} y1={H} x2={0} y2={4} />
      <g className={move}>
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2 + Math.PI / 8
          return (
            <line
              key={i}
              x1={Math.cos(a) * 10}
              y1={-4 + Math.sin(a) * 10}
              x2={Math.cos(a) * 15}
              y2={-4 + Math.sin(a) * 15}
              stroke={c}
            />
          )
        })}
      </g>
      <circle cx={0} cy={-4} r={7.5} fill={PAPER} />
    </g>
  )
}

/** Four sails on a tower. `move`: rotate about `center`. */
export function Windmill({ c, move }: MotifProps) {
  return (
    <g>
      <Floor />
      <line x1={-8} y1={H} x2={-2} y2={-5} />
      <line x1={8} y1={H} x2={2} y2={-5} />
      <g className={move} style={{ transformOrigin: '0px -5px' }}>
        {[0, 90, 180, 270].map((deg) => (
          <rect
            key={deg}
            x={2}
            y={-9}
            width={13}
            height={8}
            fill={c}
            transform={`rotate(${deg} 0 -5)`}
          />
        ))}
        <circle cx={0} cy={-5} r={3} fill={c} />
      </g>
    </g>
  )
}

/** Rings running out from the centre. `move`: scale about `center`. */
export function Pulse({ c, move }: MotifProps) {
  return (
    <g>
      <g className={move}>
        <circle cx={0} cy={0} r={15} fill='none' />
        <circle cx={0} cy={0} r={10} fill='none' />
      </g>
      <circle cx={0} cy={0} r={5} fill={c} />
    </g>
  )
}

/** Three lamps in a housing; `move` shifts which one is lit. */
export function Signal({ c, move }: MotifProps) {
  return (
    <g>
      <rect x={-8} y={-15} width={16} height={30} rx={3} fill='none' />
      <line x1={0} y1={15} x2={0} y2={H} />
      {[-9, 0, 9].map((cy) => (
        <circle key={cy} cx={0} cy={cy} r={4.4} fill={PAPER} />
      ))}
      <circle className={move} cx={0} cy={-9} r={4.4} fill={c} />
    </g>
  )
}

/** A ball threading an S-bend. `move`: offset-path along the pipe. */
export function Pipe({ c, move }: MotifProps) {
  return (
    <g>
      <Ceil />
      <Floor />
      <path
        d='M -7 -20 L -7 -7 A 7 7 0 0 0 7 -7 L 7 7 A 7 7 0 0 0 -7 7 L -7 20'
        fill='none'
      />
      <circle className={move} cx={-7} cy={-13} r={4.5} fill={c} />
    </g>
  )
}

/** A body on a marked orbit. `move`: rotate about `center`. */
export function Orbit({ c, move }: MotifProps) {
  return (
    <g>
      <circle cx={0} cy={0} r={13} fill='none' strokeDasharray='3 3.5' />
      <circle cx={0} cy={0} r={3.2} fill='none' />
      <g className={move}>
        <circle cx={13} cy={0} r={5} fill={c} />
      </g>
    </g>
  )
}

/** A square walking its own perimeter. `move`: translate. */
export function BoxStep({ c, move }: MotifProps) {
  return (
    <g>
      <rect x={-H} y={-H} width={CELL} height={CELL} fill='none' />
      <rect className={move} x={7} y={7} width={13} height={13} fill={c} />
    </g>
  )
}

/** A ball running a quarter-arc chute. `move`: offset along the arc. */
export function Slope({ c, move }: MotifProps) {
  return (
    <g>
      <path d={`M ${-H} ${H} A ${CELL} ${CELL} 0 0 0 ${H} ${-H}`} fill='none' />
      <line x1={-H} y1={-H} x2={-H} y2={H} />
      <line x1={-H} y1={-H} x2={H} y2={-H} />
      <circle className={move} cx={2} cy={2} r={6} fill={c} />
    </g>
  )
}

/** A wave running down a cord. `move`: translateX on the whole cord. */
export function Wavy({ c, move }: MotifProps) {
  return (
    <g>
      <Ceil />
      <Floor />
      <path
        className={move}
        d='M 0 -20 C 10 -13 -10 -6 0 0 C 10 6 -10 13 0 20'
        fill='none'
      />
      <rect x={-10} y={12} width={20} height={8} fill={c} />
    </g>
  )
}

/** A block on a spring. `move`: translateY. */
export function Spring({ c, move }: MotifProps) {
  return (
    <g>
      <Ceil />
      <Floor />
      <g className={move}>
        <path d='M 0 20 L -6 15 L 6 10 L -6 5 L 6 0 L 0 -3' fill='none' />
        <rect x={-9} y={-12} width={18} height={9} fill={c} />
      </g>
    </g>
  )
}

/** Bars going over in sequence. `move`: rotate each about `50% 100%`. */
export function Dominoes({ c, move }: MotifProps) {
  return (
    <g>
      <Floor />
      {[-12, -4, 4, 12].map((x, i) => (
        <rect
          key={x}
          className={move}
          style={{
            transformOrigin: `${x}px 20px`,
            animationDelay: `${i * 90}ms`
          }}
          x={x - 2.5}
          y={5}
          width={5}
          height={15}
          fill={c}
        />
      ))}
    </g>
  )
}

/** Crates riding a belt. `move`: translateX. */
export function Conveyor({ c, move }: MotifProps) {
  return (
    <g>
      <path
        d='M -11 -6 L 11 -6 A 6 6 0 0 1 11 6 L -11 6 A 6 6 0 0 1 -11 -6 Z'
        fill='none'
      />
      <line x1={-11} y1={0} x2={11} y2={0} />
      <g className={move}>
        {[-10, 0, 10].map((x) => (
          <rect key={x} x={x - 4} y={-13} width={8} height={7} fill={c} />
        ))}
      </g>
    </g>
  )
}

/** Every motif, for covers that want to fill a grid. */
export const MOTIFS: Motif[] = [
  Pendulum,
  Gears,
  Hammer,
  Bell,
  Windmill,
  Pulse,
  Signal,
  Pipe,
  Orbit,
  BoxStep,
  Slope,
  Wavy,
  Spring,
  Dominoes,
  Conveyor
]
