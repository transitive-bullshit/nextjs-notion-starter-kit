import { useId } from 'react'

import styles from './SplashPanicCoverB.module.css'

/**
 * SplashPanicCoverB — "Poster" (brand treatment). Unshipped variant, kept
 * for the covers-preview workbench.
 *
 *   The game's OG-image energy as a cover: cream backdrop with the diamond
 *   dot grid, the chunky coral SPLASH PANIC! wordmark with ink outline and
 *   aqua drop shadow, pastel corner circles, a floating water balloon, and
 *   Pip trapped in a trademark dashed bubble. Hover wakes the poster up —
 *   the wordmark does the app's title wiggle, the balloon sways, the bubble
 *   bobs, and droplet sparkles twinkle. Palette is the game's token set
 *   (ink/cream/coral/aqua/lemon/lilac/mint/sky).
 */

const INK = '#2a2440'

// Mini Pip for the bubble — same squeeze-toy anatomy as the game sprites,
// stripped to what stays readable at half scale.
function MiniPip() {
  return (
    <g stroke={INK} strokeWidth='5' strokeLinejoin='round'>
      {[-1, 1].map((side) => (
        <g key={side} transform={`rotate(${side * 8.6} ${side * 14} -46)`}>
          <ellipse cx={side * 14} cy='-46' rx='8' ry='20' fill='#86e7b8' />
          <ellipse
            cx={side * 14}
            cy='-44'
            rx='4'
            ry='12'
            fill='#eafff3'
            stroke='none'
          />
        </g>
      ))}
      <rect x='-22' y='26' width='16' height='14' rx='8' fill='#86e7b8' />
      <rect x='6' y='26' width='16' height='14' rx='8' fill='#86e7b8' />
      <path
        d='M0,-34 C26,-34 34,-14 34,4 C34,26 20,34 0,34 C-20,34 -34,26 -34,4 C-34,-14 -26,-34 0,-34 Z'
        fill='#86e7b8'
      />
      <ellipse cx='0' cy='12' rx='18' ry='16' fill='#eafff3' stroke='none' />
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

export function SplashPanicCoverB() {
  const uid = useId().replaceAll(':', '')
  const id = (name: string) => `spb-${name}-${uid}`

  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox='0 0 640 360'
        preserveAspectRatio='xMidYMid meet'
      >
        <defs>
          <pattern
            id={id('dots')}
            width='40'
            height='40'
            patternUnits='userSpaceOnUse'
          >
            <rect
              x='18'
              y='18'
              width='4.5'
              height='4.5'
              fill='#eadec8'
              transform='rotate(45 20.25 20.25)'
            />
          </pattern>
          <radialGradient id={id('balloon')} cx='0.35' cy='0.32' r='0.85'>
            <stop offset='0' stopColor='#bfe9ff' />
            <stop offset='0.55' stopColor='#5db8f7' />
            <stop offset='1' stopColor='#2f7fd6' />
          </radialGradient>
          <radialGradient id={id('bubble')} cx='0.4' cy='0.35' r='0.9'>
            <stop offset='0' stopColor='rgba(255,255,255,0.1)' />
            <stop offset='0.7' stopColor='rgba(158,232,227,0.2)' />
            <stop offset='1' stopColor='rgba(127,200,242,0.4)' />
          </radialGradient>
        </defs>

        <rect width='640' height='360' fill='#fff6e9' />
        <rect width='640' height='360' fill={`url(#${id('dots')})`} />

        {/* Pastel confetti circles pinned to the corners, like the OG image. */}
        <g stroke={INK} strokeWidth='5'>
          <circle cx='-10' cy='44' r='56' fill='#7ec8f2' />
          <circle cx='622' cy='36' r='46' fill='#ffd766' />
          <circle cx='650' cy='332' r='54' fill='#86e7b8' />
          <circle cx='18' cy='342' r='42' fill='#b8a7e9' />
        </g>

        {/* Wordmark: aqua shadow pass under the coral pass, both ink-outlined
            via paint-order so the letterforms stay chunky. */}
        <g className={styles.wordmark}>
          <text
            className={`${styles.title} ${styles.titleShadow}`}
            x='325'
            y='162'
          >
            SPLASH PANIC!
          </text>
          <text className={styles.title} x='320' y='155'>
            SPLASH PANIC!
          </text>
        </g>

        <text className={styles.tagline} x='320' y='205'>
          Trap your friends in bubbles. Rule the puddle.
        </text>

        {/* One pill badge keeps the poster airy; three would crowd 360px. */}
        <g transform='translate(320, 253)'>
          <rect
            x='-160'
            y='-20'
            width='320'
            height='40'
            rx='20'
            fill='#fff'
            stroke={INK}
            strokeWidth='4'
          />
          <text className={styles.pillText} y='6'>
            💦 2–8 player water-balloon chaos
          </text>
        </g>

        {/* Droplet sparkles that twinkle on hover. */}
        <g fill='#3fd2c7'>
          <path
            className={styles.sparkle}
            d='M150,96 C153,100 155,103 155,106 A5.5,5.5 0 1 1 144,106 C144,103 147,100 150,96 Z'
          />
          <path
            className={`${styles.sparkle} ${styles.sparkleLate}`}
            d='M496,84 C499,88 501,91 501,94 A5.5,5.5 0 1 1 490,94 C490,91 493,88 496,84 Z'
          />
        </g>

        {/* Floating water balloon, tilted mid-drift. */}
        <g transform='translate(92, 268)'>
          <g className={styles.balloonFloat}>
            <g transform='rotate(-9)'>
              <ellipse rx='26' ry='27.6' fill={`url(#${id('balloon')})`} />
              <ellipse
                rx='26'
                ry='27.6'
                fill='none'
                stroke={INK}
                strokeWidth='4'
              />
              <rect
                x='-4'
                y='-35.2'
                width='8'
                height='8'
                rx='3'
                fill='#2f7fd6'
                stroke={INK}
                strokeWidth='3'
              />
              <ellipse
                cx='-8.8'
                cy='-11'
                rx='5.2'
                ry='3.1'
                fill='rgba(255,255,255,0.8)'
                transform='rotate(-40 -8.8 -11)'
              />
            </g>
          </g>
        </g>

        {/* Pip bubbled up in the corner — the dashed ring is the game's
            trap-bubble stroke. */}
        <g transform='translate(552, 262)'>
          <g className={styles.bubbleBob}>
            <g transform='translate(0, 6) rotate(8) scale(0.52)'>
              <MiniPip />
            </g>
            <circle r='42' fill={`url(#${id('bubble')})`} />
            <circle
              r='42'
              fill='none'
              stroke={INK}
              strokeWidth='3.5'
              strokeDasharray='10 8'
              opacity='0.85'
            />
            <path
              d='M -30 -22 A 37 37 0 0 1 -6 -36'
              fill='none'
              stroke='rgba(255,255,255,0.95)'
              strokeWidth='5'
              strokeLinecap='round'
            />
          </g>
        </g>
      </svg>
    </div>
  )
}
