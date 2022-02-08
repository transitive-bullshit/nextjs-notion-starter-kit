import pMemoize from 'p-memoize'
import { getAllPagesInSpace, getPageProperty } from 'notion-utils'

import * as types from './types'
import { includeNotionIdInUrls } from './config'
import { notion } from './notion'
import { getCanonicalPageId } from './get-canonical-page-id'
import { getPagePropertyExtend } from './get-page-property'

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

      // Get Last Edited Time
      const lastEditedTime = block?.last_edited_time ? new Date(block.last_edited_time) : null
      // Get Created Time
      const createdTime = block?.created_time ? new Date(block.created_time) : null

      // Insert SlugName instead of PageId.
      if (block) {
        let slugName = getPageProperty('SlugName', block, recordMap)

        if (slugName) {
          canonicalPageId = slugName
        }
      }

      const canonicalPageData: types.CanonicalPageData = {
        id: pageId,
        lastEditedTime,
        createdTime
      }

      console.log(canonicalPageData)

      console.groupEnd()

      if (block) {
        let lastmod = getPagePropertyExtend('Updated', block, recordMap)
        console.log(`lastmod: ${lastmod}`)
      }

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
          [canonicalPageId]: canonicalPageData
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
