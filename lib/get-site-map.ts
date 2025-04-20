import { getAllPagesInSpace, uuidToId, getPageProperty, getBlockTitle } from 'notion-utils'
import pMemoize from 'p-memoize'
import { ExtendedRecordMap } from 'notion-types'

import * as config from './config'
import * as types from './types'
import { includeNotionIdInUrls } from './config'
import { getCanonicalPageId } from './get-canonical-page-id'
import { notion } from './notion-api'

const uuid = !!includeNotionIdInUrls

// Helper function to convert a title to a URL-friendly slug
function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '') // Replace spaces with empty string
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
}

export async function getSiteMap(): Promise<types.SiteMap> {
  const partialSiteMap = await getAllPages(
    config.rootNotionPageId,
    config.rootNotionSpaceId
  )

  // Don't modify existing canonicalPageMap entries from notion-utils
  const canonicalPageMap = {...partialSiteMap.canonicalPageMap}

  // Process all pages and create clean URL mappings
  for (const pageId in partialSiteMap.pageMap) {
    const page = partialSiteMap.pageMap[pageId]
    const recordMap = page as unknown as ExtendedRecordMap
    const block = recordMap?.block?.[pageId]?.value

    if (block) {
      // Get the page title
      const title = getBlockTitle(block, recordMap)

      if (title) {
        const slug = titleToSlug(title)
        // Only add if it doesn't exist and isn't already mapped to another page
        if (slug && !canonicalPageMap[slug] && !Object.values(canonicalPageMap).includes(pageId)) {
          canonicalPageMap[slug] = pageId
        }
      }
    }
  }

  // Update the canonical page map
  partialSiteMap.canonicalPageMap = canonicalPageMap

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

      let canonicalPageId = getCanonicalPageId(pageId, recordMap, {
        uuid
      })

      // Keep first occurrence clean, add counter only to duplicates
      const originalId = canonicalPageId
      if (map[canonicalPageId]) {
        let counter = 2
        console.warn('Duplicate canonical ID detected:', {
          originalId,
          existingPageId: map[canonicalPageId],
          newPageId: pageId
        })
        do {
          canonicalPageId = `${originalId}-${counter}`
          counter++
        } while (map[canonicalPageId])
        console.log('Generated new canonical ID:', canonicalPageId)
      }

      return {
        ...map,
        [canonicalPageId]: pageId
      }
    },
    {}
  )

  return {
    pageMap,
    canonicalPageMap
  }
}
