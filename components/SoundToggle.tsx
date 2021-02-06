'use client'

import { useSound } from './SoundProvider'
import styles from './sound-toggle.module.css'

export function SoundToggle() {
  const { soundEnabled, toggleSound } = useSound()
  const title = soundEnabled ? 'Turn sound off' : 'Turn sound on'

  return (
    <button
      className={styles.button}
      type='button'
      data-enabled={soundEnabled ? 'true' : 'false'}
      aria-label='Sound'
      aria-pressed={soundEnabled}
      title={title}
      onClick={toggleSound}
    >
      <svg viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
        <path className={styles.speaker} d='M5 10v4h3l4 3V7l-4 3H5Z' />
        <path
          className={styles.waves}
          d='M15 9.4a4 4 0 0 1 0 5.2M17.5 7a7.2 7.2 0 0 1 0 10'
        />
        <path className={styles.slash} d='m5.5 5.5 13 13' />
      </svg>
    </button>
  )
}
