import { host } from './config'

export function getSocialImageUrl(pageId: string) {
  try {
    // Use a single, static Open Graph image for the whole site.
    // Add a version parameter to bust caches on social platforms.
    const envUrl =
      process.env.NEXT_PUBLIC_DEPLOY_URL ||
      process.env.RENDER_EXTERNAL_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : null)

    const base = envUrl || host
    const url = new URL('/images/og-preview.png', base)
    const version = process.env.NEXT_PUBLIC_OG_VERSION || '3'
    url.searchParams.set('v', version)
    return url.toString()
  } catch (err) {
    console.warn('error invalid social image url', pageId, (err as any).message)
  }

  return null
}
