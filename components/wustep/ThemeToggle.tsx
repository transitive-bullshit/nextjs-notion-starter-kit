import * as React from 'react'

import { cn } from '@/lib/utils'

import styles from './ThemeToggle.module.css'

export type ThemeToggleProps = {
  isDark: boolean
  onToggle: () => void
  className?: string
}

/**
 * Shared theme toggle button.
 * Shows the icon for the mode you'll switch TO (sun when dark, moon when light)
 * and tints on hover: yellow for sun, indigo for moon.
 */
export function ThemeToggle({ isDark, onToggle, className }: ThemeToggleProps) {
  return (
    <button
      type='button'
      onClick={onToggle}
      className={cn(styles.themeToggle, className)}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

function SunIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      className={styles.sun}
      aria-hidden='true'
    >
      <circle cx='12' cy='12' r='5' />
      <line x1='12' y1='1' x2='12' y2='3' />
      <line x1='12' y1='21' x2='12' y2='23' />
      <line x1='4.22' y1='4.22' x2='5.64' y2='5.64' />
      <line x1='18.36' y1='18.36' x2='19.78' y2='19.78' />
      <line x1='1' y1='12' x2='3' y2='12' />
      <line x1='21' y1='12' x2='23' y2='12' />
      <line x1='4.22' y1='19.78' x2='5.64' y2='18.36' />
      <line x1='18.36' y1='5.64' x2='19.78' y2='4.22' />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      className={styles.moon}
      aria-hidden='true'
    >
      <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
    </svg>
  )
}
