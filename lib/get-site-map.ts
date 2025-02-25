import { getAllPagesInSpace, uuidToId, getPageProperty } from 'notion-utils'
import pMemoize from 'p-memoize'
import { ExtendedRecordMap } from 'notion-types'

import * as config from './config'
import * as types from './types'
import { includeNotionIdInUrls } from './config'
import { getCanonicalPageId } from './get-canonical-page-id'
import { notion } from './notion-api'

const uuid = !!includeNotionIdInUrls

export async function getSiteMap(): Promise<types.SiteMap> {
  const partialSiteMap = await getAllPages(
    config.rootNotionPageId,
    config.rootNotionSpaceId
  )

  // Add duplicate detection
  const canonicalPageMap: { [canonicalPageId: string]: string } = {}
  const seenCanonicalIds = new Set()

  // Filter out duplicates while keeping the first occurrence
  Object.entries(partialSiteMap.canonicalPageMap).forEach(([canonicalId, pageId]) => {
    if (!seenCanonicalIds.has(canonicalId)) {
      canonicalPageMap[canonicalId] = pageId
      seenCanonicalIds.add(canonicalId)
    } else {
      console.warn(`Duplicate canonical ID detected: ${canonicalId}. Keeping first occurrence.`)
    }
  })

  return {
    site: config.site,
    ...partialSiteMap,
    canonicalPageMap // Use the de-duped map
  } as types.SiteMap
}

const getAllPages = pMemoize(getAllPagesImpl, {
  cacheKey: (...args) => JSON.stringify(args)
})

async function getAllPagesImpl(
  rootNotionPageId: string,
  rootNotionSpaceId: string
): Promise<Partial<types.SiteMap>> {
  const getPage = async (pageId: string): Promise<ExtendedRecordMap> => {
    console.log('\nnotion getPage', uuidToId(pageId))
    return notion.getPage(pageId)
  }

  const pageMap = await getAllPagesInSpace(
    rootNotionPageId,
    rootNotionSpaceId,
    getPage as any // Using type assertion to bypass the type conflict
  )

  const canonicalPageMap = Object.keys(pageMap).reduce(
    (map, pageId: string) => {
      const recordMap = pageMap[pageId]
      if (!recordMap) {
        throw new Error(`Error loading page "${pageId}"`)
      }

      const block = recordMap.block[pageId]?.value
      if (!(getPageProperty<boolean|null>('Public', block, recordMap) ?? true)) {
        return map
      }

      const canonicalPageId = getCanonicalPageId(pageId, recordMap, {
        uuid
      })

      if (map[canonicalPageId]) {
        // you can have multiple pages in different collections that have the same id
        // TODO: we may want to error if neither entry is a collection page
        console.warn('error duplicate canonical page id', {
          canonicalPageId,
          pageId,
          existingPageId: map[canonicalPageId]
        })

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
