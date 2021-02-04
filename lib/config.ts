/**
 * Site-wide app configuration.
 *
 * This file pulls from the root "site.config.js" as well as environment variables
 * for optional depenencies.
 */

import { parsePageId } from 'notion-utils'
import { getSiteConfig, getEnv } from './get-config-value'

// where it all starts -- the site's root Notion page
export const rootNotionPageId: string = parsePageId(
  getSiteConfig('rootNotionPageId', 'ROOT_NOTION_PAGE_ID'),
  { uuid: false }
)

if (!rootNotionPageId) {
  throw new Error('Config error invalid "rootNotionPageId"')
}

// if you want to restrict pages to a single notion workspace (optional)
export const rootNotionSpaceId: string | null = parsePageId(
  getSiteConfig('rootNotionSpaceId', 'ROOT_NOTION_SPACE_ID', null),
  { uuid: true }
)

// general site config
export const name: string = getSiteConfig('name', 'SITE_NAME')
export const author: string = getSiteConfig('author', 'SITE_AUTHOR')
export const domain: string = getSiteConfig('domain', 'SITE_DOMAIN')
export const description: string = getSiteConfig(
  'description',
  'SITE_DESCRIPTION',
  'Notion Blog'
)

// social accounts
export const twitter: string | null = getSiteConfig(
  'twitter',
  'SITE_TWITTER',
  null
)
export const github: string | null = getSiteConfig(
  'github',
  'SITE_GITHUB',
  null
)
export const linkedin: string | null = getSiteConfig(
  'linkedin',
  'SITE_LINKEDIN',
  null
)

export const socialImageTitle: string | null = getSiteConfig(
  'socialImageTitle',
  'SOCIAL_IMAGE_TITLE',
  null
)
export const socialImageSubtitle: string | null = getSiteConfig(
  'socialImageSubtitle',
  'SOCIAL_IMAGE_SUBTITLE',
  null
)

// default notion values for site-wide consistency (optional; may be overridden on a per-page basis)
export const defaultPageIcon: string | null = getSiteConfig(
  'defaultPageIcon',
  'DEFAULT_PAGE_ICON',
  null
)
export const defaultPageCover: string | null = getSiteConfig(
  'defaultPageCover',
  'DEFAULT_PAGE_COVER',
  null
)
export const defaultPageCoverPosition: number = getSiteConfig(
  'defaultPageCoverPosition',
  null,
  0.5
)

// Optional utteranc.es comments via GitHub issue comments
export const utterancesGitHubRepo: string | null = getSiteConfig(
  'utterancesGitHubRepo',
  'UTTERANCES_GITHUB_REPO',
  null
)

// Optional image CDN host to proxy all image requests through
export const imageCDNHost: string | null = getSiteConfig(
  'imageCDNHost',
  'IMAGE_CDN_HOST',
  null
)

// Optional whether or not to enable support for LQIP preview images
// (requires a Google Firebase collection)
export const isPreviewImageSupportEnabled: boolean = getSiteConfig(
  'isPreviewImageSupportEnabled',
  null,
  false
)

// ----------------------------------------------------------------------------

export const isDev =
  process.env.NODE_ENV === 'development' || !process.env.NODE_ENV

export const isServer = typeof window === 'undefined'

export const port = getEnv('PORT', '3000')
export const host = isDev ? `http://localhost:${port}` : `https://${domain}`

export const apiBaseUrl = `${host}/api`

export const api = {
  createPreviewImage: `${apiBaseUrl}/create-preview-image`,
  searchNotion: `${apiBaseUrl}/search-notion`,
  renderSocialImage: (pageId) => `${apiBaseUrl}/render-social-image/${pageId}`
}

// ----------------------------------------------------------------------------

export const fathomId = isDev ? null : process.env.NEXT_PUBLIC_FATHOM_ID

export const fathomConfig = fathomId
  ? {
      excludedDomains: ['localhost', 'localhost:3000']
    }
  : undefined

const defaultEnvValueForPreviewImageSupport =
  isPreviewImageSupportEnabled && isServer ? undefined : null

export const googleProjectId = getEnv(
  'GCLOUD_PROJECT',
  defaultEnvValueForPreviewImageSupport
)

export const googleApplicationCredentials = getGoogleApplicationCredentials()

export const firebaseCollectionImages = getEnv(
  'FIREBASE_COLLECTION_IMAGES',
  defaultEnvValueForPreviewImageSupport
)

// this hack is necessary because vercel doesn't support secret files so we need to encode our google
// credentials a base64-encoded string of the JSON-ified content
function getGoogleApplicationCredentials() {
  if (!isPreviewImageSupportEnabled || !isServer) {
    return null
  }

  try {
    const googleApplicationCredentialsBase64 = getEnv(
      'GOOGLE_APPLICATION_CREDENTIALS',
      defaultEnvValueForPreviewImageSupport
    )

    return JSON.parse(
      Buffer.from(googleApplicationCredentialsBase64, 'base64').toString()
    )
  } catch (err) {
    console.error(
      'Firebase config error: invalid "GOOGLE_APPLICATION_CREDENTIALS" should be base64-encoded JSON\n'
    )

    throw err
  }
}
