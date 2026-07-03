import { api, host } from './config'
import { getErrorMessage } from './utils'

export function getSocialImageUrl(pageId: string | undefined) {
  try {
    const url = new URL(api.getSocialImage, host)

    if (pageId) {
      url.searchParams.set('id', pageId)
      return url.toString()
    }
  } catch (err: unknown) {
    console.warn('error invalid social image url', pageId, getErrorMessage(err))
  }

  return null
}
