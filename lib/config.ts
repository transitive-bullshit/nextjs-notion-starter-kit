/**
 * Site-wide app configuration.
 *
 * This file pulls from the root "site.config.ts" as well as environment variables
 * for optional depenencies.
 */
import { parsePageId } from 'notion-utils'
import type posthog from 'posthog-js'

import { getEnv, getSiteConfig } from './get-config-value'
import { NavigationLink } from './site-config'
import {
  NavigationStyle,
  PageUrlOverridesInverseMap,
  PageUrlOverridesMap,
  Site
} from './types'

export const rootNotionPageId: string = parsePageId(
  getSiteConfig('rootNotionPageId'),
  { uuid: false }
)

if (!rootNotionPageId) {
  throw new Error('Config error invalid "rootNotionPageId"')
}

// if you want to restrict pages to a single notion workspace (optional)
export const rootNotionSpaceId: string | null = parsePageId(
  getSiteConfig('rootNotionSpaceId', null),
  { uuid: true }
)

export const pageUrlOverrides = cleanPageUrlMap(
  getSiteConfig('pageUrlOverrides', {}) || {},
  { label: 'pageUrlOverrides' }
)

export const pageUrlAdditions = cleanPageUrlMap(
  getSiteConfig('pageUrlAdditions', {}) || {},
  { label: 'pageUrlAdditions' }
)

export const inversePageUrlOverrides = invertPageUrlOverrides(pageUrlOverrides)

export const environment = process.env.NODE_ENV || 'development'
export const isDev = environment === 'development'

// general site config
export const name: string = getSiteConfig('name')
export const author: string = getSiteConfig('author')
export const domain: string = getSiteConfig('domain')
export const description: string = getSiteConfig('description', 'Notion Blog')
export const language: string = getSiteConfig('language', 'en')

// social accounts
export const twitter: string | null = getSiteConfig('twitter', null)
export const github: string | null = getSiteConfig('github', null)
export const youtube: string | null = getSiteConfig('youtube', null)
export const linkedin: string | null = getSiteConfig('linkedin', null)
export const newsletter: string | null = getSiteConfig('newsletter', null)
export const zhihu: string | null = getSiteConfig('zhihu', null)

// default notion values for site-wide consistency (optional; may be overridden on a per-page basis)
export const defaultPageIcon: string | null = getSiteConfig(
  'defaultPageIcon',
  null
)
export const defaultPageCover: string | null = getSiteConfig(
  'defaultPageCover',
  null
)
export const defaultPageCoverPosition: number = getSiteConfig(
  'defaultPageCoverPosition',
  0.5
)

// Optional whether or not to enable support for LQIP preview images
export const isPreviewImageSupportEnabled: boolean = getSiteConfig(
  'isPreviewImageSupportEnabled',
  false
)

// Optional whether or not to include the Notion ID in page URLs or just use slugs
export const includeNotionIdInUrls: boolean = getSiteConfig(
  'includeNotionIdInUrls',
  !!isDev
)

export const navigationStyle: NavigationStyle = getSiteConfig(
  'navigationStyle',
  'default'
)

export const navigationLinks: Array<NavigationLink | null> = getSiteConfig(
  'navigationLinks',
  null
)

// Optional site search
export const isSearchEnabled: boolean = getSiteConfig('isSearchEnabled', true)

// ----------------------------------------------------------------------------

// Optional redis instance for persisting preview images
export const isRedisEnabled: boolean =
  getSiteConfig('isRedisEnabled', false) || !!getEnv('REDIS_ENABLED', null)

// (if you want to enable redis, only REDIS_HOST and REDIS_PASSWORD are required)
// we recommend that you store these in a local `.env` file
export const redisHost: string | null = getEnv('REDIS_HOST', null)
export const redisPassword: string | null = getEnv('REDIS_PASSWORD', null)
export const redisUser: string = getEnv('REDIS_USER', 'default')
export const redisUrl = getEnv(
  'REDIS_URL',
  `redis://${redisUser}:${redisPassword}@${redisHost}`
)
export const redisNamespace: string | null = getEnv(
  'REDIS_NAMESPACE',
  'preview-images'
)

// ----------------------------------------------------------------------------

export const isServer = typeof window === 'undefined'

export const port = getEnv('PORT', '3000')
export const host = isDev ? `http://localhost:${port}` : `https://${domain}`
export const apiHost = isDev
  ? host
  : `https://${process.env.VERCEL_URL || domain}`

export const apiBaseUrl = `/api`

export const api = {
  searchNotion: `${apiBaseUrl}/search-notion`,
  getNotionPageInfo: `${apiBaseUrl}/notion-page-info`,
  getSocialImage: `${apiBaseUrl}/social-image`
}

// ----------------------------------------------------------------------------

export const site: Site = {
  domain,
  name,
  rootNotionPageId,
  rootNotionSpaceId,
  description
}

export const fathomId = isDev ? null : process.env.NEXT_PUBLIC_FATHOM_ID
export const fathomConfig = fathomId
  ? {
      excludedDomains: ['localhost', 'localhost:3000']
    }
  : undefined

export const posthogId = process.env.NEXT_PUBLIC_POSTHOG_ID
export const posthogConfig: posthog.Config = {
  api_host: 'https://app.posthog.com'
}

function cleanPageUrlMap(
  pageUrlMap: PageUrlOverridesMap,
  {
    label
  }: {
    label: string
  }
): PageUrlOverridesMap {
  return Object.keys(pageUrlMap).reduce((acc, uri) => {
    const pageId = pageUrlMap[uri]
    const uuid = parsePageId(pageId, { uuid: false })

    if (!uuid) {
      throw new Error(`Invalid ${label} page id "${pageId}"`)
    }

    if (!uri) {
      throw new Error(`Missing ${label} value for page "${pageId}"`)
    }

    if (!uri.startsWith('/')) {
      throw new Error(
        `Invalid ${label} value for page "${pageId}": value "${uri}" should be a relative URI that starts with "/"`
      )
    }

    const path = uri.slice(1)

    return {
      ...acc,
      [path]: uuid
    }
  }, {})
}

function invertPageUrlOverrides(
  pageUrlOverrides: PageUrlOverridesMap
): PageUrlOverridesInverseMap {
  return Object.keys(pageUrlOverrides).reduce((acc, uri) => {
    const pageId = pageUrlOverrides[uri]

    return {
      ...acc,
      [pageId]: uri
    }
  }, {})
}
