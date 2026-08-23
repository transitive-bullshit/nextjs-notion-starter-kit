'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type * as types from '@/lib/types'

import { mainContentId } from './SkipLink'
import styles from './styles.module.css'

export function Page404({ pageId, error }: types.PageProps) {
  const pathname = usePathname()
  const missingPageId = pageId || pathname?.replace(/^\//, '')

  return (
    <div className={styles.container}>
      <main className={styles.main} id={mainContentId} tabIndex={-1}>
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

        <Link className={styles.recoveryLink} href='/'>
          <span aria-hidden='true'>←</span>
          Return Home
        </Link>

        <Image
          src='/404.png'
          alt='404 Not Found'
          className={styles.errorImage}
          width={1216}
          height={912}
          sizes='(max-width: 640px) 100vw, 640px'
        />
      </main>
    </div>
  )
}
