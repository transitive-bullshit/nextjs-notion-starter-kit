import pMap from 'p-map'
import { ExtendedRecordMap, SearchParams, SearchResults } from 'notion-types'
import { mergeRecordMaps } from 'notion-utils'

import { notion } from './notion-api'
import { getPreviewImageMap } from './preview-images'
import { getTweetAstMap } from './tweet-embeds'
import {
  isPreviewImageSupportEnabled,
  isTweetEmbedSupportEnabled,
  navigationStyle,
  navigationLinks
} from './config'

export async function getPage(pageId: string): Promise<ExtendedRecordMap> {
  let recordMap = await notion.getPage(pageId)

  if (navigationStyle !== 'default') {
    const navigationLinkPageIds = (navigationLinks || [])
      .map((link) => link.pageId)
      .filter(Boolean)

    if (navigationLinkPageIds.length) {
      const navigationLinkRecordMaps: ExtendedRecordMap[] = await pMap(
        navigationLinkPageIds,
        async (navigationLinkPageId) =>
          notion.getPage(navigationLinkPageId, {
            fetchMissingBlocks: false,
            fetchCollections: false,
            signFileUrls: false
          }),
        {
          concurrency: 4
        }
      )

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

  if (isTweetEmbedSupportEnabled) {
    const tweetAstMap = await getTweetAstMap(recordMap)
    ;(recordMap as any).tweetAstMap = tweetAstMap
  }

  return recordMap
}

export async function search(params: SearchParams): Promise<SearchResults> {
  return notion.search(params)
}
