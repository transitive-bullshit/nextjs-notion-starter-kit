import styles from './BombermanCover.module.css'

/**
 * BombermanCover — "Board vignette" (gameplay).
 *
 *   A crop of the real board, faithful to the source: every cell is an
 *   emoji at ~94% of its tile exactly like the game renders (⬜ floor,
 *   🟩 grass, 🟫 walls, 😀/😎 players, 💣 bomb). Hover ticks the fuse
 *   the way GameCell.tsx does — the 💣 heats red through a filter ramp —
 *   then every blast tile blooms the game's actual explosion emoji, 🌸,
 *   with its 400ms scale-and-fade pop. The cast flinches.
 */

// 80px tile grid (the game uses 32px cells with 30px emoji — same ratio
// here: 74px emoji on 80px tiles). Columns center on 40..600, rows on
// 40..340; the bottom row runs off-card like a mid-board crop.
const TILE = 80
const EMOJI = 74
// Emoji <text> is anchored at the baseline; +0.36em recenters vertically.
const BASELINE = Math.round(EMOJI * 0.36)
const cx = (col: number) => col * TILE + TILE / 2
const cy = (row: number) => row * TILE + TILE / 2 + BASELINE

const GREENS = [
  [0, 0],
  [3, 0],
  [7, 1],
  [1, 2],
  [5, 3],
  [0, 4]
] as const
const BROWNS = [
  [6, 0],
  [2, 3],
  [7, 3],
  [1, 1]
] as const

// Bomb at (4,2); players share neither its row nor its column, so the
// range-1 plus-blast (center + 4 neighbors, as at game start) misses both.
const BOMB = { col: 4, row: 2 }
const BLAST = [
  [4, 2],
  [3, 2],
  [5, 2],
  [4, 1],
  [4, 3]
] as const
const P1 = { col: 1, row: 3 }
const P2 = { col: 6, row: 1 }

export function BombermanCover() {
  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox='0 0 640 360'
        preserveAspectRatio='xMidYMid meet'
      >
        {/* Floor: every cell is a ⬜, just like CELL_EMPTY in the game. */}
        {Array.from({ length: 5 }).flatMap((_, row) =>
          Array.from({ length: 8 }).map((_, col) => (
            <text
              key={`${col}-${row}`}
              className={styles.cell}
              x={cx(col)}
              y={cy(row)}
            >
              ⬜
            </text>
          ))
        )}

        {/* Blocks: 🟩 grass (destructible) and 🟫 walls, per the game. */}
        {GREENS.map(([col, row]) => (
          <text
            key={`g${col}-${row}`}
            className={styles.cell}
            x={cx(col)}
            y={cy(row)}
          >
            🟩
          </text>
        ))}
        {BROWNS.map(([col, row]) => (
          <text
            key={`b${col}-${row}`}
            className={styles.cell}
            x={cx(col)}
            y={cy(row)}
          >
            🟫
          </text>
        ))}

        {/* Cast */}
        <text
          className={`${styles.cell} ${styles.playerOne}`}
          x={cx(P1.col)}
          y={cy(P1.row)}
        >
          😀
        </text>
        <text
          className={`${styles.cell} ${styles.playerTwo}`}
          x={cx(P2.col)}
          y={cy(P2.row)}
        >
          😎
        </text>

        {/* The bomb, heating red as the fuse runs (the game's filter ramp). */}
        <text
          className={`${styles.cell} ${styles.bomb}`}
          x={cx(BOMB.col)}
          y={cy(BOMB.row)}
        >
          💣
        </text>

        {/* The blast: every affected tile blooms the game's 🌸. */}
        {BLAST.map(([col, row], i) => (
          <text
            key={`x${col}-${row}`}
            className={`${styles.cell} ${styles.bloom}`}
            style={{ animationDelay: `${i === 0 ? 0 : 0.06}s` }}
            x={cx(col)}
            y={cy(row)}
          >
            🌸
          </text>
        ))}
      </svg>
    </div>
  )
}
