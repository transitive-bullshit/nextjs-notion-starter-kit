'use client'

import { play, type SoundName } from 'cuelume'
import * as React from 'react'

const soundPreferenceKey = 'site-sound-enabled-v1'
const soundPreferenceChangeEvent = `${soundPreferenceKey}:change`

function readSoundPreference() {
  try {
    const storedValue = window.localStorage.getItem(soundPreferenceKey)
    return storedValue === null ? true : JSON.parse(storedValue) !== false
  } catch {
    return true
  }
}

function readServerSoundPreference() {
  return true
}

function subscribeToSoundPreference(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === soundPreferenceKey) {
      onStoreChange()
    }
  }
  const handlePreferenceChange = () => onStoreChange()

  window.addEventListener('storage', handleStorage)
  window.addEventListener(soundPreferenceChangeEvent, handlePreferenceChange)

  return () => {
    window.removeEventListener('storage', handleStorage)
    window.removeEventListener(
      soundPreferenceChangeEvent,
      handlePreferenceChange
    )
  }
}

function writeSoundPreference(soundEnabled: boolean) {
  try {
    window.localStorage.setItem(
      soundPreferenceKey,
      JSON.stringify(soundEnabled)
    )
    window.dispatchEvent(new Event(soundPreferenceChangeEvent))
    return true
  } catch {
    return false
  }
}

interface SoundContextValue {
  playSound: (sound: SoundName) => void
  soundEnabled: boolean
  toggleSound: () => void
}

const SoundContext = React.createContext<SoundContextValue | null>(null)

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const soundEnabled = React.useSyncExternalStore(
    subscribeToSoundPreference,
    readSoundPreference,
    readServerSoundPreference
  )

  const playSound = React.useCallback(
    (sound: SoundName) => {
      if (!soundEnabled) return

      play(sound)
    },
    [soundEnabled]
  )

  const toggleSound = React.useCallback(() => {
    const nextSoundEnabled = !soundEnabled
    const didUpdatePreference = writeSoundPreference(nextSoundEnabled)
    if (!didUpdatePreference) return

    if (nextSoundEnabled) {
      play('bloom')
    } else {
      play('droplet')
    }
  }, [soundEnabled])

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
