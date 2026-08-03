import { type GetStaticProps } from 'next'

import { NotionPage } from '@/components/NotionPage'
import { domain } from '@/lib/config'
import { resolveNotionPage } from '@/lib/resolve-notion-page'
import { type PageProps, type Params } from '@/lib/types'

export const getStaticProps: GetStaticProps<PageProps, Params> = async (
  context
) => {
  const rawPageId = context.params?.pageId as string

  try {
    const props = await resolveNotionPage(domain, rawPageId)

    if ('error' in props && props.error?.statusCode === 404) {
      return { notFound: true, revalidate: 10 }
    }

    return { props, revalidate: 300 }
  } catch (err) {
    console.error('page error', domain, rawPageId, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

// No pages prerendered at build time — all built on-demand via ISR.
// This avoids Notion API 429 rate limits during builds entirely.
// Pages are cached after first visit (revalidate: 5min above).
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking' as const
  }
}

export default function NotionDomainDynamicPage(props: PageProps) {
  return <NotionPage {...props} />
}
