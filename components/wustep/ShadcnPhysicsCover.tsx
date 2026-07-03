import styles from './ShadcnPhysicsCover.module.css'

export function ShadcnPhysicsCover() {
  return (
    <div className={styles.cover}>
      <div className={styles.stage} aria-hidden='true'>
        <span className={`${styles.token} ${styles.word}`}>shadcn/ui</span>
        <span className={`${styles.token} ${styles.slashes}`}>{'//'}</span>
      </div>
      <span className={styles.srOnly}>shadcn/ui + physics</span>
    </div>
  )
}
