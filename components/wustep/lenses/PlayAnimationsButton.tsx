import * as React from 'react'

import { cn } from '@/lib/utils'

import styles from './LensesPage.module.css'

export type PlayAnimationsButtonProps = {
  playing: boolean
  onToggle: () => void
  className?: string
}

/**
 * Desktop-only control that toggles all lens illustration loops on
 * the canvas. Hidden at rest and revealed when the header is hovered,
 * matching the AboutPage theme-toggle pattern.
 */
export function PlayAnimationsButton({
  playing,
  onToggle,
  className
}: PlayAnimationsButtonProps) {
  return (
    <button
      type='button'
      className={cn(
        styles.headerButton,
        styles.playAnimationsButton,
        className
      )}
      onClick={onToggle}
      aria-label={
        playing ? 'Pause all illustrations' : 'Play all illustrations'
      }
      aria-pressed={playing}
      title={playing ? 'Pause all illustrations' : 'Play all illustrations'}
    >
      {playing ? <PauseIcon /> : <PlayIcon />}
    </button>
  )
}

function PlayIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      <path d='M8 5.5v13l10-6.5-10-6.5Z' fill='currentColor' />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      <path
        d='M7 5.5h3.5v13H7v-13Zm6.5 0H17v13h-3.5v-13Z'
        fill='currentColor'
      />
    </svg>
  )
}
