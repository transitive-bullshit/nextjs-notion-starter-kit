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
      <main className={styles.main}>
        <h1>Error Loading Page</h1>

        {statusCode && <p>Error code: {statusCode}</p>}

        {onRetry && (
          <button type='button' onClick={onRetry}>
            Try again
          </button>
        )}

        <img src='/error.png' alt='Error' className={styles.errorImage} />
      </main>
    </div>
  )
}
