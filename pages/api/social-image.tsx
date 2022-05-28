import * as React from 'react'
import { withOGImage } from 'next-api-og-image'

import {
  getBlockTitle,
  getBlockIcon,
  getPageProperty,
  isUrl,
  parsePageId
} from 'notion-utils'
import { PageBlock } from 'notion-types'

import { notion } from 'lib/notion-api'
import { mapImageUrl } from 'lib/map-image-url'
import { interRegular } from 'lib/fonts'
import * as config from 'lib/config'

/**
 * Social image generation via headless chrome.
 *
 * Note: To debug social images, set `debugInspectHtml` to true and load a social
 * image URL. Instead of returning the rendered image, it will return the raw HTML
 * that would've been passed to puppeteer. This makes it much easier to develop
 * and debug issues locally.
 */
const debugInspectHtml = false

export default withOGImage<'query', 'id'>({
  template: {
    react: async ({ id }) => {
      const pageId = parsePageId(id)

      if (!pageId) {
        throw new Error('Invalid notion page id')
      }

      const recordMap = await notion.getPage(pageId)

      const keys = Object.keys(recordMap?.block || {})
      const block = recordMap?.block?.[keys[0]]?.value

      if (!block) {
        throw new Error('Invalid recordMap for page')
      }

      const isBlogPost =
        block.type === 'page' && block.parent_table === 'collection'
      const title = getBlockTitle(block, recordMap) || config.name
      const image = mapImageUrl(
        getPageProperty<string>('Social Image', block, recordMap) ||
          (block as PageBlock).format?.page_cover ||
          config.defaultPageCover,
        block
      )

      const imageCoverPosition =
        (block as PageBlock).format?.page_cover_position ??
        config.defaultPageCoverPosition
      const imageObjectPosition = imageCoverPosition
        ? `center ${(1 - imageCoverPosition) * 100}%`
        : null

      const blockIcon = getBlockIcon(block, recordMap)
      const authorImage = mapImageUrl(
        blockIcon && isUrl(blockIcon) ? blockIcon : config.defaultPageIcon,
        block
      )

      const author =
        getPageProperty<string>('Author', block, recordMap) || config.author

      // const socialDescription =
      //   getPageProperty<string>('Description', block, recordMap) ||
      //   config.description

      const lastUpdatedTime = getPageProperty<number>(
        'Last Updated',
        block,
        recordMap
      )
      const publishedTime = getPageProperty<number>(
        'Published',
        block,
        recordMap
      )
      const dateUpdated = lastUpdatedTime
        ? new Date(lastUpdatedTime)
        : publishedTime
        ? new Date(publishedTime)
        : undefined
      const date =
        isBlogPost && dateUpdated
          ? `${dateUpdated.toLocaleString('en-US', {
              month: 'long'
            })} ${dateUpdated.getFullYear()}`
          : undefined
      const detail = date || config.domain

      return (
        <html>
          <head>
            <style dangerouslySetInnerHTML={{ __html: style }} />
          </head>

          <body>
            <div className='container'>
              <div className='horiz'>
                <div className='lhs'>
                  <div className='main'>
                    <h1 className='title'>{title}</h1>
                  </div>

                  <div className='metadata'>
                    {authorImage && (
                      <div
                        className='author-image'
                        style={{ backgroundImage: `url(${authorImage})` }}
                      />
                    )}

                    {(author || detail) && (
                      <div className='metadata-rhs'>
                        {author && <div className='author'>{author}</div>}
                        {detail && <div className='detail'>{detail}</div>}
                      </div>
                    )}
                  </div>
                </div>

                {image && (
                  <img
                    src={image}
                    className='rhs'
                    style={{
                      objectPosition: imageObjectPosition || undefined
                    }}
                  />
                )}
              </div>
            </div>
          </body>
        </html>
      )
    }
  },
  cacheControl: 'max-age=0, s-maxage=86400, stale-while-revalidate=3600',
  type: 'jpeg',
  quality: 75,
  dev: {
    inspectHtml: debugInspectHtml
  }
})

const style = `
@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: normal;
  src: url(data:font/woff2;charset=utf-8;base64,${interRegular}) format('woff2');
}

:root {
  --padding: 8vmin;
}

* {
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  padding: 0;
  margin: 0;
}

.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--padding);
  background: #1F2027;
  color: #fff;
}

.horiz {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: var(--padding);
  width: 100%;
  height: 100%;
}

.lhs {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.rhs {
  width: 35%;
  height: 100%;
  border-radius: 4px;
  object-fit: cover;
}

.title {
  font-size: 3.2em;
  line-height: 1.3;
}

.metadata {
  color: #A9ACC0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: calc(var(--padding) * 0.7);
  font-size: 1.5em;
}

.author {
  font-size: 1.75em;
}

.author-image {
  background-size: cover;
  width: 20vmin;
  min-width: 20vmin;
  max-width: 20vmin;
  height: 20vmin;
  min-height: 20vmin;
  max-height: 20vmin;
  border-radius: 50%;
  border: 1.5vmin solid #fff;
}

.metadata-rhs {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5em;
}

.detail {
  overflow-wrap: break-word;
}
`
