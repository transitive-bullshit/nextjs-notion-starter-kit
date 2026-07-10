import * as React from 'react'

import type { DeckIllustrationProps } from '../deck'

/* ─────────────────────────────────────────────────────────
 * PlaceholderIllustration — deterministic geometric art for the
 * model decks.
 *
 *   The model decks are authored as text first; nobody has drawn
 *   their 28 illustrations yet. Instead of one repeated glyph, we
 *   hash the illustration id into a motif (rings, dot grid, bars,
 *   orbit, …) plus a rotation/phase, so every card gets a stable,
 *   distinct mark in the same flat, stroke-based hand as the
 *   original deck's art. Swapping in real illustrations later means
 *   replacing this component in the deck definition — no data
 *   changes.
 * ───────────────────────────────────────────────────────── */

/** djb2 — tiny, stable string hash. Unsigned so bit-slicing is safe. */
function hashId(id: string): number {
  let h = 5381
  for (let i = 0; i < id.length; i++) {
    h = (h * 33) ^ (id.codePointAt(i) ?? 0)
  }
  return h >>> 0
}

const SVG_BASE: React.SVGProps<SVGSVGElement> = {
  viewBox: '0 0 100 100',
  width: '100%',
  height: '100%',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg'
}

const STROKE = 3
const OPACITY = { base: 0.85, soft: 0.45 }

type MotifProps = { fg: string; accent: string; h: number }

/** Concentric rings with an accent satellite on the outer ring. */
function MotifRings({ fg, accent, h }: MotifProps) {
  const angle = ((h >>> 3) % 8) * (Math.PI / 4)
  const cx = 50 + Math.cos(angle) * 30
  const cy = 50 + Math.sin(angle) * 30
  return (
    <>
      <circle
        cx='50'
        cy='50'
        r='30'
        stroke={fg}
        strokeWidth={STROKE}
        opacity={OPACITY.base}
      />
      <circle
        cx='50'
        cy='50'
        r='18'
        stroke={fg}
        strokeWidth={STROKE}
        opacity={OPACITY.soft}
      />
      <circle cx='50' cy='50' r='5' fill={fg} opacity={OPACITY.base} />
      <circle cx={cx} cy={cy} r='6' fill={accent} />
    </>
  )
}

/** 3×3 dot grid; one dot promoted to the accent. */
function MotifDots({ fg, accent, h }: MotifProps) {
  const hot = (h >>> 5) % 9
  const dots = []
  for (let i = 0; i < 9; i++) {
    const x = 30 + (i % 3) * 20
    const y = 30 + Math.floor(i / 3) * 20
    dots.push(
      i === hot ? (
        <circle key={i} cx={x} cy={y} r='7' fill={accent} />
      ) : (
        <circle key={i} cx={x} cy={y} r='4' fill={fg} opacity={OPACITY.base} />
      )
    )
  }
  return <>{dots}</>
}

/** Five bars of hash-driven heights; the tallest is the accent. */
function MotifBars({ fg, accent, h }: MotifProps) {
  const bars = []
  let tall = 0
  const heights: number[] = []
  for (let i = 0; i < 5; i++) {
    const t = 18 + (((h >>> (i * 3)) & 7) / 7) * 38
    heights.push(t)
    if (t > heights[tall]!) tall = i
  }
  for (let i = 0; i < 5; i++) {
    const x = 26 + i * 12
    bars.push(
      <line
        key={i}
        x1={x}
        y1={74}
        x2={x}
        y2={74 - heights[i]!}
        stroke={i === tall ? accent : fg}
        strokeWidth={STROKE + 2}
        strokeLinecap='round'
        opacity={i === tall ? 1 : OPACITY.base}
      />
    )
  }
  return <>{bars}</>
}

/** A large orbit crossed by a chord, accent at the crossing. */
function MotifOrbit({ fg, accent, h }: MotifProps) {
  const flip = (h >>> 6) % 2 === 0
  return (
    <>
      <circle
        cx='50'
        cy='50'
        r='28'
        stroke={fg}
        strokeWidth={STROKE}
        opacity={OPACITY.base}
      />
      <line
        x1={flip ? 18 : 82}
        y1='18'
        x2={flip ? 82 : 18}
        y2='82'
        stroke={fg}
        strokeWidth={STROKE}
        strokeLinecap='round'
        opacity={OPACITY.soft}
      />
      <circle cx={flip ? 70 : 30} cy='30' r='6' fill={accent} />
    </>
  )
}

/** Triangle outline with one accented vertex. */
function MotifTriad({ fg, accent, h }: MotifProps) {
  const pts: [number, number][] = [
    [50, 24],
    [76, 70],
    [24, 70]
  ]
  const hot = (h >>> 7) % 3
  return (
    <>
      <polygon
        points={pts.map((p) => p.join(',')).join(' ')}
        stroke={fg}
        strokeWidth={STROKE}
        strokeLinejoin='round'
        opacity={OPACITY.base}
      />
      <circle cx={pts[hot]![0]} cy={pts[hot]![1]} r='7' fill={accent} />
    </>
  )
}

/** Horizon line with a rising arc and accent sun. */
function MotifHorizon({ fg, accent, h }: MotifProps) {
  const sunX = 36 + ((h >>> 4) % 5) * 7
  return (
    <>
      <line
        x1='16'
        y1='66'
        x2='84'
        y2='66'
        stroke={fg}
        strokeWidth={STROKE}
        strokeLinecap='round'
        opacity={OPACITY.base}
      />
      <path
        d='M 26 66 A 24 24 0 0 1 74 66'
        stroke={fg}
        strokeWidth={STROKE}
        strokeLinecap='round'
        opacity={OPACITY.soft}
      />
      <circle cx={sunX} cy='42' r='7' fill={accent} />
    </>
  )
}

/** Nested rotated squares, accent core. */
function MotifNested({ fg, accent, h }: MotifProps) {
  const spin = 8 + ((h >>> 8) % 4) * 9
  return (
    <>
      <rect
        x='24'
        y='24'
        width='52'
        height='52'
        stroke={fg}
        strokeWidth={STROKE}
        opacity={OPACITY.soft}
      />
      <rect
        x='33'
        y='33'
        width='34'
        height='34'
        stroke={fg}
        strokeWidth={STROKE}
        opacity={OPACITY.base}
        transform={`rotate(${spin} 50 50)`}
      />
      <rect
        x='44'
        y='44'
        width='12'
        height='12'
        fill={accent}
        transform={`rotate(${spin * 2} 50 50)`}
      />
    </>
  )
}

/** A wave with an accent dot riding one crest. */
function MotifWave({ fg, accent, h }: MotifProps) {
  const phase = (h >>> 5) % 2 === 0
  const d = phase
    ? 'M 16 56 C 28 36, 40 36, 50 56 S 72 76, 84 56'
    : 'M 16 50 C 28 70, 40 70, 50 50 S 72 30, 84 50'
  return (
    <>
      <path
        d={d}
        stroke={fg}
        strokeWidth={STROKE}
        strokeLinecap='round'
        opacity={OPACITY.base}
      />
      <path
        d={d}
        stroke={fg}
        strokeWidth={STROKE}
        strokeLinecap='round'
        opacity={OPACITY.soft}
        transform='translate(0 14)'
      />
      <circle cx={phase ? 33 : 67} cy={phase ? 40 : 34} r='6' fill={accent} />
    </>
  )
}

/** Plus sign inside a ring; accent tips one arm. */
function MotifCross({ fg, accent, h }: MotifProps) {
  const arm = (h >>> 9) % 4
  const tips: [number, number][] = [
    [50, 26],
    [74, 50],
    [50, 74],
    [26, 50]
  ]
  return (
    <>
      <circle
        cx='50'
        cy='50'
        r='30'
        stroke={fg}
        strokeWidth={STROKE}
        opacity={OPACITY.soft}
      />
      <line
        x1='50'
        y1='30'
        x2='50'
        y2='70'
        stroke={fg}
        strokeWidth={STROKE}
        strokeLinecap='round'
        opacity={OPACITY.base}
      />
      <line
        x1='30'
        y1='50'
        x2='70'
        y2='50'
        stroke={fg}
        strokeWidth={STROKE}
        strokeLinecap='round'
        opacity={OPACITY.base}
      />
      <circle cx={tips[arm]![0]} cy={tips[arm]![1]} r='6' fill={accent} />
    </>
  )
}

/** Constellation: hash-scattered dots joined by a line. */
function MotifScatter({ fg, accent, h }: MotifProps) {
  const pts: [number, number][] = []
  for (let i = 0; i < 5; i++) {
    const x = 24 + (((h >> (i * 4)) & 15) / 15) * 52
    const y = 24 + (((h >> (i * 4 + 2)) & 15) / 15) * 52
    pts.push([Math.round(x), Math.round(y)])
  }
  return (
    <>
      <polyline
        points={pts
          .slice(0, 3)
          .map((p) => p.join(','))
          .join(' ')}
        stroke={fg}
        strokeWidth={STROKE - 1}
        strokeLinecap='round'
        strokeLinejoin='round'
        opacity={OPACITY.soft}
      />
      {pts.map((p, i) =>
        i === 0 ? (
          <circle key={i} cx={p[0]} cy={p[1]} r='6' fill={accent} />
        ) : (
          <circle
            key={i}
            cx={p[0]}
            cy={p[1]}
            r='4'
            fill={fg}
            opacity={OPACITY.base}
          />
        )
      )}
    </>
  )
}

/** Half-filled circle — a soft "phase" mark. */
function MotifPhase({ fg, accent, h }: MotifProps) {
  const left = (h >>> 10) % 2 === 0
  return (
    <>
      <circle
        cx='50'
        cy='50'
        r='28'
        stroke={fg}
        strokeWidth={STROKE}
        opacity={OPACITY.base}
      />
      <path
        d={
          left
            ? 'M 50 22 A 28 28 0 0 0 50 78 Z'
            : 'M 50 22 A 28 28 0 0 1 50 78 Z'
        }
        fill={fg}
        opacity={OPACITY.soft}
      />
      <circle cx={left ? 66 : 34} cy='36' r='5' fill={accent} />
    </>
  )
}

const MOTIFS = [
  MotifRings,
  MotifDots,
  MotifBars,
  MotifOrbit,
  MotifTriad,
  MotifHorizon,
  MotifNested,
  MotifWave,
  MotifCross,
  MotifScatter,
  MotifPhase
] as const

export function PlaceholderIllustration({
  id,
  fg,
  accent
}: DeckIllustrationProps) {
  const h = hashId(id)
  const Motif = MOTIFS[h % MOTIFS.length]!
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim={id}>
      <Motif fg={fg} accent={accent} h={h} />
    </svg>
  )
}
