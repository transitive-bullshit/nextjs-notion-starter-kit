import { Block } from 'notion-types'
import { defaultMapImageUrl } from 'react-notion-x'

import { apiHost, defaultPageCover, defaultPageIcon } from './config'

export const mapImageUrl = (url: string, block: Block) => {
  if (url === defaultPageCover || url === defaultPageIcon) {
    return url
  }

  try {
    const u = new URL(url)

    // Signed URLs are reoptimized by Vercel every time src changes,
    // so we use image Proxy to freeze the URLs.
    // Extract the block Id from the URL and pass it to the image proxy.
    if (u.hostname.startsWith('file.notion.so')) {
      return `${apiHost}/api/image-proxy/file.notion.so/${block.id}`
    }

    if (
      u.pathname.startsWith('/secure.notion-static.com') &&
      u.hostname.endsWith('.amazonaws.com')
    ) {
      // u.pathname = /secure.notion-static.com/a93b0b82-7783-4340-a60b-e072a885986b/untitled.jpg
      const fileId = u.pathname.split('/')[2]
      const fileName = u.pathname.split('/')[3]

      return `${apiHost}/api/image-proxy/secure.notion-static.com/${block.id}/${fileId}/${fileName}`
    }
  } catch {
    // ignore invalid urls
  }

  return defaultMapImageUrl(url, block)
}
