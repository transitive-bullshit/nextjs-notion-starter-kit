import React from 'react'
import { PageHead } from './PageHead'

import styles from './styles.module.css'

export const ErrorPage: React.FC<{ statusCode: number }> = ({ statusCode }) => {
  const title = 'Error'

  return (
    <>
      <PageHead title={title} />

      <div className={styles.container}>
        <main className={styles.main}>
          <h1>Error Loading Page</h1>
          <p>Please try reading the source materials on our <a href="https://ubiquitydao.notion.site/Ubiquity-DAO-ff1a3cae900941e49cc4d4458cc2867d" target="_blank" rel="noreferrer">Notion</a>!</p>
          {statusCode && <p>Error code: {statusCode}</p>}
          <img src='/error.png' alt='Error' className={styles.errorImage} />
        </main>
      </div>
    </>
  )
}
