'use client'

import * as React from 'react'

import { ErrorPage } from '@/components/ErrorPage'
import { SpecialPageShell } from '@/components/SpecialPageShell'

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

  return (
    <SpecialPageShell>
      <ErrorPage statusCode={500} onRetry={reset} />
    </SpecialPageShell>
  )
}
