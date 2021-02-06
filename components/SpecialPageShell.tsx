'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { parsePageId } from 'notion-utils'
import { type ReactNode, Suspense, useCallback } from 'react'

import {
  pageUrlAdditions,
  pageUrlOverrides,
  rootNotionPageId
} from '@/lib/config'

import { Footer } from './Footer'
import { SiteHeader } from './SiteHeader'
import styles from './special-page-shell.module.css'

interface SpecialPageShellProps {
  children: ReactNode
  sourceNotionPageId?: string
}

function getSourceNotionPageId(pathname: string) {
  const pagePath = pathname.replace(/^\/+|\/+$/g, '')

  if (!pagePath) {
    return rootNotionPageId
  }

  const configuredPageId =
    pageUrlOverrides[pagePath] ?? pageUrlAdditions[pagePath]

  return parsePageId(configuredPageId ?? pagePath, { uuid: false }) ?? undefined
}

function SpecialPageShellContent({
  children,
  onSearch,
  sourceNotionPageId
}: SpecialPageShellProps & { onSearch: () => void }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (searchParams.get('lite') === 'true') {
    return children
  }

  const resolvedSourceNotionPageId =
    parsePageId(sourceNotionPageId, { uuid: false }) ??
    getSourceNotionPageId(pathname)

  return (
    <div className={styles.shell}>
      <SiteHeader onSearch={onSearch} />
      <div className={styles.content}>{children}</div>
      <Footer sourceNotionPageId={resolvedSourceNotionPageId} />
    </div>
  )
}

export function SpecialPageShell({
  children,
  sourceNotionPageId
}: SpecialPageShellProps) {
  const router = useRouter()
  const openSearch = useCallback(() => {
    router.push('/?search=true')
  }, [router])
  const fallbackSourceNotionPageId = parsePageId(sourceNotionPageId, {
    uuid: false
  })

  return (
    <Suspense
      fallback={
        <div className={styles.fallback}>
          <SiteHeader onSearch={openSearch} />
          <div className={styles.content}>{children}</div>
          <Footer sourceNotionPageId={fallbackSourceNotionPageId} />
        </div>
      }
    >
      <SpecialPageShellContent
        sourceNotionPageId={sourceNotionPageId}
        onSearch={openSearch}
      >
        {children}
      </SpecialPageShellContent>
    </Suspense>
  )
}
