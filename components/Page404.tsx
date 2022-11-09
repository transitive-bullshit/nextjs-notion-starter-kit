import React from 'react'
import * as types from 'lib/types'
import { PageHead } from './PageHead'

import styles from './styles.module.css'

export const Page404: React.FC<types.PageProps> = ({ site, pageId, error }) => {
  const title = site?.name || 'Notion Page Not Found'

  const errorText = 
    error?.message || 
    (pageId ? 
      `Make sure that Notion page "${pageId}" is publicly accessible` : 
      "We can't seem to find the page you're looking for") 

  return (
    <>
      <PageHead site={site} title={title} />

      <div className={`${styles.container} notion-h-title`}>
        <main className={styles.main}>
          <div className={styles.page404}>
            <div>
              <h1>Oops!</h1>
              <p>{errorText}</p>
              <p>
                <b>Here are some helpful links instead:</b>
              </p>
              <ul>
                <li>
                  <a href="//github.com/ubiquity/ubiquity-dollar/wiki" target="_blank" rel="noreferrer">Docs</a>
                </li>
                <li>
                  <a href="//dao.ubq.fi/faq" target="_blank" rel="noreferrer">FAQ</a>
                </li>
                <li>
                  <a href="//github.com/ubiquity/ubiquity-dollar" target="_blank" rel="noreferrer">Github</a>
                </li>
                <li>
                  <a href="//discord.gg/SjymJ5maJ4" target="_blank" rel="noreferrer">Discord</a>
                </li>
                <li>
                  <a href="//t.me/ubiquitydao" target="_blank" rel="noreferrer">Telegram</a>
                </li>
                <li>
                  <a href="//twitter.com/UbiquityDAO" target="_blank" rel="noreferrer">Twitter</a>
                </li>
              </ul>
            </div>
            <div>
              <h1>
                404
              </h1>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
