import 'server-only'

import type { Metadata } from 'next'
import { type PageBlock } from 'notion-types'
import { getBlockTitle, getBlockValue, getPageProperty } from 'notion-utils'

import type { PageProps } from './types'
import * as config from './config'
import { getSocialImageUrl } from './get-social-image-url'
import { mapImageUrl } from './map-image-url'
import { getCanonicalPageUrl } from './map-page-url'

export interface PageMetadataInfo {
  canonicalPageUrl?: string
  description: string
  isBlogPost: boolean
  socialImageUrl?: string
  title: string
}

export function getPageMetadataInfo({
  site,
  recordMap,
  pageId
}: PageProps): PageMetadataInfo {
  const keys = Object.keys(recordMap?.block || {})
  const block = getBlockValue(recordMap?.block?.[keys[0]!])
  const title =
    (block && recordMap && getBlockTitle(block, recordMap)) ||
    site?.name ||
    config.name
  const description =
    (block &&
      recordMap &&
      getPageProperty<string>('Description', block, recordMap)) ||
    site?.description ||
    config.description
  const isBlogPost =
    block?.type === 'page' && block.parent_table === 'collection'
  const image = block
    ? mapImageUrl(
        getPageProperty<string>('Social Image', block, recordMap!) ||
          (block as PageBlock).format?.page_cover ||
          config.defaultPageCover,
        block
      )
    : undefined
  const socialImageUrl = getSocialImageUrl(pageId) || image || undefined
  const canonicalPageUrl =
    !config.isDev && site && recordMap && pageId
      ? getCanonicalPageUrl(site, recordMap)(pageId)
      : undefined

  return {
    canonicalPageUrl,
    description,
    isBlogPost,
    socialImageUrl,
    title
  }
}

export function createPageMetadata(pageProps: PageProps): Metadata {
  if (pageProps.error) {
    return {
      title: 'Notion Page Not Found'
    }
  }

  const { canonicalPageUrl, description, socialImageUrl, title } =
    getPageMetadataInfo(pageProps)
  const { site } = pageProps

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true
    },
    alternates: {
      canonical: canonicalPageUrl,
      types: {
        'application/rss+xml': [
          {
            url: '/feed',
            title: site?.name || config.name
          }
        ]
      }
    },
    openGraph: {
      type: 'website',
      siteName: site?.name || config.name,
      title,
      description,
      url: canonicalPageUrl,
      images: socialImageUrl ? [socialImageUrl] : undefined
    },
    twitter: {
      card: socialImageUrl ? 'summary_large_image' : 'summary',
      creator: config.twitter ? `@${config.twitter}` : undefined,
      title,
      description,
      images: socialImageUrl ? [socialImageUrl] : undefined
    },
    other: site?.domain
      ? {
          'twitter:domain': site.domain
        }
      : undefined
  }
}
