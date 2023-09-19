import * as React from 'react'

import * as types from 'notion-types'
import { FaEnvelopeOpenText } from '@react-icons/all-files/fa/FaEnvelopeOpenText'
import { FaGithub } from '@react-icons/all-files/fa/FaGithub'
import { FaLinkedin } from '@react-icons/all-files/fa/FaLinkedin'
import { FaMastodon } from '@react-icons/all-files/fa/FaMastodon'
import { FaTwitter } from '@react-icons/all-files/fa/FaTwitter'
import { FaYoutube } from '@react-icons/all-files/fa/FaYoutube'
import { FaZhihu } from '@react-icons/all-files/fa/FaZhihu'
import { IoMoonSharp } from '@react-icons/all-files/io5/IoMoonSharp'
import { IoSunnyOutline } from '@react-icons/all-files/io5/IoSunnyOutline'
import cs from 'classnames'
import { Breadcrumbs, Header, Search, useNotionContext } from 'react-notion-x'

import * as config from '@/lib/config'
import { isSearchEnabled, navigationLinks, navigationStyle } from '@/lib/config'
import { useDarkMode } from '@/lib/use-dark-mode'

import styles from './styles.module.css'

const ToggleThemeButton = () => {
  const [hasMounted, setHasMounted] = React.useState(false)
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  const onToggleTheme = React.useCallback(() => {
    toggleDarkMode()
  }, [toggleDarkMode])

  return (
    <div
      className={cs('breadcrumb', 'button', !hasMounted && styles.hidden)}
      onClick={onToggleTheme}
    >
      {hasMounted && isDarkMode ? <IoMoonSharp /> : <IoSunnyOutline />}
    </div>
  )
}

export const NotionPageHeader: React.FC<{
  block: types.CollectionViewPageBlock | types.PageBlock
}> = ({ block }) => {
  const { components, mapPageUrl } = useNotionContext()

  if (navigationStyle === 'default') {
    return <Header block={block} />
  }
  return (
    <header className='notion-header'>
      <div className='notion-nav-header'>
        <Breadcrumbs block={block} rootOnly={true} />

        <div className='notion-nav-header-rhs breadcrumbs'>
          {navigationLinks
            ?.map((link, index) => {
              if (!link.pageId && !link.url) {
                return null
              }

              if (link.pageId) {
                return (
                  <components.PageLink
                    href={mapPageUrl(link.pageId)}
                    key={index}
                    className={cs(styles.navLink, 'breadcrumb', 'button')}
                  >
                    {link.title}
                  </components.PageLink>
                )
              } else {
                return (
                  <components.Link
                    href={link.url}
                    key={index}
                    className={cs(styles.navLink, 'breadcrumb', 'button')}
                  >
                    {link.title}
                  </components.Link>
                )
              }
            })
            .filter(Boolean)}
          <div className={styles.social}>
            {config.twitter && (
              <a
                className={styles.twitter}
                href={`https://twitter.com/${config.twitter}`}
                title={`Twitter @${config.twitter}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaTwitter />
              </a>
            )}

            {config.postype && (
              <a
                className={styles.postype}
                href={`https://${config.postype}.postype.com`}
                title={`Postype ${config.author}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <svg
                  width='28'
                  height='28'
                  viewBox='0 0 32 32'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M2.5 5.5C2.5 3.84315 3.84315 2.5 5.5 2.5H26.5C28.1569 2.5 29.5 3.84315 29.5 5.5V26.5C29.5 28.1569 28.1569 29.5 26.5 29.5H5.5C3.84315 29.5 2.5 28.1569 2.5 26.5V5.5ZM23.5 14.5C23.5 17.8137 20.8137 20.5 17.5 20.5H16V24.5H14V10.5H12.5V24.5H10.5V10.5H8.5V8.5H11.5H15H17.5C20.8137 8.5 23.5 11.1863 23.5 14.5ZM21.5 14.5C21.5 12.2909 19.7091 10.5 17.5 10.5H16V18.5H17.5C19.7091 18.5 21.5 16.7091 21.5 14.5Z'
                    fill='currentColor'
                  />
                </svg>
              </a>
            )}

            {config.youtube && (
              <a
                className={styles.youtube}
                href={`https://www.youtube.com/${config.youtube}`}
                title={`YouTube ${config.author}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaYoutube />
              </a>
            )}
          </div>

          <ToggleThemeButton />
          {isSearchEnabled && <Search block={block} title={'Search'} />}
        </div>
      </div>
    </header>
  )
}
