import styles from './BombermanCoverA.module.css'

/**
 * BombermanCoverA — "Prompt → game" (vibe-coding meta). Unshipped variant,
 * kept for the covers-preview workbench.
 *
 *   The making-of as the cover: a chat card on the left holds the actual
 *   ask ("build me bomberman, but with emojis 💣") with Claude Sonnet
 *   mid-reply, and the emoji arena it produced materializes on the right.
 *   Hover runs the exchange — typing dots bounce, the bomb wobbles, and
 *   the board answers with a plus-shaped 💥. Board styling mirrors the
 *   real build: flat light tiles, glossy green/brown blocks, emoji cast.
 */

// One label constant so the model credit is a single-point edit.
const MODEL = 'Claude 3.5 Sonnet'

// Arena grid: 6×5 tiles of 46px inside the right panel.
const TILE = 46
const GRID_X = 322
const GRID_Y = 62
const GREENS = [
  [0, 0],
  [3, 0],
  [5, 2],
  [1, 4],
  [4, 3]
] as const
const BROWNS = [
  [2, 0],
  [0, 2],
  [5, 4],
  [3, 4]
] as const

const tileX = (col: number) => GRID_X + col * TILE
const tileY = (row: number) => GRID_Y + row * TILE

export function BombermanCoverA() {
  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox='0 0 640 360'
        preserveAspectRatio='xMidYMid meet'
      >
        {/* Chat card */}
        <g className={styles.chatCard}>
          <rect
            x='26'
            y='44'
            width='262'
            height='272'
            rx='16'
            fill='#ffffff'
            stroke='#dbe2ea'
            strokeWidth='2'
          />
          {/* User bubble */}
          <rect x='66' y='66' width='204' height='64' rx='14' fill='#dbeafe' />
          <text className={styles.bubbleText} x='82' y='92'>
            build me bomberman,
          </text>
          <text className={styles.bubbleText} x='82' y='114'>
            but with emojis 💣
          </text>
          {/* Assistant row */}
          <circle cx='60' cy='170' r='13' fill='#d97757' />
          <text className={styles.avatarMark} x='60' y='175'>
            ✳
          </text>
          <text className={styles.modelName} x='82' y='175'>
            {MODEL}
          </text>
          {/* Reply bubble with typing dots */}
          <rect x='44' y='190' width='120' height='40' rx='14' fill='#eef2f7' />
          {[70, 96, 122].map((cx, i) => (
            <circle
              key={cx}
              className={styles.typingDot}
              style={{ animationDelay: `${i * 0.18}s` }}
              cx={cx}
              cy='210'
              r='5'
              fill='#94a3b8'
            />
          ))}
          {/* Tool-call shimmer line, because half a day of vibe coding is
              mostly watching edits stream by. */}
          <rect x='44' y='246' width='176' height='12' rx='6' fill='#eef2f7' />
          <rect
            className={styles.shimmer}
            x='44'
            y='246'
            width='60'
            height='12'
            rx='6'
            fill='#dde5ee'
          />
          <rect x='44' y='268' width='132' height='12' rx='6' fill='#eef2f7' />
        </g>

        {/* Hand-off arrow */}
        <path
          className={styles.arrow}
          d='M292 180 h18'
          stroke='#94a3b8'
          strokeWidth='3'
          strokeDasharray='6 6'
          fill='none'
        />
        <path d='M310 173 l10 7 -10 7 z' fill='#94a3b8' />

        {/* Arena panel */}
        <rect
          x='306'
          y='40'
          width='310'
          height='280'
          rx='14'
          fill='#f8fafc'
          stroke='#dbe2ea'
          strokeWidth='2'
        />
        {/* Floor tiles */}
        {Array.from({ length: 5 }).flatMap((_, row) =>
          Array.from({ length: 6 }).map((_, col) => (
            <rect
              key={`${col}-${row}`}
              x={tileX(col) + 2}
              y={tileY(row) + 2}
              width={TILE - 4}
              height={TILE - 4}
              rx='6'
              fill='#e9edf2'
            />
          ))
        )}
        {/* Blocks: glossy green bushes + brown crates, grid-true. */}
        {GREENS.map(([col, row]) => (
          <g key={`g${col}-${row}`}>
            <rect
              x={tileX(col) + 3}
              y={tileY(row) + 3}
              width={TILE - 6}
              height={TILE - 6}
              rx='7'
              fill='#2fbd4e'
            />
            <rect
              x={tileX(col) + 6}
              y={tileY(row) + 6}
              width={TILE - 12}
              height='14'
              rx='6'
              fill='rgba(255,255,255,0.35)'
            />
          </g>
        ))}
        {BROWNS.map(([col, row]) => (
          <g key={`b${col}-${row}`}>
            <rect
              x={tileX(col) + 3}
              y={tileY(row) + 3}
              width={TILE - 6}
              height={TILE - 6}
              rx='7'
              fill='#9a6b38'
            />
            <rect
              x={tileX(col) + 6}
              y={tileY(row) + 6}
              width={TILE - 12}
              height='14'
              rx='6'
              fill='rgba(255,255,255,0.28)'
            />
          </g>
        ))}

        {/* Cast + bomb on safe diagonals (players share neither the bomb's
            row nor its column). */}
        <text
          className={`${styles.emoji} ${styles.playerOne}`}
          x={tileX(1) + TILE / 2}
          y={tileY(3) + TILE / 2 + 12}
        >
          😀
        </text>
        <text
          className={`${styles.emoji} ${styles.playerTwo}`}
          x={tileX(4) + TILE / 2}
          y={tileY(1) + TILE / 2 + 12}
        >
          😎
        </text>
        <text
          className={`${styles.emoji} ${styles.bomb}`}
          x={tileX(2) + TILE / 2}
          y={tileY(2) + TILE / 2 + 12}
        >
          💣
        </text>
        {/* Plus-shaped burst, hidden until the hover beat. */}
        <text
          className={`${styles.emoji} ${styles.boom}`}
          x={tileX(2) + TILE / 2}
          y={tileY(2) + TILE / 2 + 14}
        >
          💥
        </text>
        {(
          [
            [1, 2],
            [3, 2],
            [2, 1],
            [2, 3]
          ] as const
        ).map(([col, row], i) => (
          <text
            key={`f${col}-${row}`}
            className={`${styles.emoji} ${styles.flame}`}
            style={{ animationDelay: `${0.05 + i * 0.04}s` }}
            x={tileX(col) + TILE / 2}
            y={tileY(row) + TILE / 2 + 11}
          >
            🔥
          </text>
        ))}
      </svg>
    </div>
  )
}
