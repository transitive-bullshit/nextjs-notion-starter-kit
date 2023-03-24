import * as React from 'react'
import * as config from '@/lib/config'

import styles from './styles.module.css'

// TODO: merge the data and icons from PageSocial with the social links in Footer

export const FooterImpl: React.FC = () => {
  const [, setHasMounted] = React.useState(false)
  // const { toggleDarkMode } = useDarkMode()

  // const onToggleDarkMode = React.useCallback(
  //   (e) => {
  //     e.preventDefault()
  //     toggleDarkMode()
  //   },
  //   [toggleDarkMode]
  // )

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>Copyright 2023 ❤️ {config.author}</div>
      {/* 
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
      </div> */}

      <div className={styles.icp}>
        {config.icp && (
          <a
          className={styles.icp}
          href={`https://beian.miit.gov.cn/`}
          target='_blank'
          rel='noopener noreferrer'
          >
          {config.icp}
          </a>
        )}

        {config.picp_name && config.picp_url && (
          <a
          className={styles.icp}
          href={config.picp_url}
          target='_blank'
          rel='noopener noreferrer'
          >
          {config.picp_name}
          </a>
        )}

      </div>
      


    </footer>
  )
}

export const Footer = React.memo(FooterImpl)
