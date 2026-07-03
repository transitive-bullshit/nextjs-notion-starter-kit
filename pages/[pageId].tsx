import { type GetStaticProps, type PageConfig } from 'next'
import { parsePageId } from 'notion-utils'

import { NotionPage } from '@/components/NotionPage'
import { domain, isDev, pageUrlAdditions, pageUrlOverrides } from '@/lib/config'
import { normalizePageIdPath } from '@/lib/normalize-page-id-path'
import { canonicalPageMap } from '@/lib/notion-index'
import { resolveNotionPage } from '@/lib/resolve-notion-page'
import { type PageProps, type Params } from '@/lib/types'

export const config: PageConfig = {
  maxDuration: 60
}

async function getNotionFallbackUrl(rawPageId: string): Promise<string | null> {
  const normalizedRawPageId = normalizePageIdPath(rawPageId)
  let notionPageId =
    pageUrlOverrides[rawPageId] ||
    pageUrlAdditions[rawPageId] ||
    pageUrlOverrides[normalizedRawPageId] ||
    pageUrlAdditions[normalizedRawPageId] ||
    parsePageId(normalizedRawPageId, { uuid: false })

  if (!notionPageId) {
    notionPageId =
      canonicalPageMap[rawPageId] || canonicalPageMap[normalizedRawPageId]
  }

  if (!notionPageId) return null
  const normalizedNotionPageId = parsePageId(notionPageId, { uuid: false })
  if (!normalizedNotionPageId) return null

  return `https://wustep.notion.site/${normalizedNotionPageId}`
}

export const getStaticProps: GetStaticProps<PageProps, Params> = async (
  context
) => {
  const requestedPageId = context.params?.pageId as string
  const normalizedPageId = normalizePageIdPath(requestedPageId)

  try {
    const props = await resolveNotionPage(domain, normalizedPageId)

    return { props, revalidate: 86_400 }
  } catch (err: unknown) {
    console.error('page error', domain, requestedPageId, err)

    if (
      context.revalidateReason === 'stale' ||
      context.revalidateReason === 'on-demand'
    ) {
      throw err
    }

    const fallbackUrl = await getNotionFallbackUrl(normalizedPageId)

    return {
      props: {
        error: {
          message: 'Error',
          statusCode: 500
        },
        ...(fallbackUrl && { notionFallbackUrl: fallbackUrl })
      },
      revalidate: 10
    }
  }
}

export async function getStaticPaths() {
  if (isDev) {
    return {
      paths: [],
      fallback: true
    }
  }

  // Combine sitemap paths with URL overrides (e.g., /articles, /notes)
  // URL overrides might not be in the sitemap if not directly linked from root
  const allPageIds = [
    ...new Set([
      ...Object.keys(canonicalPageMap),
      ...Object.keys(pageUrlOverrides)
    ])
  ]

  const staticPaths = {
    paths: allPageIds.map((pageId) => ({ params: { pageId } })),
    fallback: true
  }

  return staticPaths
}

export default function NotionDomainDynamicPage(props: PageProps) {
  return <NotionPage {...props} />
}
