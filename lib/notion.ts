import {
  type ExtendedRecordMap,
  type SearchParams,
  type SearchResults
} from 'notion-types'
import { mergeRecordMaps } from 'notion-utils'
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

const PAGE_CACHE_TTL_MS = 60_000
const PAGE_CACHE_STALE_MS = 86_400_000

const pageCache = new Map<
  string,
  {
    recordMap: ExtendedRecordMap
    expiresAt: number
    staleUntil: number
  }
>()

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
  const now = Date.now()
  const cached = pageCache.get(pageId)
  if (cached && cached.expiresAt > now) {
    return cached.recordMap
  }

  let recordMap: ExtendedRecordMap
  try {
    recordMap = await notion.getPage(pageId, {
      ofetchOptions: {
        timeout: 30_000,
        retry: 2,
        retryDelay: 500
      }
    })
    recordMap = normalizeRecordMap(recordMap)
  } catch (err: any) {
    if (cached && cached.staleUntil > now) {
      console.warn('notion getPage fallback to stale cache', {
        pageId,
        message: err?.message
      })
      return cached.recordMap
    }

    throw err
  }

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

  pageCache.set(pageId, {
    recordMap,
    expiresAt: now + PAGE_CACHE_TTL_MS,
    staleUntil: now + PAGE_CACHE_STALE_MS
  })

  return recordMap
}

function normalizeRecordMap(recordMap: ExtendedRecordMap): ExtendedRecordMap {
  return {
    ...recordMap,
    block: unwrapEntries(recordMap.block),
    collection: unwrapEntries(recordMap.collection),
    collection_view: unwrapEntries(recordMap.collection_view),
    notion_user: unwrapEntries(recordMap.notion_user)
  } as ExtendedRecordMap
}

function unwrapEntries(entries: Record<string, any> | undefined) {
  return Object.fromEntries(
    Object.entries(entries ?? {}).map(([key, entry]) => {
      const normalizedValue = entry?.value?.value ?? entry?.value
      return [key, { ...entry, value: normalizedValue }]
    })
  )
}

export async function search(params: SearchParams): Promise<SearchResults> {
  return notion.search(params)
}
