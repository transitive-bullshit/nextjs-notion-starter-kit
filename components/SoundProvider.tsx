'use client'

import { play, type SoundName } from 'cuelume'
import * as React from 'react'
import { useLocalStorage } from 'react-use'

const soundPreferenceKey = 'site-sound-enabled-v1'

interface SoundContextValue {
  playSound: (sound: SoundName) => void
  soundEnabled: boolean
  toggleSound: () => void
}

const SoundContext = React.createContext<SoundContextValue | null>(null)

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [storedSoundEnabled, setStoredSoundEnabled] = useLocalStorage<boolean>(
    soundPreferenceKey,
    true
  )
  const [hasMounted, setHasMounted] = React.useState(false)
  const soundEnabled = hasMounted ? storedSoundEnabled !== false : true

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  const playSound = React.useCallback(
    (sound: SoundName) => {
      if (!soundEnabled) return

      play(sound)
    },
    [soundEnabled]
  )

  const toggleSound = React.useCallback(() => {
    const nextSoundEnabled = !soundEnabled

    if (nextSoundEnabled) {
      play('bloom')
    } else {
      play('droplet')
    }

    setStoredSoundEnabled(nextSoundEnabled)
  }, [setStoredSoundEnabled, soundEnabled])

  const value = React.useMemo(
    () => ({ playSound, soundEnabled, toggleSound }),
    [playSound, soundEnabled, toggleSound]
  )

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function useSound(): SoundContextValue {
  const context = React.useContext(SoundContext)

  if (!context) {
    throw new Error('useSound must be used inside SoundProvider')
  }

  return context
}
