import styles from './skip-link.module.css'

export const mainContentId = 'main-content'

export function SkipLink() {
  return (
    <a className={styles.link} href={`#${mainContentId}`}>
      Skip to Main Content
    </a>
  )
}

export function MainContentTarget() {
  return <div className={styles.target} id={mainContentId} tabIndex={-1} />
}
