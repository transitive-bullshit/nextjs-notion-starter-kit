import cs from 'classnames'
import * as React from 'react'

import styles from './styles.module.css'

declare global {
  interface Window {
    __GOOGLE_TRANSLATION_CONFIG__?: {
      languages: Array<{ title: string; name: string }>
      defaultLanguage: string
    }
  }
}

function getCurrentLanguage(): string {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('googtrans='))

  if (match) {
    const value = match.split('=')[1]
    // cookie format: /auto/vi
    const lang = value?.split('/').pop()
    if (lang) return lang
  }

  return window.__GOOGLE_TRANSLATION_CONFIG__?.defaultLanguage || 'en'
}

export function LanguageSwitcher() {
  const [hasMounted, setHasMounted] = React.useState(false)
  const [currentLang, setCurrentLang] = React.useState('en')

  React.useEffect(() => {
    setHasMounted(true)
    setCurrentLang(getCurrentLanguage())
  }, [])

  const switchLanguage = React.useCallback((lang: string) => {
    const defaultLang =
      window.__GOOGLE_TRANSLATION_CONFIG__?.defaultLanguage || 'en'

    if (lang === defaultLang) {
      // Switching back to default: remove googtrans cookie on all paths/domains
      document.cookie = `googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`
      document.cookie = `googtrans=;path=/;domain=${window.location.hostname};expires=Thu, 01 Jan 1970 00:00:00 GMT`
      document.cookie = `googtrans=;path=/;domain=.${window.location.hostname};expires=Thu, 01 Jan 1970 00:00:00 GMT`
    } else {
      // Set googtrans cookie for translation
      document.cookie = `googtrans=/auto/${lang};path=/`
      document.cookie = `googtrans=/auto/${lang};path=/;domain=${window.location.hostname}`
      document.cookie = `googtrans=/auto/${lang};path=/;domain=.${window.location.hostname}`
    }
    window.location.reload()
  }, [])

  const languages = (typeof window !== 'undefined' &&
    window.__GOOGLE_TRANSLATION_CONFIG__?.languages) || [
    { title: 'English', name: 'en' },
    { title: 'Tiếng Việt', name: 'vi' }
  ]

  return (
    <div
      className={cs(
        'breadcrumb',
        'button',
        'notranslate',
        styles.langSwitcher,
        !hasMounted && styles.hidden
      )}
    >
      {hasMounted &&
        languages.map((lang, index) => (
          <React.Fragment key={lang.name}>
            {index > 0 && <span className={styles.langSeparator}>|</span>}
            <span
              className={cs(
                styles.langButton,
                currentLang === lang.name && styles.langButtonActive
              )}
              onClick={() => switchLanguage(lang.name)}
            >
              {lang.name.toUpperCase()}
            </span>
          </React.Fragment>
        ))}
    </div>
  )
}
