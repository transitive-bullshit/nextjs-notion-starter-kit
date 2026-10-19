'use client'

import * as React from 'react'

import { ErrorPage } from '@/components/ErrorPage'

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

  return (
    <html lang='en'>
      <body>
        <ErrorPage statusCode={500} onRetry={reset} />
      </body>
    </html>
  )
}
