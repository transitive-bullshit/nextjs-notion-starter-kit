'use client'

import * as React from 'react'

import styles from './PromptingPage.module.css'

/**
 * DriveLoader — the "Drive" pixel-grid loader used as the intro's
 * "Thinking" indicator. Adapted from Beautiful UI's Loading State
 * (https://beautiful-ui-five.vercel.app/): a 3×3 grid of square cells
 * with a chevron wavefront driving right. The 650ms cycle is shorter
 * than the full sweep, so two fronts are always in flight. Reduced
 * motion freezes the grid to its dim state (handled in CSS).
 */

const DRIVE_STEP_MS = 90

// Chevron wavefront: each column lights 90ms after the previous, and
// the middle row leads its neighbors, so the lit front reads as a ">"
// driving rightward through the grid.
const DRIVE_DELAYS = Array.from({ length: 9 }, (_, i) => {
  const row = Math.floor(i / 3)
  const col = i % 3
  return (col + Math.abs(row - 1)) * DRIVE_STEP_MS
})

export function DriveLoader({ className }: { className?: string }) {
  return (
    <span
      className={`${styles.driveGrid} ${className ?? ''}`}
      aria-hidden='true'
    >
      {DRIVE_DELAYS.map((delay, i) => (
        <span
          key={i}
          className={styles.driveCell}
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  )
}

/**
 * Live elapsed readout for the loader, in the agent idiom: tenths of a
 * second in mono tabular figures. Resets when a run starts, ticks while
 * `running`, then holds its final value so the number doesn't jump
 * while the loader cross-fades away.
 */
export function useElapsed(running: boolean): string {
  const [deciseconds, setDeciseconds] = React.useState(0)

  React.useEffect(() => {
    if (!running) return
    setDeciseconds(0)
    const id = window.setInterval(() => setDeciseconds((d) => d + 1), 100)
    return () => window.clearInterval(id)
  }, [running])

  const total = deciseconds / 10
  if (total < 60) return `${total.toFixed(1)}s`
  return `${Math.floor(total / 60)}m ${(total % 60).toFixed(1)}s`
}
