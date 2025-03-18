import useDarkModeImpl from '@fisch0920/use-dark-mode'
import { useEffect, useState } from 'react'


export function useDarkMode() {
  // Use null as initial state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false)

  // Initialize with false (light mode) but don't apply it until after hydration
  const darkMode = useDarkModeImpl(false, {
    classNameDark: 'dark-mode',
    // Skip the initial state change to prevent hydration mismatch
    onChange: undefined
  })

  // After hydration, mark component as mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  return {
    // Only return the actual value after component is mounted
    // This prevents hydration mismatch between server and client
    isDarkMode: mounted ? darkMode.value : false,
    toggleDarkMode: darkMode.toggle
  }
}
