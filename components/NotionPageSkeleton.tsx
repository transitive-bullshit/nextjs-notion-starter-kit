import styles from './NotionPageSkeleton.module.css'

const LINE_WIDTHS = [92, 100, 97, 88, 100, 62]

/**
 * Article-shaped placeholder shown while ISR generates an uncached Notion
 * page. Uses the wustep (--w-*) tokens so it is dark-mode aware; the global
 * prefers-reduced-motion rule freezes the pulse.
 */
export function NotionPageSkeleton() {
  return (
    <div className={styles.page} role='status' aria-label='Loading page'>
      <div className={styles.column}>
        <div className={styles.icon} />
        <div className={styles.title} />
        <div className={styles.meta} />
        <div className={styles.divider} />
        {LINE_WIDTHS.map((width, i) => (
          <div key={i} className={styles.line} style={{ width: `${width}%` }} />
        ))}
      </div>
    </div>
  )
}
