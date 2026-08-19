'use client'

import * as React from 'react'

import { ErrorPage } from '@/components/ErrorPage'

const LazySpecialPageShell = React.lazy(async () => {
  const { SpecialPageShell } = await import('@/components/SpecialPageShell')

  return { default: SpecialPageShell }
})

class GlobalErrorChromeBoundary extends React.Component<
  React.PropsWithChildren<{ fallback: React.ReactNode }>,
  { hasError: boolean }
> {
  override state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  override componentDidCatch(chromeError: unknown) {
    console.error('Failed to render global error chrome', chromeError)
  }

  override render() {
    if (this.state.hasError) return this.props.fallback

    return this.props.children
  }
}

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error(error)
  }, [error])

  const errorPage = <ErrorPage statusCode={500} onRetry={reset} />

  return (
    <html lang='en'>
      <body
        style={{
          margin: 0,
          color: '#f0eee6',
          background: '#080908'
        }}
      >
        <GlobalErrorChromeBoundary fallback={errorPage}>
          <React.Suspense fallback={errorPage}>
            <LazySpecialPageShell>{errorPage}</LazySpecialPageShell>
          </React.Suspense>
        </GlobalErrorChromeBoundary>
      </body>
    </html>
  )
}
