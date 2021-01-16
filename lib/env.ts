/**
 * All app config that needs to be available server-side.
 *
 * @see config.ts for client-side version.
 */

import { getEnv } from './get-env'
import { isDev } from './config'

export * from './config'

export const port = getEnv('PORT', '3000')
export const domain = getEnv('DOMAIN')
export const host = isDev ? `http://localhost:${port}` : `https://${domain}`

export const apiBaseUrl = `${host}/api`
export const api = {
  createPreviewImage: `${apiBaseUrl}/create-preview-image`,
  searchNotion: `${apiBaseUrl}/search-notion`
}

export const googleProjectId = getEnv('GCLOUD_PROJECT')

export let googleApplicationCredentials

// this hack is necessary because vercel doesn't support secret files so we need to encode our google
// credentials a base64-encoded string of the JSON-ified content
try {
  const googleApplicationCredentialsBase64 = getEnv(
    'GOOGLE_APPLICATION_CREDENTIALS'
  )
  googleApplicationCredentials = JSON.parse(
    Buffer.from(googleApplicationCredentialsBase64, 'base64').toString()
  )
} catch (err) {
  console.error(
    'Firebase config error: invalid "GOOGLE_APPLICATION_CREDENTIALS" should be base64-encoded JSON\n'
  )
  throw err
}

export const firebaseCollectionImages = getEnv('FIREBASE_COLLECTION_IMAGES')

export const notionRootPageId = getEnv('NOTION_ROOT_PAGE_ID')

export const siteName = getEnv('SITE_NAME', 'Transitive Bullshit')
export const siteDesc = getEnv(
  'SITE_DESC',
  'Personal site of Travis Fischer aka Transitive Bullshit.'
)
export const siteImage = getEnv('SITE_IMAGE', '/social.jpg')
export const siteFavicon = getEnv('SITE_FAVICON', '/favicon.png')
export const siteAuthor = getEnv('SITE_AUTHOR', 'Travis Fischer')
