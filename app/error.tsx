'use client'

import * as React from 'react'

import { ErrorPage } from '@/components/ErrorPage'

export default function ErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error(error)
  }, [error])

  return <ErrorPage statusCode={500} onRetry={reset} />
}
