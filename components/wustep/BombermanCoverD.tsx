import styles from './BombermanCoverD.module.css'

/**
 * BombermanCoverD — "The bomb" (mechanic close-up). Unshipped variant,
 * kept for the covers-preview workbench.
 *
 *   One giant 💣 on deep navy, orbited by the game's power-up tokens and a
 *   loyal pet, with a quiet pill crediting the vibe-coding exploration.
 *   Hover lights the fuse: the bomb shivers and swells, then swaps into a
 *   full-frame 💥 with a shockwave ring (the StageBench idle/run swap
 *   technique, applied to emoji).
 */

const MODEL = 'Claude 3.5 Sonnet'

// Power-up tokens (white chips, like the game's item drops) + the pet.
const TOKENS = [
  { x: 118, y: 96, emoji: '⚡', delay: 0 },
  { x: 536, y: 128, emoji: '👟', delay: 0.6 },
  { x: 152, y: 254, emoji: '💣', delay: 1.1 },
  { x: 512, y: 262, emoji: '🐶', delay: 1.7 }
]

export function BombermanCoverD() {
  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox='0 0 640 360'
        preserveAspectRatio='xMidYMid meet'
      >
        {/* Soft spotlight behind the bomb. */}
        <circle cx='320' cy='176' r='150' fill='rgba(125,211,252,0.07)' />
        <circle cx='320' cy='176' r='96' fill='rgba(125,211,252,0.07)' />

        {/* Power-up tokens drift on their own lazy beats. */}
        {TOKENS.map(({ x, y, emoji, delay }) => (
          <g
            key={emoji}
            className={styles.token}
            style={{ animationDelay: `${delay}s` }}
          >
            <rect
              x={x - 27}
              y={y - 27}
              width='54'
              height='54'
              rx='13'
              fill='rgba(248,250,252,0.94)'
            />
            <text className={styles.tokenEmoji} x={x} y={y + 9}>
              {emoji}
            </text>
          </g>
        ))}

        {/* The bomb / the boom: two stacked emoji, opacity-swapped by the
            shared loop so the pop reads as a hard cut, LED-style. */}
        <circle
          className={styles.shockwave}
          cx='320'
          cy='176'
          r='90'
          fill='none'
          stroke='rgba(251,191,36,0.9)'
          strokeWidth='7'
        />
        <text className={`${styles.hero} ${styles.bomb}`} x='320' y='232'>
          💣
        </text>
        <text className={`${styles.hero} ${styles.boom}`} x='320' y='236'>
          💥
        </text>

        {/* Credit pill. */}
        <g>
          <rect
            x='155'
            y='312'
            width='330'
            height='32'
            rx='16'
            fill='rgba(148,163,184,0.14)'
            stroke='rgba(148,163,184,0.35)'
            strokeWidth='1.5'
          />
          <text className={styles.pillText} x='320' y='333'>
            an exploration in vibe coding · {MODEL}
          </text>
        </g>
      </svg>
    </div>
  )
}
