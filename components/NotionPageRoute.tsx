import 'server-only'

import { notFound } from 'next/navigation'

import type { PageProps } from '@/lib/types'
import { author } from '@/lib/config'
import { getPageMetadataInfo } from '@/lib/page-metadata'

import { NotionPage } from './NotionPage'

export function NotionPageRoute({ pageProps }: { pageProps: PageProps }) {
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

      <NotionPage pageId={pageId} recordMap={recordMap} site={site} />
    </>
  )
}
