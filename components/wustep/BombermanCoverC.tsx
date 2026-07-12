import styles from './BombermanCoverC.module.css'

/**
 * BombermanCoverC — "The prompt file" (terminal poster). Unshipped variant,
 * kept for the covers-preview workbench.
 *
 *   A dark editor window holding the whole story in eight lines: comment
 *   header crediting the vibe-coding exploration, emoji literals for the
 *   cast and pyro, and an explode() call with the caret parked at the end.
 *   Hover "runs" it — the caret blinks, the emoji literals light up in
 *   sequence, and a 💥 pops beside the explode call.
 */

const MODEL = 'Claude 3.5 Sonnet'

type Token = { text: string; kind: 'kw' | 'str' | 'plain' | 'comment' }
type Line = { tokens: Token[]; glow?: boolean }

const LINES: Line[] = [
  { tokens: [{ text: '// an exploration in vibe coding', kind: 'comment' }] },
  { tokens: [{ text: `// with ${MODEL}`, kind: 'comment' }] },
  { tokens: [] },
  {
    tokens: [
      { text: 'const', kind: 'kw' },
      { text: ' PLAYERS = [', kind: 'plain' },
      { text: "'😀'", kind: 'str' },
      { text: ', ', kind: 'plain' },
      { text: "'😎'", kind: 'str' },
      { text: ']', kind: 'plain' }
    ],
    glow: true
  },
  {
    tokens: [
      { text: 'const', kind: 'kw' },
      { text: ' BOMB = ', kind: 'plain' },
      { text: "'💣'", kind: 'str' }
    ],
    glow: true
  },
  {
    tokens: [
      { text: 'const', kind: 'kw' },
      { text: ' BOOM = [', kind: 'plain' },
      { text: "'💥'", kind: 'str' },
      { text: ', ', kind: 'plain' },
      { text: "'🔥'", kind: 'str' },
      { text: ']', kind: 'plain' }
    ],
    glow: true
  },
  { tokens: [] },
  {
    tokens: [
      { text: 'arena', kind: 'plain' },
      { text: '.explode(bomb, ', kind: 'plain' },
      { text: "'+'", kind: 'str' },
      { text: ')', kind: 'plain' }
    ]
  }
]

const LINE_H = 27
const CODE_X = 64
const CODE_Y = 116

const FILL: Record<Token['kind'], string> = {
  kw: '#7dd3fc',
  str: '#86efac',
  plain: '#e2e8f0',
  comment: '#64748b'
}

export function BombermanCoverC() {
  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox='0 0 640 360'
        preserveAspectRatio='xMidYMid meet'
      >
        {/* Editor window */}
        <g className={styles.window}>
          <rect
            x='28'
            y='30'
            width='584'
            height='300'
            rx='12'
            fill='#1c2536'
            stroke='#334155'
            strokeWidth='1.5'
          />
          <rect x='28' y='30' width='584' height='38' rx='12' fill='#16202f' />
          <rect x='28' y='56' width='584' height='12' fill='#16202f' />
          <circle cx='52' cy='49' r='6' fill='#f87171' />
          <circle cx='72' cy='49' r='6' fill='#fbbf24' />
          <circle cx='92' cy='49' r='6' fill='#34d399' />
          <text className={styles.tabText} x='120' y='54'>
            bomberman.tsx
          </text>
          <text className={styles.tabDim} x='248' y='54'>
            — half a day, one prompt at a time
          </text>

          {/* Line numbers + code */}
          {LINES.map((line, i) => (
            <g key={i}>
              <text className={styles.lineNo} x='46' y={CODE_Y + i * LINE_H}>
                {i + 1}
              </text>
              <text
                className={line.glow ? styles.glowLine : undefined}
                x={CODE_X}
                y={CODE_Y + i * LINE_H}
                style={
                  line.glow
                    ? { animationDelay: `${0.3 + i * 0.22}s` }
                    : undefined
                }
              >
                {line.tokens.map((token, j) => (
                  <tspan
                    key={j}
                    className={styles.code}
                    fill={FILL[token.kind]}
                  >
                    {token.text}
                  </tspan>
                ))}
              </text>
            </g>
          ))}

          {/* Caret parked after the explode() call. */}
          <rect
            className={styles.caret}
            x='268'
            y={CODE_Y + 7 * LINE_H - 15}
            width='9'
            height='20'
            rx='1.5'
            fill='#7dd3fc'
          />

          {/* The output: a burst beside the call, on the hover beat. */}
          <text className={styles.boom} x='330' y={CODE_Y + 7 * LINE_H + 8}>
            💥
          </text>
        </g>
      </svg>
    </div>
  )
}
