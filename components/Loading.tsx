import { LoadingIcon } from './LoadingIcon'
import styles from './styles.module.css'

export function Loading() {
  return (
    <div className={styles.container}>
      <LoadingIcon />
    </div>
  )
}
