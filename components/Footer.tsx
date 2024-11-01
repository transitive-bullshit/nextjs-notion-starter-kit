import * as React from 'react'
import cs from 'classnames'
import { IoMoonSharp, IoSunnyOutline } from 'react-icons/io5'

import * as config from '@/lib/config'
import { useDarkMode } from '@/lib/use-dark-mode'
import { socialLinks } from './PageSocial'

import styles from './styles.module.css'

// TODO: merge the data and icons from PageSocial with the social links in Footer

export function FooterImpl() {
  const [hasMounted, setHasMounted] = React.useState(false)
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const currentYear = new Date().getFullYear()

  const onToggleDarkMode = React.useCallback(
    (e) => {
      e.preventDefault()
      toggleDarkMode()
    },
    [toggleDarkMode]
  )

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>
        Copyright {currentYear} {config.author}
      </div>

      <div className={styles.settings}>
        {hasMounted && (
          <a
            className={styles.toggleDarkMode}
            href='#'
            role='button'
            onClick={onToggleDarkMode}
            title='Toggle dark mode'
          >
            {isDarkMode ? <IoMoonSharp /> : <IoSunnyOutline />}
          </a>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: socialLinks.map((action) => (
            `.social-link-footer-${action.name} {}
            .social-link-footer-${action.name}:hover { color: ${action.color}; }
            `
          )).join('\n')
        }}
      />

      <div className={styles.social}>
        {socialLinks.map((action) => (
          <a
            className={cs(styles[action.name], `social-link-footer-${action.name}`)}
            href={action.href}
            title={action.title}
            target='_blank'
            rel='noopener noreferrer'
          >
            {action.icon({ size: 16 })}
          </a>
        ))}

      </div>
    </footer>
  )
}

export const Footer = React.memo(FooterImpl)
