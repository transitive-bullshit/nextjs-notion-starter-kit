import {
  type ExtendedRecordMap,
  type SearchParams,
  type SearchResults
} from 'notion-types'
import { getBlockValue, mergeRecordMaps, parsePageId } from 'notion-utils'
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

function pruneNavigationLinkRecordMap(
  recordMap: ExtendedRecordMap,
  pageId: string
): ExtendedRecordMap {
  const blockId = parsePageId(pageId) ?? pageId
  const blockRecord = recordMap.block[blockId]
  if (!blockRecord) return recordMap

  const block = getBlockValue(blockRecord)
  const collectionId =
    block?.parent_table === 'collection' ? block.parent_id : undefined
  const collectionRecord = collectionId
    ? recordMap.collection[collectionId]
    : undefined

  return {
    block: { [blockId]: blockRecord },
    collection:
      collectionId && collectionRecord
        ? { [collectionId]: collectionRecord }
        : {},
    collection_view: {},
    notion_user: {},
    collection_query: {},
    signed_urls: {}
  }
}

const getNavigationLinkPages = pMemoize(
  async (): Promise<ExtendedRecordMap[]> => {
    const navigationLinkPageIds = (navigationLinks || [])
      .map((link) => link?.pageId)
      .filter(Boolean)

    if (navigationStyle !== 'default' && navigationLinkPageIds.length) {
      return pMap(
        navigationLinkPageIds,
        async (navigationLinkPageId) => {
          const recordMap = await notion.getPage(navigationLinkPageId, {
            chunkLimit: 1,
            fetchMissingBlocks: false,
            fetchCollections: false,
            signFileUrls: false
          })

          return pruneNavigationLinkRecordMap(recordMap, navigationLinkPageId)
        },
        {
          concurrency: 4
        }
      )
    }

    return []
  }
)

export async function getPage(pageId: string): Promise<ExtendedRecordMap> {
  const recordMapPromise = notion.getPage(pageId)
  const navigationLinkRecordMapsPromise =
    navigationStyle !== 'default'
      ? getNavigationLinkPages()
      : Promise.resolve([])

  const [initialRecordMap, navigationLinkRecordMaps] = await Promise.all([
    recordMapPromise,
    navigationLinkRecordMapsPromise
  ])
  let recordMap = initialRecordMap

  if (navigationStyle !== 'default') {
    // Merge only the linked page record (and parent collection schema when
    // needed) so URL generation has title/slug data without serializing the
    // navigation page's content into every route.
    if (navigationLinkRecordMaps?.length) {
      recordMap = navigationLinkRecordMaps.reduce(
        (map, navigationLinkRecordMap) =>
          mergeRecordMaps(map, navigationLinkRecordMap),
        recordMap
      )
    }
  }

  const [previewImageMap] = await Promise.all([
    isPreviewImageSupportEnabled
      ? getPreviewImageMap(recordMap)
      : Promise.resolve(undefined),
    getTweetsMap(recordMap)
  ])

  if (isPreviewImageSupportEnabled) {
    ;(recordMap as any).preview_images = previewImageMap
  }

  return recordMap
}

export async function search(params: SearchParams): Promise<SearchResults> {
  return notion.search(params)
}
