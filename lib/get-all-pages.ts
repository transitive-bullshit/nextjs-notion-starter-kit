import pMemoize from 'p-memoize'
import { getAllPagesInSpace, getCanonicalPageId } from 'notion-utils'

import * as types from './types'
import notion from './notion'

export const getAllPages = pMemoize(getAllPagesImpl, { maxAge: 60000 * 5 })

export async function getAllPagesImpl(
  rootNotionPageId: string,
  rootNotionSpaceId: string
): Promise<Partial<types.SiteMap>> {
  const pageMap = await getAllPagesInSpace(
    rootNotionPageId,
    rootNotionSpaceId,
    notion.getPage.bind(notion)
  )

  const canonicalPageMap = Object.keys(pageMap).reduce(
    (map, pageId: string) => {
      const recordMap = pageMap[pageId]
      const canonicalPageId = getCanonicalPageId(pageId, recordMap, {
        uuid: false
      })

      if (map[canonicalPageId]) {
        console.error(
          'duplicate canonical page id',
          canonicalPageId,
          pageId,
          map[canonicalPageId].pageId
        )

        return map
      } else {
        return {
          ...map,
          [canonicalPageId]: {
            pageId,
            recordMap
          }
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
