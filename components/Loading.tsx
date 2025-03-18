import { LoadingIcon } from './LoadingIcon'
import styles from './styles.module.css'

export function Loading() {
  return (
    <div className={styles.container}>
      <p id='loading-message'>
        Fetching the latest contents from the&nbsp;
        <a
          href='https://ubiquitydao.notion.site/Ubiquity-DAO-ff1a3cae900941e49cc4d4458cc2867d'
          target='_blank'
          rel='noreferrer'
        >
          DAO&apos;s Notion
        </a>
        .
      </p>
      &nbsp;
      <LoadingIcon />
    </div>
  )
}
