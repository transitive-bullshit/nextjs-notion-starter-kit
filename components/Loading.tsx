import { LoadingIcon } from './LoadingIcon'
import { mainContentId } from './SkipLink'
import styles from './styles.module.css'

export function Loading() {
  return (
    <main className={styles.container} id={mainContentId} tabIndex={-1}>
      <div
        className={styles.loadingStatus}
        role='status'
        aria-atomic='true'
        aria-live='polite'
      >
        <LoadingIcon />
        <span className={styles.visuallyHidden}>Loading…</span>
      </div>
    </main>
  )
}
