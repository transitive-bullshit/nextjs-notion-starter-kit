import { type ExtendedRecordMap } from 'notion-types'
import { parsePageId } from 'notion-utils'

import type { PageProps } from './types'
import * as acl from './acl'
import { pageUrlAdditions, pageUrlOverrides, site } from './config'
import {
  getSiteMap,
  hotCacheGet,
  kvAppendSlug,
  resolveSlugDirect
} from './get-site-map'
import { getPage } from './notion'

export async function resolveNotionPage(
  domain: string,
  rawPageId?: string
): Promise<PageProps> {
  let pageId: string | undefined
  let recordMap: ExtendedRecordMap

  if (rawPageId && rawPageId !== 'index') {
    pageId = parsePageId(rawPageId)!

    if (!pageId) {
      // check if the site configuration provides an override or a fallback for
      // the page's URI
      const override =
        pageUrlOverrides[rawPageId] || pageUrlAdditions[rawPageId]

      if (override) {
        pageId = parsePageId(override)!
      }
    }

    // L1: Cache API hot cache (per-colo, ~0ms)
    if (!pageId) {
      pageId = (await hotCacheGet(rawPageId)) ?? undefined
    }

    if (pageId) {
      recordMap = await getPage(pageId)
    } else {
      // L2: Direct DB query for databases with Slug property (1 Notion API call)
      pageId = (await resolveSlugDirect(rawPageId)) ?? undefined

      // L3: KV sitemap / static fallback / full crawl
      if (!pageId) {
        const siteMap = await getSiteMap()
        pageId = siteMap?.canonicalPageMap[rawPageId]
      }

      if (pageId) {
        recordMap = await getPage(pageId)

        // Update L1 hot cache + L2 KV for future requests
        await kvAppendSlug(rawPageId, pageId)
      } else {
        return {
          error: {
            message: `Not found "${rawPageId}"`,
            statusCode: 404
          }
        }
      }
    }
  } else {
    pageId = site.rootNotionPageId

    console.log(site)
    recordMap = await getPage(pageId)
  }

  const props: PageProps = { site, recordMap, pageId }
  return { ...props, ...(await acl.pageAcl(props)) }
}
