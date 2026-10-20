import { type ExtendedRecordMap } from 'notion-types'
import { parsePageId } from 'notion-utils'

import type { PageProps } from './types'
import * as acl from './acl'
import { environment, pageUrlAdditions, pageUrlOverrides, site } from './config'
import { db } from './db'
import { getSiteMap } from './get-site-map'
import { getPage } from './notion'

/**
 * Next.js App Router may pass dynamic segment params still percent-encoded
 * (especially for non-ASCII slugs). Site-map keys use decoded Unicode paths.
 */
function normalizePagePathParam(value: string): string {
  let current = value

  for (let i = 0; i < 2; i++) {
    if (!/%[0-9a-fA-F]{2}/.test(current)) {
      break
    }

    try {
      const decoded = decodeURIComponent(current)
      if (decoded === current) {
        break
      }
      current = decoded
    } catch {
      break
    }
  }

  return current
}

export async function resolveNotionPage(
  domain: string,
  rawPageId?: string
): Promise<PageProps> {
  let pageId: string | undefined
  let recordMap: ExtendedRecordMap

  if (rawPageId && rawPageId !== 'index') {
    const pagePath = normalizePagePathParam(rawPageId)
    pageId = parsePageId(pagePath)!

    if (!pageId) {
      // check if the site configuration provides an override or a fallback for
      // the page's URI
      const override = pageUrlOverrides[pagePath] || pageUrlAdditions[pagePath]

      if (override) {
        pageId = parsePageId(override)!
      }
    }

    const useUriToPageIdCache = true
    const cacheKey = `uri-to-page-id:${domain}:${environment}:${pagePath}`
    // TODO: should we use a TTL for these mappings or make them permanent?
    // const cacheTTL = 8.64e7 // one day in milliseconds
    const cacheTTL = undefined // disable cache TTL

    if (!pageId && useUriToPageIdCache) {
      try {
        // check if the database has a cached mapping of this URI to page ID
        pageId = await db.get(cacheKey)

        // console.log(`redis get "${cacheKey}"`, pageId)
      } catch (err: any) {
        // ignore redis errors
        console.warn(`redis error get "${cacheKey}"`, err.message)
      }
    }

    if (pageId) {
      recordMap = await getPage(pageId)
    } else {
      // handle mapping of user-friendly canonical page paths to Notion page IDs
      // e.g., /developer-x-entrepreneur versus /71201624b204481f862630ea25ce62fe
      const siteMap = await getSiteMap()
      pageId = siteMap?.canonicalPageMap[pagePath]

      if (pageId) {
        // TODO: we're not re-using the page recordMap from siteMaps because it is
        // cached aggressively
        // recordMap = siteMap.pageMap[pageId]

        recordMap = await getPage(pageId)

        if (useUriToPageIdCache) {
          try {
            // update the database mapping of URI to pageId
            await db.set(cacheKey, pageId, cacheTTL)

            // console.log(`redis set "${cacheKey}"`, pageId, { cacheTTL })
          } catch (err: any) {
            // ignore redis errors
            console.warn(`redis error set "${cacheKey}"`, err.message)
          }
        }
      } else {
        // note: we're purposefully not caching URI to pageId mappings for 404s
        return {
          error: {
            message: `Not found "${pagePath}"`,
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
