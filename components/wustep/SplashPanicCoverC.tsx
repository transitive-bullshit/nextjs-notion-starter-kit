import { type CSSProperties, useId } from 'react'

import styles from './SplashPanicCoverC.module.css'

/**
 * SplashPanicCoverC — "Bubbled!" (signature-mechanic close-up). Unshipped
 * variant, kept for the covers-preview workbench.
 *
 *   The game's defining moment made huge: Splash the axolotl is trapped in
 *   a big glassy bubble drifting over an aqua field, with a needle token —
 *   the self-rescue item — waiting in the corner. The bubble bobs gently
 *   all the time (ambient); hovering pops it in a burst ring and droplet
 *   spray, drops Splash free with a little landing bounce, then re-forms
 *   the bubble for the next loop.
 */

const INK = '#2a2440'

// Axolotl gill fronds: three per side, angled like the game sprite.
const GILLS = [
  { dx: 30, dy: -22, deg: 28.6 },
  { dx: 32, dy: -10, deg: 8.6 },
  { dx: 34, dy: 2, deg: -11.5 }
]

function SplashAxolotl() {
  return (
    <g stroke={INK} strokeWidth='5' strokeLinejoin='round'>
      {GILLS.map(({ dx, dy, deg }) =>
        [-1, 1].map((side) => (
          <ellipse
            key={`${dx}-${side}`}
            cx={side * dx}
            cy={dy}
            rx='10'
            ry='5'
            fill='#ffa7c4'
            transform={`rotate(${side * deg} ${side * dx} ${dy})`}
          />
        ))
      )}
      <rect x='-22' y='26' width='16' height='14' rx='8' fill='#7ec8f2' />
      <rect x='6' y='26' width='16' height='14' rx='8' fill='#7ec8f2' />
      <path
        d='M0,-34 C26,-34 34,-14 34,4 C34,26 20,34 0,34 C-20,34 -34,26 -34,4 C-34,-14 -26,-34 0,-34 Z'
        fill='#7ec8f2'
      />
      <ellipse cx='0' cy='12' rx='18' ry='16' fill='#e3f5ff' stroke='none' />
      <g stroke='none'>
        <circle cx='-10' cy='-8' r='4.5' fill={INK} />
        <circle cx='10' cy='-8' r='4.5' fill={INK} />
        <circle cx='-8.5' cy='-9.5' r='1.6' fill='#fff' />
        <circle cx='11.5' cy='-9.5' r='1.6' fill='#fff' />
        <ellipse cx='-19' cy='0' rx='5' ry='3' fill='rgba(255,120,140,0.35)' />
        <ellipse cx='19' cy='0' rx='5' ry='3' fill='rgba(255,120,140,0.35)' />
      </g>
      <path
        d='M 4.45 4.27 A 5 5 0 0 1 -4.45 4.27'
        fill='none'
        strokeWidth='3'
        strokeLinecap='round'
      />
    </g>
  )
}

// Pop-spray droplets: fly vectors set inline as CSS vars.
const POP_DROPS: Array<{ x: number; y: number; r: number }> = [
  { x: 112, y: -74, r: 8 },
  { x: -118, y: -64, r: 7 },
  { x: 132, y: 33, r: 7 },
  { x: -127, y: 48, r: 8 },
  { x: 51, y: -132, r: 6 },
  { x: -56, y: -125, r: 6 },
  { x: 79, y: 112, r: 6 },
  { x: -74, y: 117, r: 6 }
]

// Ambient background bubbles: x position + size; timing staggers in CSS.
const RISERS = [
  { x: 66, y: 318, r: 8 },
  { x: 118, y: 346, r: 5.5 },
  { x: 556, y: 336, r: 9 },
  { x: 600, y: 296, r: 6 }
]

export function SplashPanicCoverC() {
  const uid = useId().replaceAll(':', '')
  const id = (name: string) => `spc-${name}-${uid}`

  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox='0 0 640 360'
        preserveAspectRatio='xMidYMid meet'
      >
        <defs>
          <linearGradient id={id('water')} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='#a6ebe4' />
            <stop offset='0.5' stopColor='#58cfc4' />
            <stop offset='1' stopColor='#2fb3a8' />
          </linearGradient>
          <radialGradient id={id('shell')} cx='0.4' cy='0.35' r='0.9'>
            <stop offset='0' stopColor='rgba(255,255,255,0.08)' />
            <stop offset='0.72' stopColor='rgba(158,232,227,0.22)' />
            <stop offset='1' stopColor='rgba(127,200,242,0.42)' />
          </radialGradient>
          <radialGradient id={id('vign')} cx='0.5' cy='0.42' r='0.75'>
            <stop offset='0.62' stopColor='rgba(38,168,158,0)' />
            <stop offset='1' stopColor='rgba(31,138,130,0.3)' />
          </radialGradient>
        </defs>

        <rect width='640' height='360' fill={`url(#${id('water')})`} />
        {/* Soft caustic glows */}
        <g fill='rgba(255,255,255,0.06)'>
          <circle cx='104' cy='58' r='90' />
          <circle cx='540' cy='84' r='72' />
          <circle cx='320' cy='338' r='100' />
        </g>

        {/* Ambient mini-bubbles drifting up the edges. */}
        {RISERS.map(({ x, y, r }) => (
          <circle
            key={x}
            className={styles.riser}
            cx={x}
            cy={y}
            r={r}
            fill='rgba(255,255,255,0.14)'
            stroke='rgba(255,255,255,0.75)'
            strokeWidth='2'
          />
        ))}

        {/* Needle token — the self-rescue hint. */}
        <g transform='translate(556, 282) rotate(8)'>
          <rect
            x='-33'
            y='-33'
            width='66'
            height='66'
            rx='14'
            fill='#fff'
            stroke={INK}
            strokeWidth='4.5'
          />
          <path
            d='M-16,16 L14,-14'
            stroke='#b8a7e9'
            strokeWidth='6'
            strokeLinecap='round'
          />
          <circle
            cx='17'
            cy='-17'
            r='5'
            fill='none'
            stroke='#b8a7e9'
            strokeWidth='3.5'
          />
          <path
            d='M20,-12 q10,5 5,15 q-4,9 -14,6'
            fill='none'
            stroke='#3fd2c7'
            strokeWidth='3'
            strokeLinecap='round'
          />
        </g>

        {/* The trap. Ambient bob wraps the whole moment; the pop pieces
            animate inside it so both motions compose. */}
        <g transform='translate(316, 172)'>
          <g className={styles.bobGroup}>
            {/* Trapped Splash: base pose tilted and sunk a little; the hover
                drop animates deltas from identity so it lands upright. The
                1.6 scale makes this the close-up the concept promises. */}
            <g transform='translate(0, 14) scale(1.6) rotate(-5)'>
              <g className={styles.buddy}>
                <SplashAxolotl />
              </g>
            </g>

            <g className={styles.bubbleShell}>
              <circle r='118' fill={`url(#${id('shell')})`} />
              <circle
                r='118'
                fill='none'
                stroke={INK}
                strokeWidth='3.5'
                strokeDasharray='18 13'
                opacity='0.8'
              />
              <path
                d='M -82 -61 A 100 100 0 0 1 -18 -97'
                fill='none'
                stroke='rgba(255,255,255,0.9)'
                strokeWidth='7'
                strokeLinecap='round'
              />
              <path
                d='M 51 97 A 100 100 0 0 0 92 54'
                fill='none'
                stroke='rgba(255,167,196,0.6)'
                strokeWidth='5'
                strokeLinecap='round'
              />
            </g>

            <circle
              className={styles.burstRing}
              r='118'
              fill='none'
              stroke='#fff'
              strokeWidth='6'
            />
            {POP_DROPS.map(({ x, y, r }) => (
              <circle
                key={`${x}-${y}`}
                className={styles.popDrop}
                style={
                  {
                    '--dx': `${x}px`,
                    '--dy': `${y}px`
                  } as CSSProperties
                }
                r={r}
                fill='#dff6ff'
                stroke='#5db8f7'
                strokeWidth='2'
              />
            ))}
          </g>
        </g>

        {/* Edge vignette keeps the close-up framed at wide card sizes. */}
        <rect width='640' height='360' fill={`url(#${id('vign')})`} />
      </svg>
    </div>
  )
}
