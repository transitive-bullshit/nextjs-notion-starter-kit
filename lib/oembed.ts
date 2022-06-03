import { parsePageId, getPageTitle } from 'notion-utils'
import { getPage } from './notion'
import * as config from './config'

export const oembed = async ({
  url,
  maxWidth,
  maxHeight,
  dark = false
}: {
  url: string
  maxWidth?: number
  maxHeight?: number
  dark?: boolean
}) => {
  // TODO: handle pages with no pageId via domain
  const pageId = parsePageId(url)

  let title = config.name
  let authorName = config.author

  // TODO: handle errors gracefully

  const page = await getPage(pageId)
  const pageTitle = getPageTitle(page)
  if (pageTitle) title = pageTitle

  const user = page.notion_user[Object.keys(page.notion_user)[0]]?.value
  const name = [user.given_name, user.family_name]
    .filter(Boolean)
    .join(' ')
    .trim()
  if (name) authorName = name

  const params: any = { lite: 'true' }
  if (dark) {
    params.dark = 'true'
  }

  const query = new URLSearchParams(params).toString()
  const embedUrl = `${config.host}/${pageId}?${query}`
  const defaultWidth = 800
  const defaultHeight = 600
  const width = maxWidth ? Math.min(maxWidth, defaultWidth) : defaultWidth
  const height = maxHeight ? Math.min(maxHeight, defaultHeight) : defaultHeight

  return {
    version: '1.0',
    type: 'rich',
    provider_name: config.author,
    provider_url: config.host,
    title,
    author_name: authorName,
    url,
    // TODO
    // thumbnail_url: 'https://repl.it/public/images/replit-logo-800x600.png',
    // thumbnail_width: 800,
    // thumbnail_height: 600,
    width,
    height,
    html: `<iframe src="${embedUrl}" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts" width="${width}" height="${height}" frameborder="0"></iframe>`
  }
}
