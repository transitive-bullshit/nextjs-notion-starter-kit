import { useEffect, useState } from 'react'

function getSearchParam(param: string): string | null {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get(param)
}

/**
 * Reads a query-string parameter and stays in sync with history navigation.
 *
 * A minimal replacement for react-use's `useSearchParam` — reads the value
 * from `window.location.search` on mount and updates on `popstate`/`hashchange`.
 */
export function useSearchParam(param: string): string | null {
  const [value, setValue] = useState<string | null>(() => getSearchParam(param))

  useEffect(() => {
    const onChange = () => setValue(getSearchParam(param))
    window.addEventListener('popstate', onChange)
    window.addEventListener('hashchange', onChange)
    return () => {
      window.removeEventListener('popstate', onChange)
      window.removeEventListener('hashchange', onChange)
    }
  }, [param])

  return value
}
