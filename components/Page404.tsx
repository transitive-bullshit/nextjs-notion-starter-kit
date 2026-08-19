'use client'

import { usePathname } from 'next/navigation'

import type * as types from '@/lib/types'

import styles from './styles.module.css'

export function Page404({ pageId, error }: types.PageProps) {
  const pathname = usePathname()
  const missingPageId = pageId || pathname?.replace(/^\//, '')

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Notion Page Not Found</h1>

        {error ? (
          <p>{error.message}</p>
        ) : (
          missingPageId && (
            <p>
              Make sure that Notion page &quot;{missingPageId}&quot; is publicly
              accessible.
            </p>
          )
        )}

        <img src='/404.png' alt='404 Not Found' className={styles.errorImage} />
      </main>
    </div>
  )
}
