import ExpiryMap from 'expiry-map'
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

// Every Notion read shares one caching primitive: pMemoize + ExpiryMap.
// - pMemoize dedupes concurrent calls (in-flight requests share one promise)
//   and only ever writes the *resolved* value to the cache, so a rejected
//   fetch (e.g. a 429) is never persisted.
// - ExpiryMap provides the TTL-based eviction.
// This mirrors the client-side cache in ./search-notion.ts so the whole
// codebase uses a single, consistent strategy.
const PAGE_CACHE_TTL_MS = 25 * 60 * 1000
const SEARCH_CACHE_TTL_MS = 60 * 1000

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
  },
  { cache: new ExpiryMap<undefined, ExtendedRecordMap[]>(PAGE_CACHE_TTL_MS) }
)

async function getPageUncached(pageId: string): Promise<ExtendedRecordMap> {
  let recordMap = await notion.getPage(pageId)
  /**
   * @wustep: fix for expiring images by removing signed AWS urls
   * from https://github.com/transitive-bullshit/nextjs-notion-starter-kit/issues/279#issuecomment-1245467818
   */
  if (recordMap && recordMap.signed_urls) {
    const signedUrls = recordMap.signed_urls
    const newSignedUrls: Record<string, string> = {}
    for (const url in signedUrls) {
      if (signedUrls[url] && signedUrls[url].includes('.amazonaws.com')) {
        continue
      }
      newSignedUrls[url] = signedUrls[url]!
    }
    recordMap.signed_urls = newSignedUrls
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

  return recordMap
}

export const getPage = pMemoize(getPageUncached, {
  cache: new ExpiryMap<string, ExtendedRecordMap>(PAGE_CACHE_TTL_MS)
})

export const search = pMemoize(
  (params: SearchParams): Promise<SearchResults> => notion.search(params),
  {
    cacheKey: (args) => JSON.stringify(args[0]),
    cache: new ExpiryMap<string, SearchResults>(SEARCH_CACHE_TTL_MS)
  }
)
