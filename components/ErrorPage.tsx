import Image from 'next/image'

import { mainContentId } from './SkipLink'
import styles from './styles.module.css'

export function ErrorPage({
  statusCode,
  onRetry
}: {
  statusCode: number
  onRetry?: () => void
}) {
  return (
    <div className={styles.container}>
      <main className={styles.main} id={mainContentId} tabIndex={-1}>
        <h1>Error Loading Page</h1>

        {statusCode && <p>Error code: {statusCode}</p>}

        {onRetry && (
          <button type='button' onClick={onRetry}>
            Try again
          </button>
        )}

        <Image
          src='/error.png'
          alt='Error'
          className={styles.errorImage}
          width={912}
          height={912}
          sizes='(max-width: 640px) 100vw, 640px'
        />
      </main>
    </div>
  )
}
