import pMemoize from 'p-memoize'
import { getAllPagesInSpace, getPageProperty } from 'notion-utils'

import * as types from './types'
import { includeNotionIdInUrls } from './config'
import { notion } from './notion'
import { getCanonicalPageId } from './get-canonical-page-id'

const uuid = !!includeNotionIdInUrls

export const getAllPages = pMemoize(getAllPagesImpl, { maxAge: 60000 * 5 })
// For testing use.
// export const getAllPages = pMemoize(getAllPagesImpl, { maxAge: 1000 })

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
      if (!recordMap) {
        throw new Error(`Error loading page "${pageId}"`)
      }

      let canonicalPageId = getCanonicalPageId(pageId, recordMap, {
        uuid
      })

      const block = recordMap.block[pageId]?.value

      // Skip the private page.
      // UPDATE: Comment out this block of code, use `Share` directly in Notion.
      // if (block) {
      //   // get page property 'Private'
      //   const privatePage = getPageProperty('Private', block, recordMap)
      //   // if private, skip
      //   if (privatePage === 'Yes') {
      //     // TODO: try to remove this page from the map.
      //     delete map[pageId];
      //     return map
      //   }
      // }

      // Insert SlugName instead of PageId.
      if (block) {
        let slugName = getPageProperty('SlugName', block, recordMap)

        if (slugName) {
          canonicalPageId = slugName
        }
      }

      console.groupEnd()

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
