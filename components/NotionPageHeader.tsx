import * as React from 'react'

import * as types from 'notion-types'
import { IoMoonSharp } from '@react-icons/all-files/io5/IoMoonSharp'
import { IoSunnyOutline } from '@react-icons/all-files/io5/IoSunnyOutline'
import cs from 'classnames'
import { Breadcrumbs, Header, Search, useNotionContext } from 'react-notion-x'
import { isSearchEnabled, navigationLinks, navigationStyle } from '@/lib/config'
import { useDarkMode } from '@/lib/use-dark-mode'
import Link from 'next/link'

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
          <Link 
            href="/"
            aria-label="go to homepage">
            <svg
              className="homepage_link"
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              viewBox="0 0 512 512">
              <path d="M220.82,2.45c-0.32,169.16-0.63,338.35-0.93,507.58C-71.6,453.2-75.3,49.3,220.82,2.45z" />
              <path d="M280.77,512c0.68-170.59-0.35-340.04,0.45-510.63C588.99,38.93,592.68,467.69,280.77,512z M407.01,437.38c0.11,0.12,0.23,0.25,0.35,0.38c134.65-112.03,105.47-337.72-56.71-407.84c-6.63-2.16-48.02-19.74-47.74-11.75c-0.48,43.54,0.37,156.85,0.17,169.97c-0.36,3.06,3.44,4.11,5.66,4.51c47.35,12.21,87.42,47.33,108.52,90.78C439.81,332.51,435.52,391.58,407.01,437.38z" />
            </svg>

          </Link>

        {/* <Breadcrumbs block={block} rootOnly={true} /> */}

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

          <ToggleThemeButton />

          {isSearchEnabled && <Search block={block} title={null} />}
        </div>
      </div>
    </header>
  )
}
