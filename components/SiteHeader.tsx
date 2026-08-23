'use client'

import Image from 'next/image'
import Link from 'next/link'
import type {
  ComponentPropsWithoutRef,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode
} from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

import { github, navigationLinks, twitter } from '@/lib/config'

import { SmoothHashLink } from './SmoothHashLink'
import { SoundToggle } from './SoundToggle'
import styles from './site-header.module.css'

const desktopMediaQuery = '(min-width: 821px)'
const searchRootSelector = '.notion-search'
const searchPortalSelector = '.ReactModalPortal'
const searchClearSelector = '.clearButton'
const searchStatusSelector = '.resultsFooter, .noResultsPane'
const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

function getConfiguredHref(title: string, fallback: string) {
  const configuredLink = navigationLinks?.find(
    (link) => link?.title.toLowerCase() === title.toLowerCase()
  )

  return configuredLink?.url || fallback
}

const defaultAboutHref = getConfiguredHref('about', '/about')
const githubUrl = github ? `https://github.com/${github}` : undefined
const twitterUrl = twitter ? `https://x.com/${twitter}` : undefined

export interface SiteHeaderProps {
  /** A record-map-aware page URL should be passed when available. */
  aboutHref?: string
  /** Optional callback used by the mobile Search row. */
  onSearch?: () => void
  /** Existing search control rendered once in the desktop utility area. */
  search?: ReactNode
}

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <span
      className={styles.menuGlyph}
      data-open={open ? 'true' : undefined}
      aria-hidden='true'
    >
      <span />
      <span />
    </span>
  )
}

function SearchGlyph() {
  return (
    <svg className={styles.searchGlyph} viewBox='0 0 20 20' aria-hidden='true'>
      <circle cx='8.5' cy='8.5' r='5.5' />
      <path d='m12.8 12.8 4.2 4.2' />
    </svg>
  )
}

function ExternalMark() {
  return <span aria-hidden='true'>↗</span>
}

function WritingLink({
  children,
  onClick
}: Pick<ComponentPropsWithoutRef<'a'>, 'children' | 'onClick'>) {
  const pathname = usePathname()

  return pathname === '/' ? (
    <SmoothHashLink href='#writing' onClick={onClick}>
      {children}
    </SmoothHashLink>
  ) : (
    <Link href='/#writing' onClick={onClick}>
      {children}
    </Link>
  )
}

function enhanceSearchDialogAccessibility(searchRoot: HTMLElement) {
  searchRoot
    .querySelectorAll<HTMLInputElement>('.searchInput')
    .forEach((input) => {
      input.name = 'search'
      input.type = 'search'
      input.autocomplete = 'off'
      input.spellcheck = false
      input.placeholder = 'Search…'

      if (!input.hasAttribute('aria-label')) {
        input.setAttribute('aria-label', 'Search the site')
      }
    })

  searchRoot
    .querySelectorAll<HTMLElement>(searchClearSelector)
    .forEach((clearButton) => {
      if (!clearButton.hasAttribute('tabindex')) {
        clearButton.tabIndex = 0
      }
      if (!clearButton.hasAttribute('aria-label')) {
        clearButton.setAttribute('aria-label', 'Clear search')
      }
    })

  searchRoot
    .querySelectorAll<HTMLElement>(searchStatusSelector)
    .forEach((status) => {
      if (!status.hasAttribute('role')) {
        status.setAttribute('role', 'status')
      }
      if (!status.hasAttribute('aria-live')) {
        status.setAttribute('aria-live', 'polite')
      }
      if (!status.hasAttribute('aria-atomic')) {
        status.setAttribute('aria-atomic', 'true')
      }
    })
}

function findSearchRoot(node: Node): HTMLElement | null {
  if (!(node instanceof HTMLElement)) return null
  if (node.matches(searchRootSelector)) return node

  return node.querySelector<HTMLElement>(searchRootSelector)
}

export function SiteHeader({
  aboutHref = defaultAboutHref,
  onSearch,
  search
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const searchBridgeRef = useRef<HTMLDivElement>(null)
  const handledSearchUrlRef = useRef<string | undefined>(undefined)
  const prepareSearchDialogRef = useRef<() => void>(() => {})
  const hasBridgedSearch = Boolean(search)
  const searchAvailable = hasBridgedSearch || Boolean(onSearch)

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const openBridgedSearch = useCallback(() => {
    prepareSearchDialogRef.current()

    const searchControl = searchBridgeRef.current?.querySelector<HTMLElement>(
      'button, [role="button"], input, a[href]'
    )

    if (searchControl instanceof HTMLInputElement) {
      searchControl.focus()
    } else {
      searchControl?.click()
    }
  }, [])
  const openSearch = useCallback(() => {
    if (onSearch) {
      onSearch()
      return
    }

    openBridgedSearch()
  }, [onSearch, openBridgedSearch])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (menuOpen && !dialog.open) {
      dialog.showModal()
      const firstFocusable =
        dialog.querySelector<HTMLElement>(focusableSelector)
      firstFocusable?.focus()
    } else if (!menuOpen && dialog.open) {
      dialog.close()
    }
  }, [menuOpen])

  useEffect(() => {
    const mediaQuery = window.matchMedia(desktopMediaQuery)
    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      if (event.matches) closeMenu()
    }

    if (mediaQuery.matches) closeMenu()
    mediaQuery.addEventListener('change', handleBreakpointChange)

    return () =>
      mediaQuery.removeEventListener('change', handleBreakpointChange)
  }, [closeMenu])

  useEffect(() => {
    if (!hasBridgedSearch) return

    const url = new URL(window.location.href)
    if (url.searchParams.get('search') !== 'true') return
    if (handledSearchUrlRef.current === url.href) return

    handledSearchUrlRef.current = url.href
    const openFrame = window.requestAnimationFrame(openBridgedSearch)

    url.searchParams.delete('search')
    const cleanUrl = `${url.pathname}${url.search}${url.hash}`
    window.history.replaceState(window.history.state, '', cleanUrl)
    handledSearchUrlRef.current = new URL(cleanUrl, window.location.origin).href

    return () => window.cancelAnimationFrame(openFrame)
  }, [hasBridgedSearch, openBridgedSearch])

  useEffect(() => {
    if (!hasBridgedSearch) return

    let searchRoot: HTMLElement | null = null
    let discoveryTimeout: number | undefined
    const discoveryObservers = new Set<MutationObserver>()
    const searchObserver = new MutationObserver(() => {
      if (searchRoot) enhanceSearchDialogAccessibility(searchRoot)
    })
    const handleSearchDialogKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      if (!(target instanceof HTMLElement)) return
      if (!target.matches(searchClearSelector)) return
      if (target instanceof HTMLButtonElement) return
      if (event.key !== 'Enter' && event.key !== ' ') return

      event.preventDefault()
      target.click()
    }

    const stopDiscovering = () => {
      for (const observer of discoveryObservers) observer.disconnect()
      discoveryObservers.clear()
      if (discoveryTimeout !== undefined) {
        window.clearTimeout(discoveryTimeout)
        discoveryTimeout = undefined
      }
    }

    const connectSearchRoot = (nextSearchRoot: HTMLElement) => {
      stopDiscovering()
      searchObserver.disconnect()
      searchRoot?.removeEventListener('keydown', handleSearchDialogKeyDown)

      searchRoot = nextSearchRoot
      enhanceSearchDialogAccessibility(searchRoot)
      searchObserver.observe(searchRoot, { childList: true, subtree: true })
      searchRoot.addEventListener('keydown', handleSearchDialogKeyDown)
    }

    const inspectAddedNodes = (records: MutationRecord[]) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          const nextSearchRoot = findSearchRoot(node)
          if (nextSearchRoot) {
            connectSearchRoot(nextSearchRoot)
            return
          }
        }
      }
    }

    const observeContainer = (container: HTMLElement) => {
      const observer = new MutationObserver(inspectAddedNodes)
      observer.observe(container, { childList: true, subtree: true })
      discoveryObservers.add(observer)
    }

    const startDiscovering = () => {
      if (searchRoot?.isConnected) {
        enhanceSearchDialogAccessibility(searchRoot)
        return
      }

      searchObserver.disconnect()
      searchRoot?.removeEventListener('keydown', handleSearchDialogKeyDown)
      searchRoot = document.querySelector<HTMLElement>(searchRootSelector)
      if (searchRoot) {
        connectSearchRoot(searchRoot)
        return
      }

      stopDiscovering()
      document
        .querySelectorAll<HTMLElement>(searchPortalSelector)
        .forEach(observeContainer)

      const bodyObserver = new MutationObserver((records) => {
        inspectAddedNodes(records)
        if (searchRoot) return

        for (const record of records) {
          for (const node of record.addedNodes) {
            if (!(node instanceof HTMLElement)) continue

            if (node.matches(searchPortalSelector)) observeContainer(node)
            node
              .querySelectorAll<HTMLElement>(searchPortalSelector)
              .forEach(observeContainer)
          }
        }
      })
      bodyObserver.observe(document.body, { childList: true })
      discoveryObservers.add(bodyObserver)
      discoveryTimeout = window.setTimeout(stopDiscovering, 5000)
    }

    const existingSearchRoot =
      document.querySelector<HTMLElement>(searchRootSelector)
    if (existingSearchRoot) connectSearchRoot(existingSearchRoot)
    prepareSearchDialogRef.current = startDiscovering

    return () => {
      prepareSearchDialogRef.current = () => {}
      stopDiscovering()
      searchObserver.disconnect()
      searchRoot?.removeEventListener('keydown', handleSearchDialogKeyDown)
    }
  }, [hasBridgedSearch])

  const handleDialogClose = () => {
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  const handleDialogClick = (event: ReactMouseEvent<HTMLDialogElement>) => {
    const dialog = event.currentTarget
    const bounds = dialog.getBoundingClientRect()
    const outsideDialog =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom

    if (outsideDialog) closeMenu()
  }

  const handleDialogKeyDown = (
    event: ReactKeyboardEvent<HTMLDialogElement>
  ) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeMenu()
      return
    }

    if (event.key !== 'Tab') return

    const focusableElements = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(focusableSelector)
    ).filter((element) => element.getAttribute('aria-hidden') !== 'true')

    const firstElement = focusableElements[0]
    const lastElement = focusableElements.at(-1)
    if (!firstElement || !lastElement) return

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  const handleMobileSearch = () => {
    closeMenu()
    window.requestAnimationFrame(openSearch)
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          className={styles.avatarLink}
          href='/'
          aria-label='Travis Fischer, home'
        >
          <Image
            className={styles.avatar}
            src='/page-icon.png'
            alt=''
            width={40}
            height={40}
            priority
          />
        </Link>

        <nav
          className={styles.primaryNavigation}
          aria-label='Primary navigation'
        >
          <WritingLink>Writing</WritingLink>
          <Link href={aboutHref}>About</Link>
        </nav>

        <nav className={styles.utilityNavigation} aria-label='Site utilities'>
          {githubUrl ? (
            <a href={githubUrl} target='_blank' rel='noopener noreferrer'>
              GitHub <ExternalMark />
            </a>
          ) : null}
          {twitterUrl ? (
            <a href={twitterUrl} target='_blank' rel='noopener noreferrer'>
              X <ExternalMark />
            </a>
          ) : null}
          {searchAvailable ? (
            <button
              className={styles.desktopSearchButton}
              type='button'
              onClick={openSearch}
            >
              <SearchGlyph />
              Search
            </button>
          ) : null}

          <SoundToggle />

          {search ? (
            <div
              className={styles.searchBridge}
              ref={searchBridgeRef}
              aria-hidden='true'
            >
              {search}
            </div>
          ) : null}
        </nav>

        <div className={styles.mobileControls}>
          <SoundToggle />
          <button
            className={styles.menuButton}
            ref={menuButtonRef}
            type='button'
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls='site-mobile-menu'
            aria-haspopup='dialog'
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span>Menu</span>
            <MenuGlyph open={menuOpen} />
          </button>
        </div>
      </div>

      <dialog
        className={styles.mobileMenu}
        id='site-mobile-menu'
        ref={dialogRef}
        aria-labelledby='site-mobile-menu-title'
        onCancel={(event) => {
          event.preventDefault()
          closeMenu()
        }}
        onClose={handleDialogClose}
        onKeyDown={handleDialogKeyDown}
        onClick={handleDialogClick}
      >
        <div className={styles.mobileMenuTopline}>
          <p id='site-mobile-menu-title'>Navigate</p>
          <button type='button' onClick={closeMenu}>
            Close
          </button>
        </div>

        <nav className={styles.mobileNavigation} aria-label='Mobile navigation'>
          <WritingLink onClick={closeMenu}>
            <span>Writing</span>
            <span aria-hidden='true'>01</span>
          </WritingLink>

          <Link href={aboutHref} onClick={closeMenu}>
            <span>About</span>
            <span aria-hidden='true'>02</span>
          </Link>

          {searchAvailable ? (
            <button type='button' onClick={handleMobileSearch}>
              <span>Search</span>
              <SearchGlyph />
            </button>
          ) : null}
        </nav>

        {githubUrl || twitterUrl ? (
          <nav
            className={styles.mobileSocialNavigation}
            aria-label='Social links'
          >
            {githubUrl ? (
              <a href={githubUrl} target='_blank' rel='noopener noreferrer'>
                GitHub <ExternalMark />
              </a>
            ) : null}
            {twitterUrl ? (
              <a href={twitterUrl} target='_blank' rel='noopener noreferrer'>
                X <ExternalMark />
              </a>
            ) : null}
          </nav>
        ) : null}
      </dialog>
    </header>
  )
}
