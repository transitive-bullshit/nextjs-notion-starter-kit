import { useTheme } from 'next-themes'
import * as React from 'react'

export function useDarkMode() {
  const [hasMounted, setHasMounted] = React.useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const isDarkMode = hasMounted && resolvedTheme === 'dark'

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  const toggleDarkMode = React.useCallback(() => {
    setTheme(isDarkMode ? 'light' : 'dark')
  }, [isDarkMode, setTheme])

  return {
    hasMounted,
    isDarkMode,
    toggleDarkMode
  }
}
