'use client'

import Link from 'next/link'
import * as React from 'react'

import { HouseFillIcon } from '@/components/icons/InlineIcons'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar'
import { OwnerModeToggle } from '@/components/wustep/OwnerModeToggle'
import { PlaygroundSidebar } from '@/components/wustep/PlaygroundSidebar'
import { ThemeToggle } from '@/components/wustep/ThemeToggle'
import { useDarkMode } from '@/lib/use-dark-mode'

type PlaygroundThemeContextValue = {
  hasMounted: boolean
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const PlaygroundThemeContext =
  React.createContext<PlaygroundThemeContextValue | null>(null)

const PLAYGROUND_SIDEBAR_STORAGE_KEY = 'playground-sidebar-open:v1'

function loadStoredSidebarOpen() {
  try {
    const storedValue = window.localStorage.getItem(
      PLAYGROUND_SIDEBAR_STORAGE_KEY
    )
    if (storedValue === 'true') return true
    if (storedValue === 'false') return false
    return null
  } catch {
    return null
  }
}

function storeSidebarOpen(open: boolean) {
  try {
    window.localStorage.setItem(PLAYGROUND_SIDEBAR_STORAGE_KEY, String(open))
  } catch {
    // localStorage can be disabled or unavailable in private browsing.
  }
}

export function usePlaygroundTheme() {
  return React.useContext(PlaygroundThemeContext)
}

interface PlaygroundLayoutProps {
  children: React.ReactNode
  title: string
  breadcrumbs?: { label: string; href?: string }[]
  /** When true, children fill the entire frame (no padding, no title, no max-width) */
  fullFrame?: boolean
}

export function PlaygroundLayout({
  children,
  title,
  breadcrumbs = [],
  fullFrame = false
}: PlaygroundLayoutProps) {
  const [hasMounted, setHasMounted] = React.useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  React.useEffect(() => {
    setHasMounted(true)
    const storedSidebarOpen = loadStoredSidebarOpen()
    if (storedSidebarOpen !== null) {
      setIsSidebarOpen(storedSidebarOpen)
    }
  }, [])

  const handleSidebarOpenChange = React.useCallback((open: boolean) => {
    setIsSidebarOpen(open)
    storeSidebarOpen(open)
  }, [])

  const playgroundTheme = React.useMemo(
    () => ({ hasMounted, isDarkMode, toggleDarkMode }),
    [hasMounted, isDarkMode, toggleDarkMode]
  )

  return (
    <PlaygroundThemeContext.Provider value={playgroundTheme}>
      <SidebarProvider
        open={isSidebarOpen}
        onOpenChange={handleSidebarOpenChange}
        style={
          {
            '--sidebar-width': '16rem'
          } as React.CSSProperties
        }
      >
        <PlaygroundSidebar />
        <LayoutContent
          title={title}
          breadcrumbs={breadcrumbs}
          hasMounted={hasMounted}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          fullFrame={fullFrame}
        >
          {children}
        </LayoutContent>
      </SidebarProvider>
    </PlaygroundThemeContext.Provider>
  )
}

type LayoutContentProps = PlaygroundLayoutProps & {
  hasMounted: boolean
  isDarkMode: boolean
  toggleDarkMode: () => void
}

function LayoutContent({
  children,
  title,
  breadcrumbs,
  hasMounted,
  isDarkMode,
  toggleDarkMode,
  fullFrame
}: LayoutContentProps) {
  const { state, isMobile } = useSidebar()
  const insetStyle = React.useMemo(() => {
    if (isMobile) return undefined

    const paddingLeft =
      state === 'collapsed'
        ? 'calc(var(--sidebar-width-icon) + theme(spacing.8))'
        : 'calc(var(--sidebar-width) + theme(spacing.8))'

    return { paddingLeft }
  }, [state, isMobile])

  return (
    <SidebarInset
      className='transition-[padding] duration-200 bg-background'
      style={insetStyle as React.CSSProperties}
    >
      <header className='owner-mode-toggle-reveal-group flex h-[55px] shrink-0 items-center gap-2 border-b px-4 pr-3 bg-background'>
        <SidebarTrigger className='-ml-1' />
        <Separator
          orientation='vertical'
          className='mr-2 data-[orientation=vertical]:h-4'
        />
        <Breadcrumb>
          <BreadcrumbList>
            {[
              { label: 'Playground', href: '/playground', hideOnMobile: true },
              ...(breadcrumbs ?? [])
            ].map((crumb, index, arr) => (
              <React.Fragment key={`${crumb.label}-${index}`}>
                <BreadcrumbItem
                  className={index === 0 ? 'hidden md:block' : undefined}
                >
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < arr.length - 1 && (
                  <BreadcrumbSeparator
                    className={index === 0 ? 'hidden md:block' : undefined}
                  />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className='relative ml-auto flex items-center gap-2'>
          <Link
            href='/'
            className='playground-home-button playground-action-button relative inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors after:absolute after:-inset-1.5'
            aria-label='Go home'
          >
            <HouseFillIcon className='playground-home-icon h-4 w-4' />
          </Link>
          <OwnerModeToggle className='playground-owner-mode-toggle playground-action-button relative h-8 w-8 rounded-md text-base after:absolute after:-inset-1.5' />
          <ThemeToggle
            isDark={hasMounted ? isDarkMode : false}
            onToggle={toggleDarkMode}
            className='playground-theme-button playground-action-button relative inline-flex h-8 w-8 items-center justify-center rounded-md after:absolute after:-inset-1.5'
          />
        </div>
      </header>
      {fullFrame ? (
        <div className='flex min-w-0 flex-1 flex-col bg-background'>
          {children}
        </div>
      ) : (
        <div className='flex flex-1 flex-col gap-4 p-4 pt-8 pb-16 bg-background'>
          <div className='w-full max-w-4xl mx-auto'>
            <h1 className='text-4xl font-bold mb-8'>{title}</h1>
            {children}
          </div>
        </div>
      )}
    </SidebarInset>
  )
}
