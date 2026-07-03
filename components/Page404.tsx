import type * as types from '@/lib/types'
import * as config from '@/lib/config'

import styles from './Page404.module.css'
import { PageHead } from './PageHead'

export function Page404({ site, pageId, error }: types.PageProps) {
  const title = site?.name || 'Page Not Found'

  return (
    <>
      <PageHead site={site} title={title} />

      <div className={styles.page}>
        <div className={styles.content}>
          <p className={styles.code}>404</p>

          <div className={styles.divider} />

          <h1 className={styles.heading}>Page not found</h1>

          <p className={styles.description}>
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>

          <a className={styles.homeLink} href={config.host}>
            <svg
              viewBox='0 0 16 16'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M10 3L5 8l5 5' />
            </svg>
            Back home
          </a>

          {config.isDev && (
            <div className={styles.devError}>
              {error ? (
                <p>{error.message}</p>
              ) : (
                pageId && (
                  <p>
                    Notion page &quot;{pageId}&quot; is not publicly accessible.
                  </p>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
