import 'server-only'

import { notFound } from 'next/navigation'
import type { ComponentType } from 'react'

import type { PageProps } from '@/lib/types'
import { author } from '@/lib/config'
import { getPageMetadataInfo } from '@/lib/page-metadata'

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
    ? JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': canonicalPageUrl ? `${canonicalPageUrl}#BlogPosting` : undefined,
        mainEntityOfPage: canonicalPageUrl,
        url: canonicalPageUrl,
        headline: title,
        name: title,
        description,
        author: {
          '@type': 'Person',
          name: author
        },
        image: socialImageUrl
      }).replaceAll('<', '\\u003c')
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
