import { type ExtendedRecordMap } from 'notion-types'
import { mergeRecordMaps } from 'notion-utils'

/**
 * Navigation links are loaded with `chunkLimit: 1` and then cached.
 * Those copies must be merged underneath the fully loaded page so a nav
 * destination (Resume, Blog, Cookbook) keeps its complete current content.
 * `mergeRecordMaps` lets the second map win on conflicting block ids.
 */
export function mergeNavigationRecordMaps(
  recordMap: ExtendedRecordMap,
  navigationLinkRecordMaps: ExtendedRecordMap[]
): ExtendedRecordMap {
  const merged = navigationLinkRecordMaps.reduce(
    (map, navigationLinkRecordMap) =>
      mergeRecordMaps(navigationLinkRecordMap, map),
    recordMap
  )

  // The page renderer uses the first block as the page being viewed.
  // Navigation maps are spread first, which would otherwise make the last
  // nav page (Cookbook) that block on every route.
  const block: ExtendedRecordMap['block'] = { ...recordMap.block }

  for (const [blockId, blockValue] of Object.entries(merged.block)) {
    if (!block[blockId]) {
      block[blockId] = blockValue
    }
  }

  return {
    ...merged,
    block
  }
}
