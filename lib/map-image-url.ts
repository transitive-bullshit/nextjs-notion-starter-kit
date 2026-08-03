import { type Block } from 'notion-types'
import { defaultMapImageUrl } from 'notion-utils'

import { defaultPageCover, defaultPageIcon } from './config'

export const mapImageUrl = (url: string | undefined, block: Block) => {
  if (!url) {
    return undefined
  }

  if (url === defaultPageCover || url === defaultPageIcon) {
    return url
  }

  // Pass through external URLs directly (e.g. R2-hosted cover images)
  // instead of proxying them through Notion's image CDN which breaks external URLs
  try {
    const u = new URL(url)
    if (
      u.protocol === 'https:' &&
      !u.hostname.endsWith('notion.so') &&
      !u.hostname.endsWith('notion-static.com') &&
      !u.hostname.endsWith('amazonaws.com') &&
      !u.hostname.endsWith('notionusercontent.com')
    ) {
      return url
    }
  } catch {
    // not a valid URL, fall through to default handling
  }

  return defaultMapImageUrl(url, block)
}
