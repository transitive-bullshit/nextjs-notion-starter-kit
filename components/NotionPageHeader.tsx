import * as React from 'react'
import cs from 'classnames'
import { IoSunnyOutline } from '@react-icons/all-files/io5/IoSunnyOutline'
import { IoMoonSharp } from '@react-icons/all-files/io5/IoMoonSharp'
import { Header, Breadcrumbs, Search, useNotionContext } from 'react-notion-x'
import * as types from 'notion-types'
import Image from 'next/image'

import { useDarkMode } from 'lib/use-dark-mode'
import {
  navigationStyle,
  navigationLinks,
  isSearchEnabled,
  customHeaderLogo,
  customHeaderLogoDark,
  rootNotionPageId
} from 'lib/config'

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

export const HeaderLogo: React.FC<{
  block: types.CollectionViewPageBlock | types.PageBlock
}> = ({ block }) => {
  const { components, mapPageUrl } = useNotionContext()

  const { isDarkMode } = useDarkMode()

  const LinkWrapper = (props: {
    currentPage: string
    children: JSX.Element
  }) => {
    if (props.currentPage !== '/') {
      return (
        <components.PageLink
          href={mapPageUrl(rootNotionPageId)}
          key={0}
          className={cs(styles.navLink, 'breadcrumb', 'button')}
        >
          {props.children}
        </components.PageLink>
      )
    }
    return <a style={{ padding: 12 }}>{props.children}</a>
  }

  return (
    <LinkWrapper currentPage={mapPageUrl(block.id)}>
      <Image
        src={
          isDarkMode && customHeaderLogoDark
            ? customHeaderLogoDark
            : customHeaderLogo
        }
        width='100%'
        height='100%'
        objectFit='contain'
        alt='logo'
      />
    </LinkWrapper>
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
        {customHeaderLogo ? (
          <HeaderLogo block={block} />
        ) : (
          <Breadcrumbs block={block} rootOnly={true} />
        )}

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
