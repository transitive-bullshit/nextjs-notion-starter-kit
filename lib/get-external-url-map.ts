import { type ExtendedRecordMap } from 'notion-types'
import { getBlockValue, getPageProperty, uuidToId } from 'notion-utils'

/**
 * Builds a map of page IDs to external URLs for pages that have
 * the "External" checkbox enabled and an "External URL" property set.
 */
export function getExternalUrlMap(
  recordMap: ExtendedRecordMap
): Map<string, string> {
  const map = new Map<string, string>()

  for (const blockId of Object.keys(recordMap.block)) {
    const block = getBlockValue(recordMap.block[blockId])
    if (!block || block.type !== 'page') continue

    const isExternal = getPageProperty<boolean>('External', block, recordMap)
    if (!isExternal) continue

    const externalUrl = getPageProperty<string>(
      'External URL',
      block,
      recordMap
    )
    if (externalUrl) {
      map.set(uuidToId(blockId), externalUrl)
    }
  }

  return map
}
