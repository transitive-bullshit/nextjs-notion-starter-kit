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
// here: 74px emoji on 80px tiles). The board is deliberately much wider
// than any card: 24 columns (1920×360, 5.3:1) while the cover box ranges
// ~1.6:1 to ~4.7:1 (its height is pinned ~190px and only the width varies).
// With `slice`, the full height is therefore always visible and widening a
// card just reveals more board at the sides — the cast never gets cropped.
// The action lives in the center 8 columns (8–15); the wings carry only
// scenery blocks. The bottom row runs off-card like a mid-board crop.
const TILE = 80
const STAGE_W = 1920
// Tile centers sit at multiples of 80 (columns 0–24, the edge two half
// cropped like a mid-board slice) so column 12's center lands exactly on
// the stage's horizontal center (960) — otherwise 960 falls on a tile edge
// and the bomb can only ever sit ±40 off center, which reads as a
// mysterious lean at every crop width.
const COLS = 25
const EMOJI = 74
// Emoji <text> is anchored at the baseline; +0.36em recenters vertically.
const BASELINE = Math.round(EMOJI * 0.36)
const cx = (col: number) => col * TILE
const cy = (row: number) => row * TILE + TILE / 2 + BASELINE

// Blocks are mirrored about the bomb column (col ↔ 24−col, same row), like
// a competitive arena map — so every centered crop stays balanced.
const GREENS = [
  // center action
  [10, 0],
  [14, 0],
  [8, 2],
  [16, 2],
  [11, 4],
  [13, 4],
  // wings
  [5, 1],
  [19, 1],
  [2, 3],
  [22, 3],
  [1, 0],
  [23, 0]
] as const
const BROWNS = [
  // center action
  [9, 1],
  [15, 1],
  [12, 0],
  [12, 4],
  // wings
  [6, 0],
  [18, 0],
  [3, 2],
  [21, 2],
  [4, 4],
  [20, 4]
] as const

// Bomb dead center at (12,2); players flank it ±2 columns on diagonal
// tiles that share neither its row nor its column, so the range-1
// plus-blast (center + 4 neighbors, as at game start) misses both.
const BOMB = { col: 12, row: 2 }
const BLAST = [
  [12, 2],
  [11, 2],
  [13, 2],
  [12, 1],
  [12, 3]
] as const
const P1 = { col: 10, row: 3 }
const P2 = { col: 14, row: 1 }

export function BombermanCover() {
  return (
    <div className={styles.cover} aria-hidden='true'>
      {/* slice against an extra-wide board: the board's 5.3:1 outruns every
          real cover box (~1.6:1–4.7:1), so the full height always fits and
          widening a card just reveals more board at the sides. See the COLS
          comment above. */}
      <svg
        className={styles.svg}
        viewBox={`0 0 ${STAGE_W} 360`}
        preserveAspectRatio='xMidYMid slice'
      >
        {/* Floor: every cell is a ⬜, just like CELL_EMPTY in the game. */}
        {Array.from({ length: 5 }).flatMap((_, row) =>
          Array.from({ length: COLS }).map((_, col) => (
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
