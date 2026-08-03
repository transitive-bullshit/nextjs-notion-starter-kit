import useDarkModeImpl from '@fisch0920/use-dark-mode'

export function useDarkMode() {
  const isBrowser = typeof window !== 'undefined'
  const darkMode = useDarkModeImpl(false, {
    classNameDark: 'dark-mode',
    // The package supports null at runtime to disable SSR persistence.
    storageKey: isBrowser ? 'darkMode' : (null as unknown as string)
  })

  return {
    isDarkMode: darkMode.value,
    toggleDarkMode: darkMode.toggle
  }
}
