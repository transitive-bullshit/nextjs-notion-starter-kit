import React from 'react'
import * as types from 'lib/types'
import { PageHead } from './PageHead'

import styles from './styles.module.css'

export const Page404: React.FC<types.PageProps> = ({ site, pageId, error }) => {
  const title = site?.name || 'Notion Page Not Found'

  const errorText =
    error?.message ||
    (pageId
      ? `Make sure that Notion page "${pageId}" is publicly accessible`
      : "We can't seem to find the page you're looking for")

  const aStyle = {
    textDecoration: 'none',
    //,   // position: "relative"
    // ,   // top: "0"
    // ,   // borderBottom: "none"
    // ,   lineHeight: "1"
    textRendering: 'geometricPrecision',
    fontSmoothing: 'subpixelAntialiased',
    fontWeight: '600',
    fontSize: '12px',
    display: 'inlineBlock',
    maxHeight: '36px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    width: '100%'
  }

  return (
    <>
      <PageHead site={site} title={title} />

      <div className={`${styles.container} notion-h-title`}>
        <main className={styles.main}>
          <div className={styles.page404}>
            <div>
              <h1>Sorry!</h1>
              <p>{errorText}</p>
              <p>
                <b>Here are some helpful links instead:</b>
              </p>
              <ul>
                <li>
                  <a
                    style={aStyle}
                    className='notion-page-link'
                    href='//github.com/ubiquity/ubiquity-dollar/wiki'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Docs
                  </a>
                </li>
                <li>
                  <a
                    style={aStyle}
                    className='notion-page-link'
                    href='//dao.ubq.fi/faq'
                    target='_blank'
                    rel='noreferrer'
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    style={aStyle}
                    className='notion-page-link'
                    href='//github.com/ubiquity/ubiquity-dollar'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Github
                  </a>
                </li>
                <li>
                  <a
                    style={aStyle}
                    className='notion-page-link'
                    href='//discord.gg/SjymJ5maJ4'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    style={aStyle}
                    className='notion-page-link'
                    href='//t.me/ubiquitydao'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Telegram
                  </a>
                </li>
                <li>
                  <a
                    style={aStyle}
                    className='notion-page-link'
                    href='//twitter.com/UbiquityDAO'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h1>404</h1>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
