import { host } from './config'

export function getSocialImageUrl(_pageId?: string | undefined) {
  // Always return the default OGP image
  return `${host}/ogp.png`
}
