import React from "react";
import { useLocalStorage } from "react-use";


export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>('dark-mode', false)
  return {
    isDarkMode,
    toggleDarkMode: () => setIsDarkMode(!isDarkMode)
  }
}

export const DarkModeContext = React.createContext<ReturnType<typeof useDarkMode> | null>(null);
