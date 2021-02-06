import 'server-only'

import { notFound } from 'next/navigation'
import type { ComponentType } from 'react'

import type { PageProps } from '@/lib/types'
import { createBlogPostingJsonLd, serializeJsonLd } from '@/lib/json-ld'
import { getCanonicalPageUrl } from '@/lib/map-page-url'
import { getPageMetadataInfo } from '@/lib/page-metadata'
import { siteIdentity } from '@/lib/site-identity'

import type { NotionPageProps } from './NotionPage'

export function NotionPageRoute({
  pageProps,
  pageComponent: PageComponent,
  isLiteMode = false
}: {
  pageProps: PageProps
  pageComponent: ComponentType<NotionPageProps>
  isLiteMode?: boolean
}) {
  const { error, pageId, recordMap, site } = pageProps

  if (error || !pageId || !recordMap || !site) {
    notFound()
  }

  const { canonicalPageUrl, description, isBlogPost, socialImageUrl, title } =
    getPageMetadataInfo(pageProps)
  const jsonLd = isBlogPost
    ? serializeJsonLd(
        createBlogPostingJsonLd(siteIdentity, {
          description,
          imageUrl: socialImageUrl,
          title,
          url: canonicalPageUrl ?? getCanonicalPageUrl(site, recordMap)(pageId)
        })
      )
    : undefined

  return (
    <>
      {jsonLd && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}

      <PageComponent
        pageId={pageId}
        recordMap={recordMap}
        site={site}
        isLiteMode={isLiteMode}
      />
    </>
  )
}
