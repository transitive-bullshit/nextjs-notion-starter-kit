import { type ExtendedRecordMap } from 'notion-types'
import { parsePageId } from 'notion-utils'

import type { PageProps } from './types'
import * as acl from './acl'
import { pageUrlAdditions, pageUrlOverrides, site } from './config'
import { normalizePageIdPath } from './normalize-page-id-path'
import { getPage } from './notion'
import { canonicalPageMap } from './notion-index'

export async function resolveNotionPage(
  domain: string,
  rawPageId?: string
): Promise<PageProps> {
  let pageId: string | undefined
  let recordMap: ExtendedRecordMap

  if (rawPageId && rawPageId !== 'index') {
    const normalizedRawPageId = normalizePageIdPath(rawPageId)
    pageId = parsePageId(normalizedRawPageId)!

    if (!pageId) {
      // check if the site configuration provides an override or a fallback for
      // the page's URI
      const override =
        pageUrlOverrides[rawPageId] ||
        pageUrlAdditions[rawPageId] ||
        pageUrlOverrides[normalizedRawPageId] ||
        pageUrlAdditions[normalizedRawPageId]

      if (override) {
        pageId = parsePageId(override)!
      }
    }

    if (!pageId) {
      const mappedPageId =
        canonicalPageMap[rawPageId] || canonicalPageMap[normalizedRawPageId]
      pageId = mappedPageId ? parsePageId(mappedPageId)! : undefined
    }

    if (pageId) {
      recordMap = await getPage(pageId)
    } else {
      return {
        error: {
          message: `Not found "${rawPageId}"`,
          statusCode: 404
        }
      }
    }
  } else {
    pageId = site.rootNotionPageId

    recordMap = await getPage(pageId)
  }

  const props: PageProps = { site, recordMap, pageId }
  return { ...props, ...(await acl.pageAcl(props)) }
}
