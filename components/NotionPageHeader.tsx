import type * as types from 'notion-types'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import { Breadcrumbs, Header, Search, useNotionContext } from 'react-notion-x'

import { LabsButton } from '@/components/wustep/LabsButton'
import { ThemeToggle } from '@/components/wustep/ThemeToggle'
import {
  isSearchEnabled,
  navigationLinks,
  navigationStyle,
  pageUrlOverrides
} from '@/lib/config'
import { useDarkMode } from '@/lib/use-dark-mode'
import { cn } from '@/lib/utils'

import styles from './styles.module.css'

const auxiliaryPaths = new Set(
  Object.keys(pageUrlOverrides).map((path) => `/${path}`)
)

export function NotionPageHeader({
  block
}: {
  block: types.CollectionViewPageBlock | types.PageBlock
}) {
  const { components, mapPageUrl } = useNotionContext()
  const router = useRouter()
  const isAuxiliaryPage = auxiliaryPaths.has(
    router.asPath.split('?')[0]!.split('#')[0]!
  )

  if (navigationStyle === 'default') {
    return <Header block={block} />
  }

  return (
    <header className='notion-header'>
      <div className='notion-nav-header'>
        {isAuxiliaryPage ? (
          <Link
            href='/'
            className={styles.homeBackButton}
            aria-label='Back to home'
          >
            <span className={styles.homeBackArrow}>←</span>
          </Link>
        ) : (
          <Breadcrumbs block={block} rootOnly={true} />
        )}

        <div className='notion-nav-header-rhs breadcrumbs'>
          {navigationLinks
            ?.map((link, index) => {
              if (!link?.pageId && !link?.url) {
                return null
              }

              if (link.pageId) {
                return (
                  <components.PageLink
                    href={mapPageUrl(link.pageId)}
                    key={index}
                    className={cn(styles.navLink, 'breadcrumb', 'button')}
                  >
                    {link.title}
                  </components.PageLink>
                )
              } else {
                return (
                  <components.Link
                    href={link.url}
                    key={index}
                    className={cn(styles.navLink, 'breadcrumb', 'button')}
                  >
                    {link.title}
                  </components.Link>
                )
              }
            })
            .filter(Boolean)}

          <PlaygroundButton />
          <ToggleThemeButton />

          {isSearchEnabled && <Search block={block} title={null} />}
        </div>
      </div>
    </header>
  )
}

function ToggleThemeButton() {
  const [hasMounted, setHasMounted] = React.useState(false)
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <ThemeToggle
      isDark={hasMounted ? isDarkMode : false}
      onToggle={toggleDarkMode}
      className={cn(
        'breadcrumb',
        'button',
        styles.themeButton,
        !hasMounted && styles.hidden
      )}
    />
  )
}

function PlaygroundButton() {
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <LabsButton
      className={cn(
        'breadcrumb',
        'button',
        styles.playgroundButton,
        !hasMounted && styles.hidden
      )}
    />
  )
}
