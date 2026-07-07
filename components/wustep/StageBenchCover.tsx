import { type CSSProperties, useId } from 'react'

import styles from './StageBenchCover.module.css'

/**
 * StageBenchCover
 *
 *   Cover for the StageBench playground entry — a miniature of the site's
 *   red Nord-style toy keyboard (pitch stick, mod wheel, benchmark LEDs,
 *   program screen, phase knobs, keybed). Drawn as one fixed-viewBox SVG so
 *   it scales as a single piece at any card size; the maroon stage behind it
 *   absorbs the varying cover aspect ratio. Hovering the card "starts a
 *   run": the keys arpeggiate, ACTIVE ticks 00 → 01, the program screen
 *   flips to RUNNING, the status LED blinks, and the first phase knob
 *   sweeps.
 */

// 22 white keys; a black key sits on the right edge of white indices
// matching the C-major octave pattern (none after E = 2 or B = 6).
const WHITE_KEYS = 22
const BLACK_AFTER = new Set([0, 1, 3, 4, 5])

// White keys pressed during the hover arpeggio → stagger order.
const PRESSED_ORDER = new Map([
  [6, 0],
  [9, 1],
  [12, 2],
  [15, 3]
])

// Keybed geometry in viewBox units.
const KEYS_X = 13
const KEYS_W = 614
const KEYS_Y = 109.5
const WHITE_H = 81
const BLACK_H = 47

// Phase knobs: resting pointer angles; the first sweeps during a run.
const KNOBS = [
  { cx: 470, deg: -50, live: true },
  { cx: 531, deg: 0, live: false },
  { cx: 592, deg: 55, live: false }
]
const KNOB_CY = 54
const KNOB_R = 13

export function StageBenchCover() {
  // Gradient/clip ids must be unique per instance (and colon-free so they
  // stay valid inside url(#…) references).
  const uid = useId().replaceAll(':', '')
  const id = (name: string) => `sb-${name}-${uid}`

  const whiteW = KEYS_W / WHITE_KEYS
  const blackW = whiteW * 0.6

  const blackKeys: number[] = []
  for (let i = 0; i < WHITE_KEYS - 1; i++) {
    if (BLACK_AFTER.has(i % 7)) blackKeys.push(i)
  }

  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox='0 0 640 200'
        preserveAspectRatio='xMidYMid meet'
      >
        <defs>
          <clipPath id={id('clip')}>
            <rect x='6' y='6' width='628' height='188' rx='10' />
          </clipPath>
          <linearGradient id={id('body')} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='#cf2a3a' />
            <stop offset='0.55' stopColor='#ab1626' />
            <stop offset='1' stopColor='#8c0f1e' />
          </linearGradient>
          <linearGradient id={id('slate')} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='#7a8191' />
            <stop offset='0.25' stopColor='#4d5260' />
            <stop offset='1' stopColor='#3b404c' />
          </linearGradient>
          <linearGradient id={id('screen')} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='#05070c' />
            <stop offset='1' stopColor='#0e1118' />
          </linearGradient>
          <linearGradient id={id('wood')} x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0' stopColor='#ecbc66' />
            <stop offset='1' stopColor='#c98a2e' />
          </linearGradient>
          <linearGradient id={id('modw')} x1='0' y1='0' x2='1' y2='0'>
            <stop offset='0' stopColor='#141010' />
            <stop offset='0.45' stopColor='#4c4543' />
            <stop offset='1' stopColor='#16100f' />
          </linearGradient>
          <linearGradient id={id('wkey')} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='#f1eee8' />
            <stop offset='0.78' stopColor='#fbfaf7' />
            <stop offset='1' stopColor='#e3ded6' />
          </linearGradient>
          <linearGradient id={id('bkey')} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='#3a3733' />
            <stop offset='0.7' stopColor='#211d1a' />
            <stop offset='1' stopColor='#191512' />
          </linearGradient>
          <linearGradient id={id('kshade')} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='rgba(0,0,0,0.55)' />
            <stop offset='1' stopColor='rgba(0,0,0,0)' />
          </linearGradient>
          <linearGradient id={id('press')} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='#f0b3a8' />
            <stop offset='1' stopColor='#f7d8d1' />
          </linearGradient>
          <radialGradient id={id('knob')} cx='0.32' cy='0.26' r='0.85'>
            <stop offset='0' stopColor='#5f6575' />
            <stop offset='0.75' stopColor='#2b2f39' />
            <stop offset='1' stopColor='#242832' />
          </radialGradient>
        </defs>

        <g clipPath={`url(#${id('clip')})`}>
          {/* Body */}
          <rect
            x='6'
            y='6'
            width='628'
            height='188'
            rx='10'
            fill={`url(#${id('body')})`}
          />
          <line
            x1='16'
            y1='7.25'
            x2='624'
            y2='7.25'
            stroke='rgba(255,255,255,0.28)'
            strokeWidth='1.5'
            strokeLinecap='round'
          />

          {/* Keybed frame + felt */}
          <rect x='6' y='102' width='628' height='92' fill='#1a1014' />
          <rect x={KEYS_X} y='105.5' width={KEYS_W} height='4' fill='#8c1626' />

          {/* White keys */}
          {Array.from({ length: WHITE_KEYS }).map((_, i) => (
            <rect
              key={i}
              x={KEYS_X + i * whiteW + 0.6}
              y={KEYS_Y}
              width={whiteW - 1.2}
              height={WHITE_H}
              rx='2'
              fill={`url(#${id('wkey')})`}
            />
          ))}

          {/* Shadow cast by the panel lip onto the keys */}
          <rect
            x={KEYS_X}
            y={KEYS_Y}
            width={KEYS_W}
            height='7'
            fill={`url(#${id('kshade')})`}
            opacity='0.3'
          />

          {/* Arpeggio press overlays — staggered delays walk the run up the
              keybed while the LEDs/screen show it running. */}
          {[...PRESSED_ORDER].map(([i, order]) => (
            <rect
              key={i}
              className={styles.pressGlow}
              style={{ animationDelay: `${order * 0.14}s` }}
              x={KEYS_X + i * whiteW + 0.6}
              y={KEYS_Y}
              width={whiteW - 1.2}
              height={WHITE_H}
              rx='2'
              fill={`url(#${id('press')})`}
            />
          ))}

          {/* Black keys */}
          {blackKeys.map((offset) => (
            <rect
              key={offset}
              x={KEYS_X + (offset + 1) * whiteW - blackW / 2}
              y={KEYS_Y}
              width={blackW}
              height={BLACK_H}
              rx='2.5'
              fill={`url(#${id('bkey')})`}
              stroke='#000'
              strokeWidth='0.75'
            />
          ))}

          {/* Cheek screws */}
          {[9.5, 630.5].map((cx) => (
            <circle
              key={cx}
              cx={cx}
              cy='150'
              r='1.8'
              fill='#0d0709'
              stroke='rgba(255,255,255,0.15)'
              strokeWidth='0.5'
            />
          ))}

          {/* Performance block: pitch stick, mod wheel, octave buttons */}
          <rect
            x='22'
            y='17'
            width='25'
            height='14'
            rx='5'
            fill={`url(#${id('wood')})`}
            stroke='#221317'
            strokeWidth='2.5'
            transform='rotate(-8 34.5 24)'
          />
          <rect
            x='57'
            y='14'
            width='9.5'
            height='29'
            rx='4.75'
            fill={`url(#${id('modw')})`}
          />
          <rect
            x='75'
            y='17'
            width='13'
            height='11'
            rx='3'
            fill='#2a2126'
            stroke='rgba(255,255,255,0.12)'
            strokeWidth='0.75'
          />
          <rect
            x='91'
            y='17'
            width='13'
            height='11'
            rx='3'
            fill='#2a2126'
            stroke='rgba(255,255,255,0.12)'
            strokeWidth='0.75'
          />
          <line
            x1='78.5'
            y1='22.5'
            x2='84.5'
            y2='22.5'
            stroke='#d9c9cc'
            strokeWidth='1.4'
            strokeLinecap='round'
          />
          <line
            x1='94.5'
            y1='22.5'
            x2='100.5'
            y2='22.5'
            stroke='#d9c9cc'
            strokeWidth='1.4'
            strokeLinecap='round'
          />
          <line
            x1='97.5'
            y1='19.5'
            x2='97.5'
            y2='25.5'
            stroke='#d9c9cc'
            strokeWidth='1.4'
            strokeLinecap='round'
          />
          <circle cx='78' cy='33.5' r='1.3' fill='#46e08a' />
          <circle cx='84' cy='33.5' r='1.3' fill='#23301f' />

          {/* Wordmark */}
          <text className={styles.brandText} x='20' y='79'>
            stagebench
          </text>
          <text className={styles.brandSubText} x='20' y='90'>
            TOY ACTION 48
          </text>

          {/* Benchmark module */}
          <rect
            x='128'
            y='14'
            width='124'
            height='82'
            rx='6'
            fill={`url(#${id('slate')})`}
          />
          <text className={styles.labelText} x='136' y='26.5'>
            BENCHMARK
          </text>
          {[
            { x: 136, label: 'RUNS' },
            { x: 193, label: 'ACTIVE' }
          ].map(({ x, label }) => (
            <g key={label}>
              <rect
                x={x}
                y='33'
                width='51'
                height='53'
                rx='4'
                fill='#190406'
                stroke='rgba(0,0,0,0.55)'
              />
              <text className={styles.ledLabelText} x={x + 25.5} y='47'>
                {label}
              </text>
            </g>
          ))}
          <text className={styles.ledDigitsText} x='161.5' y='75'>
            05
          </text>
          <text
            className={`${styles.ledDigitsText} ${styles.swapIdle}`}
            x='218.5'
            y='75'
          >
            00
          </text>
          <text
            className={`${styles.ledDigitsText} ${styles.swapRun}`}
            x='218.5'
            y='75'
          >
            01
          </text>

          {/* Program module */}
          <rect
            x='262'
            y='14'
            width='168'
            height='82'
            rx='6'
            fill={`url(#${id('slate')})`}
          />
          <text className={styles.labelText} x='270' y='26.5'>
            PROGRAM
          </text>
          <circle cx='420' cy='23.5' r='3' fill='#4a0b10' />
          <circle
            className={styles.dotGlow}
            cx='420'
            cy='23.5'
            r='3'
            fill='#ff3b30'
          />
          <rect
            x='270'
            y='33'
            width='152'
            height='53'
            rx='4'
            fill={`url(#${id('screen')})`}
            stroke='rgba(0,0,0,0.6)'
          />
          <polygon
            points='276,33 296,33 282,86 270,86 270,44'
            fill='#fff'
            opacity='0.04'
          />
          <text className={styles.screenSmallText} x='279' y='51'>
            SYSTEM READY
          </text>
          <text
            className={`${styles.screenMainText} ${styles.swapIdle}`}
            x='279'
            y='70'
          >
            SELECT MODEL
          </text>
          <text
            className={`${styles.screenMainText} ${styles.swapRun}`}
            x='279'
            y='70'
          >
            RUNNING 01_
          </text>

          {/* Phases module */}
          <rect
            x='440'
            y='14'
            width='182'
            height='82'
            rx='6'
            fill={`url(#${id('slate')})`}
          />
          <text className={styles.labelText} x='448' y='26.5'>
            PHASES
          </text>
          {KNOBS.map(({ cx, deg, live }, i) => (
            <g key={cx}>
              <circle
                cx={cx}
                cy={KNOB_CY}
                r={KNOB_R}
                fill={`url(#${id('knob')})`}
                stroke='rgba(0,0,0,0.35)'
              />
              <line
                className={live ? styles.knobLive : undefined}
                style={
                  live
                    ? ({
                        transformBox: 'view-box',
                        transformOrigin: `${cx}px ${KNOB_CY}px`
                      } as CSSProperties)
                    : undefined
                }
                x1={cx}
                y1={KNOB_CY - 4.5}
                x2={cx}
                y2={KNOB_CY - 11}
                stroke='#eaecf0'
                strokeWidth='2.2'
                strokeLinecap='round'
                transform={`rotate(${deg} ${cx} ${KNOB_CY})`}
              />
              <text className={styles.knobLabelText} x={cx} y='83'>
                {`0${i + 1}`}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}
