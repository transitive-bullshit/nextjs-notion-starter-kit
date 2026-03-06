import { type Block, type ExtendedRecordMap } from 'notion-types'
import { defaultMapImageUrl } from 'notion-utils'

import { defaultPageCover, defaultPageIcon } from './config'

export const mapImageUrl = (url: string | undefined, block: Block) => {
  if (url === defaultPageCover || url === defaultPageIcon) {
    return url
  }

  return defaultMapImageUrl(url, block)
}

export const customMapImageUrl = (url: string | undefined, block: Block, recordMap?: ExtendedRecordMap) => {
  if (!url) {
    return undefined
  }

  if (url === defaultPageCover || url === defaultPageIcon) {
    return url
  }

  if (recordMap?.signed_urls?.[block.id]) {
    return recordMap.signed_urls[block.id]
  }

  const result = defaultMapImageUrl(url, block)

  // check if Notion generated a file.notion.so URL with no access
  // due to unhandled collection schema property images
  if (result && url.startsWith('https://s3.us-west-2.amazonaws.com/')) {
    const rawUrl = new URL(url)
    const encodedUrl = encodeURIComponent(rawUrl.toString())
    return `https://www.notion.so/image/${encodedUrl}?table=${block.parent_table === 'space' ? 'block' : block.parent_table}&id=${block.id}&cache=v2`
  }

  return result
}
