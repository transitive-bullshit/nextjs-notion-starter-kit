'use client'

import * as Fathom from 'fathom-client'
import { usePathname, useSearchParams } from 'next/navigation'
import { ThemeProvider, useTheme } from 'next-themes'
import type PostHog from 'posthog-js-lite'
import * as React from 'react'

import { bootstrap } from '@/lib/bootstrap-client'
import { fathomConfig, fathomId, posthogConfig, posthogId } from '@/lib/config'

const themeClassNames = { dark: 'dark-mode', light: 'light-mode' }

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      disableTransitionOnChange
      enableSystem
      value={themeClassNames}
    >
      <ThemeColor />

      <React.Suspense fallback={null}>
        <Analytics />
      </React.Suspense>

      {children}
    </ThemeProvider>
  )
}

function ThemeColor() {
  const { resolvedTheme } = useTheme()

  React.useEffect(() => {
    if (!resolvedTheme) {
      return
    }

    const themeColorMetas = Array.from(
      document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    )
    const originalContent = themeColorMetas.map((meta) => meta.content)
    const themeColor = resolvedTheme === 'dark' ? '#2d3439' : '#fefffe'

    for (const meta of themeColorMetas) {
      meta.content = themeColor
    }

    return () => {
      for (const [index, meta] of themeColorMetas.entries()) {
        meta.content = originalContent[index]!
      }
    }
  }, [resolvedTheme])

  return null
}

function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthogRef = React.useRef<PostHog | undefined>(undefined)
  const previousUrlRef = React.useRef<string | undefined>(undefined)
  const url = [pathname, searchParams?.toString()].filter(Boolean).join('?')

  React.useEffect(() => {
    let isDisposed = false

    bootstrap()

    if (fathomId) {
      Fathom.load(fathomId, fathomConfig)
    }

    const posthogApiKey = posthogId

    if (posthogApiKey) {
      void import('posthog-js-lite').then(({ default: PostHogClient }) => {
        if (isDisposed) {
          return
        }

        const posthog = new PostHogClient(posthogApiKey, posthogConfig)
        posthog.capture('$pageview')
        posthogRef.current = posthog
      })
    }

    return () => {
      isDisposed = true
      void posthogRef.current?._shutdown()
      posthogRef.current = undefined
    }
  }, [])

  React.useEffect(() => {
    if (previousUrlRef.current === undefined) {
      previousUrlRef.current = url
      return
    }

    if (previousUrlRef.current === url) {
      return
    }

    previousUrlRef.current = url

    if (fathomId) {
      Fathom.trackPageview()
    }

    posthogRef.current?.capture('$pageview')
  }, [url])

  return null
}
