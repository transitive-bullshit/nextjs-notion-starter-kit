import type * as types from 'notion-types'
import cs from 'classnames'
import * as React from 'react'
import { Breadcrumbs, Header, Search, useNotionContext } from 'react-notion-x'

import { isSearchEnabled, navigationLinks, navigationStyle } from '@/lib/config'

import styles from './styles.module.css'

export function NotionPageHeader({
  block
}: {
  block: types.CollectionViewPageBlock | types.PageBlock
}) {
  const { components, mapPageUrl } = useNotionContext()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  if (navigationStyle === 'default') {
    return <Header block={block} />
  }

  const navigationLinksContent = navigationLinks
    ?.map((link, index) => {
      if (!link?.pageId && !link?.url) {
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
    .filter(Boolean)

  return (
    <header className='notion-header'>
      <div className='notion-nav-header'>
        <Breadcrumbs block={block} rootOnly={true} />

        <div className='notion-nav-header-rhs breadcrumbs'>
          {/* Desktop Navigation - navigationLinks then Search */}
          <div className={styles.desktopNav}>
            {navigationLinksContent}
            {isSearchEnabled && <Search block={block} title={null} />}
          </div>

          {/* Mobile Navigation - Search then hamburger menu */}
          <div className={styles.mobileNav}>
            {isSearchEnabled && <Search block={block} title={null} />}

            <button
              className={styles.hamburgerButton}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            {isMobileMenuOpen && (
              <div className={styles.mobileNavOpen}>
                {navigationLinksContent}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
