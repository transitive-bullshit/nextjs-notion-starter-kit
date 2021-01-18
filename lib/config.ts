/**
 * Site-wide app configuration.
 *
 * @see env.ts for config relating to third-party dependencies.
 */

import { getEnv } from './get-env'

// this is the most important config value which specifies the site's root Notion page
export const rootNotionPageId = '78fc5a4b88d74b0e824e29407e9f1ec1'

// general site config
export const siteName = 'Transitive Bullshit'
export const siteAuthor = 'Travis Fischer'
export const siteAuthorTwitter = 'transitive_bs'
export const siteDomain = 'transitivebullsh.it'
export const siteDescription =
  'Personal site of Travis Fischer aka Transitive Bullshit'
export const siteFavicon = `https://${siteDomain}/favicon.png`
export const socialImageTitle = 'Transitive Bullshit'
export const socialImageSubtitle = 'Hello World! 👋'

// default notion values for site-wide consistency (may be overridden on a per-page basis)
export const defaultPageIcon =
  'https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F797768e4-f24a-4e65-bd4a-b622ae9671dc%252Fprofile-2020-280w-circle.png%3Ftable%3Dblock%26id%3D78fc5a4b-88d7-4b0e-824e-29407e9f1ec1%26cache%3Dv2'
export const defaultPageCover =
  'https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F9fc5ecae-2b4b-4e73-b0d4-918c829ba69f%252FIMG_0259-opt.jpg%3Ftable%3Dblock%26id%3D78fc5a4b-88d7-4b0e-824e-29407e9f1ec1%26cache%3Dv2'
export const defaultPageCoverPosition = 0.1862

// ----------------------------------------------------------------------------

export const isDev =
  process.env.NODE_ENV === 'development' || !process.env.NODE_ENV

export const port = getEnv('PORT', '3000')
export const host = isDev ? `http://localhost:${port}` : `https://${siteDomain}`

export const apiBaseUrl = `${host}/api`

export const api = {
  createPreviewImage: `${apiBaseUrl}/create-preview-image`,
  searchNotion: `${apiBaseUrl}/search-notion`,
  renderSocialImage: (pageId) => `${apiBaseUrl}/render-social-image/${pageId}`
}

export const fathomId = isDev ? null : getEnv('FATHOM_ID', null)

export const fathomConfig = fathomId
  ? {
      excludedDomains: ['localhost', 'localhost:3000']
    }
  : undefined
