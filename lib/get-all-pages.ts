import pMemoize from 'p-memoize'
import { getAllPagesInSpace } from 'notion-utils'
import stringify from 'fast-json-stable-stringify'

import * as types from './types'
import { includeNotionIdInUrls } from './config'
import { notion } from './notion'
import { getCanonicalPageId } from './get-canonical-page-id'

const uuid = !!includeNotionIdInUrls

export const getAllPages = pMemoize(getAllPagesImpl, {
  maxAge: 60000 * 5,
  cacheKey: (args) => stringify(args)
})

export async function getAllPagesImpl(
  rootNotionPageId: string,
  rootNotionSpaceId: string,
  {
    concurrency = 4,
    pageConcurrency = 3,
    full = false,
    targetPageId = null
  }: {
    concurrency?: number
    pageConcurrency?: number
    full?: boolean
    targetPageId?: string
  } = {}
): Promise<types.PartialSiteMap> {
  const pageMap = await getAllPagesInSpace(
    rootNotionPageId,
    rootNotionSpaceId,
    (pageId: string) =>
      notion.getPage(pageId, {
        signFileUrls: full,
        concurrency: pageConcurrency
      }),
    {
      concurrency,
      targetPageId
    }
  )

  const canonicalPageMap = Object.keys(pageMap).reduce(
    (map, pageId: string) => {
      const recordMap = pageMap[pageId]
      if (!recordMap) {
        throw new Error(`Error loading page "${pageId}"`)
      }

      const canonicalPageId = getCanonicalPageId(pageId, recordMap, {
        uuid
      })

      if (map[canonicalPageId]) {
        console.error(
          'error duplicate canonical page id',
          canonicalPageId,
          pageId,
          map[canonicalPageId]
        )

        return map
      } else {
        return {
          ...map,
          [canonicalPageId]: pageId
        }
      }
    },
    {}
  )

  return {
    pageMap,
    canonicalPageMap
  }
}
