import {
  type ExtendedRecordMap,
  type SearchParams,
  type SearchResults
} from 'notion-types'
import { getBlockValue, mergeRecordMaps } from 'notion-utils'
import pMap from 'p-map'
import pMemoize from 'p-memoize'

import {
  isPreviewImageSupportEnabled,
  navigationLinks,
  navigationStyle
} from './config'
import { getTweetsMap } from './get-tweets'
import { notion } from './notion-api'
import { getPreviewImageMap } from './preview-images'

const getNavigationLinkPages = pMemoize(
  async (): Promise<ExtendedRecordMap[]> => {
    const navigationLinkPageIds = (navigationLinks || [])
      .map((link) => link?.pageId)
      .filter(Boolean)

    if (navigationStyle !== 'default' && navigationLinkPageIds.length) {
      return pMap(
        navigationLinkPageIds,
        async (navigationLinkPageId) =>
          notion.getPage(navigationLinkPageId, {
            chunkLimit: 1,
            fetchMissingBlocks: false,
            fetchCollections: false,
            signFileUrls: false
          }),
        {
          concurrency: 4
        }
      )
    }

    return []
  }
)

export async function getPage(pageId: string): Promise<ExtendedRecordMap> {
  let recordMap = await notion.getPage(pageId)

  if (navigationStyle !== 'default') {
    // ensure that any pages linked to in the custom navigation header have
    // their block info fully resolved in the page record map so we know
    // the page title, slug, etc.
    const navigationLinkRecordMaps = await getNavigationLinkPages()

    if (navigationLinkRecordMaps?.length) {
      recordMap = navigationLinkRecordMaps.reduce(
        (map, navigationLinkRecordMap) =>
          mergeRecordMaps(map, navigationLinkRecordMap),
        recordMap
      )
    }
  }

  if (isPreviewImageSupportEnabled) {
    const previewImageMap = await getPreviewImageMap(recordMap)
    ;(recordMap as any).preview_images = previewImageMap
  }

  await getTweetsMap(recordMap)

  // Filter non-public pages from collection views (gallery/table on homepage)
  filterNonPublicPages(recordMap)

  return recordMap
}

/**
 * Removes pages where the "Public" checkbox is unchecked from all
 * collection_query results so they don't render in gallery/table views.
 */
function filterNonPublicPages(recordMap: ExtendedRecordMap): void {
  const collectionQuery = recordMap.collection_query
  if (!collectionQuery) return

  for (const collectionId of Object.keys(collectionQuery)) {
    // Find the "Public" property ID from the collection schema
    const collection = getBlockValue(recordMap.collection?.[collectionId])
    if (!collection?.schema) continue

    const publicPropId = Object.keys(collection.schema).find(
      (key) =>
        collection.schema[key]?.name === 'Public' &&
        collection.schema[key]?.type === 'checkbox'
    )
    if (!publicPropId) continue

    // Check if a block's "Public" property is "Yes"
    const isPublic = (blockId: string): boolean => {
      const block = getBlockValue(recordMap.block[blockId])
      const val = block?.properties?.[publicPropId]
      return val?.[0]?.[0] === 'Yes'
    }

    for (const viewId of Object.keys(collectionQuery[collectionId]!)) {
      const data = collectionQuery[collectionId]![viewId] as any
      if (!data) continue

      // Filter flat blockIds
      if (data.blockIds) {
        data.blockIds = data.blockIds.filter(isPublic)
      }

      // Filter grouped results (board/gallery)
      if (data.collection_group_results?.blockIds) {
        data.collection_group_results.blockIds =
          data.collection_group_results.blockIds.filter(isPublic)
      }

      // Filter per-group results (board columns)
      if (data.groupResults) {
        for (const group of data.groupResults) {
          if (group.blockIds) {
            group.blockIds = group.blockIds.filter(isPublic)
          }
        }
      }
    }
  }
}

export async function search(params: SearchParams): Promise<SearchResults> {
  return notion.search(params)
}
