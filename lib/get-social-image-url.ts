import { host } from './config'

export function getSocialImageUrl(pageId: string) {
  try {
    // Use a single, static Open Graph image for the whole site.
    // Add a version parameter to bust caches on social platforms.
    const url = new URL('/images/og-preview.png', host)
    url.searchParams.set('v', '2')
    return url.toString()
  } catch (err) {
    console.warn('error invalid social image url', pageId, (err as any).message)
  }

  return null
}
