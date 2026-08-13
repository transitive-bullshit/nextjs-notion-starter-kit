import { type Block } from 'notion-types'
import { defaultMapImageUrl } from 'notion-utils'

import { defaultPageCover, defaultPageIcon } from './config'

/**
 * Notion file hosts that `www.notion.so/image/...` cannot proxy.
 * Wrapping these produces "Source image is unreachable" (HTTP 404) from the
 * image optimizer. Pass the signed file URL through instead.
 */
const NOTION_FILE_HOSTS = new Set([
  'file.notion.com',
  'file.notion.so',
  'img.notionusercontent.com'
])

export const isNotionFileHostUrl = (url: string): boolean => {
  try {
    return NOTION_FILE_HOSTS.has(new URL(url).hostname)
  } catch {
    return false
  }
}

export const mapImageUrl = (url: string | undefined, block: Block) => {
  if (url === defaultPageCover || url === defaultPageIcon) {
    return url
  }

  if (url && isNotionFileHostUrl(url)) {
    return url
  }

  return defaultMapImageUrl(url, block)
}
