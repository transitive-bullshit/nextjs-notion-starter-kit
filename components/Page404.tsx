import * as React from 'react'

import * as types from '@/lib/types'

import { PageHead } from './PageHead'
import styles from './styles.module.css'

export const Page404: React.FC<types.PageProps> = ({ site, pageId, error }) => {
  const title = site?.name || 'Notion Page Not Found'

  return (
    <>
      <PageHead site={site} title={title} />

      <div className={styles.container}>
        <main className={styles.notFoundPage}>
          <h1>Lost?</h1>
          <h2>We haven't made this page yet...</h2>  
          <button onClick={() => window.location.href = '/'}>GO BACK HOME 🌱</button>

          {error ? (
            <p>Problem: {error.message}</p>
          ) : (
            pageId && (
              <p>
                Make sure that Notion page &quot;{pageId}&quot; is publicly
                accessible.
              </p>
            )
          )}


        </main>
      </div>
    </>
  )
}
