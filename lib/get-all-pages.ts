import pMemoize from 'p-memoize'
import { getAllPagesInSpace, getPageProperty, getBlockTitle } from 'notion-utils'

import * as types from './types'
import { includeNotionIdInUrls, overrideCreatedTime, overrideLastEditedTime } from './config'
import { notion } from './notion'
import { getCanonicalPageId } from './get-canonical-page-id'

const uuid = !!includeNotionIdInUrls

export const getAllPages = pMemoize(getAllPagesImpl, {
  cacheKey: (...args) => JSON.stringify(args)
})

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

      // Get Page Title
      const title = getBlockTitle(block, recordMap)

      // Get Last Edited Time
      let lastEditedTime: Date | null = null;
      if (overrideLastEditedTime) {
        let timestamp = NaN;
        try {
          timestamp = getPageProperty(overrideLastEditedTime, block, recordMap);
        } catch (e) {
          console.error(e);
        }
        lastEditedTime = new Date(timestamp);
        // If it's invalidDate, set to null
        if (isNaN(lastEditedTime.getTime())) {
          console.log('overrideLastEditedTime:', overrideLastEditedTime, '. Invalid lastEditedTime: ', lastEditedTime);
          lastEditedTime = null;
        }
      }
      if (!lastEditedTime)
        lastEditedTime = block?.last_edited_time ? new Date(block.last_edited_time) : null

      // Get Created Time
      let createdTime: Date | null = null;
      if (overrideCreatedTime) {
        let timestamp = NaN;
        try {
          timestamp = getPageProperty(overrideCreatedTime, block, recordMap);
        } catch (e) {
          console.error(e);
        }
        createdTime = new Date(timestamp);
        // If it's invalidDate, set to null
        if (isNaN(createdTime.getTime())) {
          console.log('OverrideCreatedTime:', overrideCreatedTime, '. Invalid createdTime: ', createdTime);
          createdTime = null;
        }
      }
      if (!createdTime)
        createdTime = block?.created_time ? new Date(block.created_time) : null

      // Insert SlugName instead of PageId.
      if (block) {
        const slugName = getPageProperty('SlugName', block, recordMap)

        if (slugName) {
          canonicalPageId = slugName as string
        }
      }

      const canonicalPageData: types.CanonicalPageData = {
        pageID: pageId,
        lastEditedTime,
        createdTime,
        title,
      }

      console.log(canonicalPageData)

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
