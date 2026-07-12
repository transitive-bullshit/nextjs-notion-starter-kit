import { type CSSProperties, useId } from 'react'

import styles from './SplashPanicCover.module.css'

/**
 * SplashPanicCover — "Meadow standoff" (gameplay vignette).
 *
 *   A miniature slice of the Sprout Meadow arena: a wall band up top,
 *   checkerboard grass on an 80px tile grid, two crates, and Pip and Bomba
 *   posted on safely diagonal tiles while a water balloon ticks between
 *   them. Hover runs one beat of the core loop — the balloon throbs,
 *   blushes, bursts into the game's plus-shaped splash along the grid axes
 *   (missing both bystanders), the cast flinches, and a fresh balloon
 *   re-inflates. Geometry, palettes, and the balloon recipe are lifted from
 *   the game's canvas sprites (splashpanic src/game/sprites).
 */

// Brand ink + Sprout Meadow theme colors, verbatim from the game.
const INK = '#2a2440'
const MEADOW = { light: '#bce49f', dark: '#b0da93', tuft: '#57b95c' }

// Everything sits on the game's 80px tile grid. Rows are shifted -20px so a
// 60px wall band tops the scene and four grass rows (centers 100/180/260/340)
// fill the rest; columns run on centers 40..600. The balloon holds
// (360, 180); the cast holds diagonal tiles that share neither its row nor
// its column, so the plus-burst soaks nobody.
const TILE = 80
const WALL_H = 60
const BALLOON = { x: 360, y: 180 }
const PIP = { x: 200, y: 260 }
const BOMBA = { x: 520, y: 100 }
const CRATES = [
  { x: 40, y: 100 },
  { x: 600, y: 260 }
]
const TUFTS = [
  { x: 280, y: 100 },
  { x: 600, y: 100 },
  { x: 120, y: 260 },
  { x: 40, y: 340 },
  { x: 440, y: 340 }
]

// Characters are ~100×100 squeeze-toy blobs centered on (0,0); these paths
// mirror the canvas drawing code so the cover reads as the real cast.
const BODY_PATH =
  'M0,-34 C26,-34 34,-14 34,4 C34,26 20,34 0,34 C-20,34 -34,26 -34,4 C-34,-14 -26,-34 0,-34 Z'

type ChibiProps = {
  kind: 'pip' | 'bomba'
  /** Which way the eyes look: 1 = right, -1 = left. */
  look: 1 | -1
}

function Chibi({ kind, look }: ChibiProps) {
  const col =
    kind === 'pip'
      ? { body: '#86e7b8', belly: '#eafff3', accent: '#2fa36b' }
      : { body: '#ff8b66', belly: '#ffe8d6', accent: '#c2503a' }
  const dx = look * 10

  return (
    <g stroke={INK} strokeWidth='5' strokeLinejoin='round'>
      {/* Species features sit behind the body blob. */}
      {kind === 'pip' ? (
        <g>
          {[-1, 1].map((side) => (
            <g key={side} transform={`rotate(${side * 8.6} ${side * 14} -46)`}>
              <ellipse cx={side * 14} cy='-46' rx='8' ry='20' fill={col.body} />
              <ellipse
                cx={side * 14}
                cy='-44'
                rx='4'
                ry='12'
                fill={col.belly}
                stroke='none'
              />
            </g>
          ))}
        </g>
      ) : (
        <g>
          {[-1, 1].map((side) => (
            <g key={side}>
              <circle cx={side * 22} cy='-30' r='11' fill={col.body} />
              <circle
                cx={side * 22}
                cy='-30'
                r='5'
                fill={col.accent}
                stroke='none'
              />
            </g>
          ))}
        </g>
      )}

      {/* Feet nubs, body blob, belly patch. */}
      <rect x='-22' y='26' width='16' height='14' rx='8' fill={col.body} />
      <rect x='6' y='26' width='16' height='14' rx='8' fill={col.body} />
      <path d={BODY_PATH} fill={col.body} />
      <ellipse cx='0' cy='12' rx='18' ry='16' fill={col.belly} stroke='none' />

      {/* Face: dot eyes with shines, smile, blush. */}
      <g stroke='none'>
        <circle cx={dx - 10} cy='-8' r='4.5' fill={INK} />
        <circle cx={dx + 10} cy='-8' r='4.5' fill={INK} />
        <circle cx={dx - 8.5} cy='-9.5' r='1.6' fill='#fff' />
        <circle cx={dx + 11.5} cy='-9.5' r='1.6' fill='#fff' />
        <ellipse
          cx={dx - 19}
          cy='0'
          rx='5'
          ry='3'
          fill='rgba(255,120,140,0.35)'
        />
        <ellipse
          cx={dx + 19}
          cy='0'
          rx='5'
          ry='3'
          fill='rgba(255,120,140,0.35)'
        />
      </g>
      <path
        d={`M ${dx + 4.45} 4.27 A 5 5 0 0 1 ${dx - 4.45} 4.27`}
        fill='none'
        strokeWidth='3'
        strokeLinecap='round'
      />
    </g>
  )
}

// Splash-burst droplets: rest offset (0,0), fly vector via CSS vars.
const DROPS: Array<{ x: number; y: number; r: number }> = [
  { x: 52, y: -40, r: 6 },
  { x: -56, y: -32, r: 5 },
  { x: 70, y: 26, r: 5 },
  { x: -64, y: 34, r: 6 },
  { x: 22, y: -70, r: 5 },
  { x: -26, y: 64, r: 5 },
  { x: 10, y: 74, r: 4 },
  { x: -14, y: -78, r: 4 }
]

export function SplashPanicCover() {
  const uid = useId().replaceAll(':', '')
  const id = (name: string) => `spa-${name}-${uid}`

  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox='0 0 640 360'
        preserveAspectRatio='xMidYMid meet'
      >
        <defs>
          {/* -20px row shift keys the checker to the wall band (see TILE
              comment above). */}
          <pattern
            id={id('checker')}
            width='160'
            height='160'
            patternUnits='userSpaceOnUse'
            patternTransform='translate(0,-20)'
          >
            <rect width='160' height='160' fill={MEADOW.dark} />
            <rect width='80' height='80' fill={MEADOW.light} />
            <rect x='80' y='80' width='80' height='80' fill={MEADOW.light} />
          </pattern>
          <radialGradient id={id('sun')} cx='0.5' cy='0.08' r='0.8'>
            <stop offset='0' stopColor='rgba(255,251,214,0.16)' />
            <stop offset='0.6' stopColor='rgba(255,251,214,0)' />
          </radialGradient>
          <radialGradient id={id('vign')} cx='0.5' cy='0.55' r='0.75'>
            <stop offset='0.55' stopColor='rgba(26,66,38,0)' />
            <stop offset='1' stopColor='rgba(26,66,38,0.16)' />
          </radialGradient>
          <radialGradient id={id('balloon')} cx='0.35' cy='0.32' r='0.85'>
            <stop offset='0' stopColor='#bfe9ff' />
            <stop offset='0.55' stopColor='#5db8f7' />
            <stop offset='1' stopColor='#2f7fd6' />
          </radialGradient>
          <clipPath id={id('bclip')}>
            <ellipse cx='0' cy='0' rx='34' ry='36' />
          </clipPath>
        </defs>

        {/* Wall band — the arena's top border, one block per tile column. */}
        <rect width='640' height={WALL_H} fill='#6e7a89' />
        {Array.from({ length: 8 }, (_, i) => i * TILE).map((x) => (
          <g key={x} stroke='rgba(42,36,64,0.35)' strokeWidth='3'>
            <rect
              x={x + 3}
              y='41'
              width='74'
              height='16'
              rx='5'
              fill='#798595'
            />
            <rect
              x={x + 3}
              y='3'
              width='74'
              height='42'
              rx='7'
              fill='#9aa7b4'
            />
          </g>
        ))}

        {/* Grass checker + the wall's cast shadow + lighting. */}
        <rect
          y={WALL_H}
          width='640'
          height={360 - WALL_H}
          fill={`url(#${id('checker')})`}
        />
        <rect y={WALL_H} width='640' height='9' fill='rgba(42,36,64,0.12)' />
        <rect width='640' height='360' fill={`url(#${id('sun')})`} />

        {/* Grass tufts, one per tile center. */}
        <g
          stroke={MEADOW.tuft}
          strokeWidth='3'
          strokeLinecap='round'
          opacity='0.7'
        >
          {TUFTS.map(({ x, y }) => (
            <g key={`${x}-${y}`}>
              <path d={`M${x - 7},${y + 8} q2,-9 0,-13`} fill='none' />
              <path d={`M${x - 1},${y + 8} q0,-11 3,-15`} fill='none' />
              <path d={`M${x + 5},${y + 8} q-1,-8 2,-11`} fill='none' />
            </g>
          ))}
        </g>

        {/* Crates (soft blocks), snapped to their tiles. */}
        {CRATES.map(({ x, y }) => (
          <g key={`${x}-${y}`} transform={`translate(${x - 36}, ${y - 36})`}>
            <rect
              width='72'
              height='72'
              rx='10'
              fill='#e8b06b'
              stroke={INK}
              strokeWidth='4'
            />
            <rect x='6' y='50' width='60' height='16' rx='6' fill='#c98a4b' />
            <line
              x1='27'
              y1='8'
              x2='27'
              y2='48'
              stroke={INK}
              strokeWidth='3'
              opacity='0.15'
            />
            <line
              x1='47'
              y1='8'
              x2='47'
              y2='48'
              stroke={INK}
              strokeWidth='3'
              opacity='0.15'
            />
          </g>
        ))}

        {/* Ground shadows stay put while their owners hop. */}
        <ellipse
          cx={BOMBA.x}
          cy={BOMBA.y + 40}
          rx='30'
          ry='8'
          fill='rgba(42,36,64,0.16)'
        />
        <ellipse
          cx={PIP.x}
          cy={PIP.y + 40}
          rx='30'
          ry='8'
          fill='rgba(42,36,64,0.16)'
        />
        <ellipse
          cx={BALLOON.x}
          cy={BALLOON.y + 34}
          rx='30'
          ry='8'
          fill='rgba(42,36,64,0.16)'
        />

        {/* Bomba first: row 100 sits behind the row-180 blast. */}
        <g transform={`translate(${BOMBA.x}, ${BOMBA.y}) scale(1.05)`}>
          <g className={styles.hopRight}>
            <Chibi kind='bomba' look={-1} />
          </g>
        </g>

        {/* The plus-shaped splash, hidden until the balloon pops; arms run
            along the balloon's grid row and column. */}
        <g
          className={styles.splash}
          transform={`translate(${BALLOON.x}, ${BALLOON.y})`}
        >
          <g className={styles.armH}>
            <rect
              x='-220'
              y='-23'
              width='440'
              height='46'
              rx='23'
              fill='#8fd0f9'
              stroke='#2f7fd6'
              strokeWidth='3'
            />
            <rect
              x='-206'
              y='-10'
              width='412'
              height='20'
              rx='10'
              fill='#d9f0ff'
            />
          </g>
          <g className={styles.armV}>
            <rect
              x='-23'
              y='-112'
              width='46'
              height='282'
              rx='23'
              fill='#8fd0f9'
              stroke='#2f7fd6'
              strokeWidth='3'
            />
            <rect
              x='-10'
              y='-98'
              width='20'
              height='254'
              rx='10'
              fill='#d9f0ff'
            />
          </g>
          <circle className={styles.splashCore} r='26' fill='#eef9ff' />
          {DROPS.map(({ x, y, r }) => (
            <circle
              key={`${x}-${y}`}
              className={styles.drop}
              style={
                {
                  '--dx': `${x}px`,
                  '--dy': `${y}px`
                } as CSSProperties
              }
              r={r}
              fill='#5db8f7'
            />
          ))}
        </g>

        {/* Water balloon (the bomb), holding the center tile. */}
        <g transform={`translate(${BALLOON.x}, ${BALLOON.y})`}>
          <g className={styles.balloon}>
            <ellipse rx='34' ry='36' fill={`url(#${id('balloon')})`} />
            <g clipPath={`url(#${id('bclip')})`}>
              {/* Water weight pooling at the bottom, as in the game. */}
              <ellipse
                cy='26.5'
                rx='32.3'
                ry='17'
                fill='rgba(24,58,110,0.22)'
              />
            </g>
            <ellipse rx='34' ry='36' fill='none' stroke={INK} strokeWidth='4' />
            <rect
              x='-4.5'
              y='-45.5'
              width='9'
              height='9'
              rx='3'
              fill='#2f7fd6'
              stroke={INK}
              strokeWidth='3'
            />
            <ellipse
              cx='-11.6'
              cy='-14.4'
              rx='6.8'
              ry='4.1'
              fill='rgba(255,255,255,0.8)'
              transform='rotate(-40 -11.6 -14.4)'
            />
            <ellipse
              cx='-17.7'
              cy='-4.1'
              rx='2.4'
              ry='1.5'
              fill='rgba(255,255,255,0.5)'
              transform='rotate(-40 -17.7 -4.1)'
            />
            {/* Danger blush as the fuse runs out. */}
            <ellipse
              className={styles.blush}
              rx='34'
              ry='36'
              fill='rgba(255,90,90,0.55)'
            />
          </g>
        </g>

        {/* Pip last: row 260 stands in front of the blast row. */}
        <g transform={`translate(${PIP.x}, ${PIP.y}) scale(1.05)`}>
          <g className={styles.hopLeft}>
            <Chibi kind='pip' look={1} />
          </g>
        </g>

        {/* Edge vignette settles the scene into the card. */}
        <rect width='640' height='360' fill={`url(#${id('vign')})`} />
      </svg>
    </div>
  )
}
