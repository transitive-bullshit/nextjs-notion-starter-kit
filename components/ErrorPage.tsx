import * as config from '@/lib/config'

import styles from './Page404.module.css'
import { PageHead } from './PageHead'

export function ErrorPage({ statusCode }: { statusCode?: number }) {
  const code = statusCode ?? 500
  const title = `Error ${code}`
  const description =
    code === 500
      ? "Something went wrong on our end. We're looking into it."
      : 'An unexpected error occurred. Please try again later.'

  return (
    <>
      <PageHead title={title} />

      <div className={styles.page}>
        <div className={styles.content}>
          <p className={styles.code}>{code}</p>

          <div className={styles.divider} />

          <h1 className={styles.heading}>Something went wrong</h1>

          <p className={styles.description}>{description}</p>

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
        </div>
      </div>
    </>
  )
}
