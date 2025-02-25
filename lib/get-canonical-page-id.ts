import { ExtendedRecordMap } from 'notion-types'
import {
  getCanonicalPageId as getCanonicalPageIdImpl,
  parsePageId
} from 'notion-utils'

import { inversePageUrlOverrides } from './config'

export function getCanonicalPageId(
  pageId: string,
  recordMap: ExtendedRecordMap,
  { uuid = true }: { uuid?: boolean } = {}
): string | null {
  const cleanPageId = parsePageId(pageId, { uuid: false })
  if (!cleanPageId) {
    return null
  }

  const override = inversePageUrlOverrides[cleanPageId]
  if (override) {
    return override
  } else {
    const canonicalId = getCanonicalPageIdImpl(pageId, recordMap, {
      uuid
    })

    // Optionally append a short hash to ensure uniqueness
    // if (canonicalId) {
    //   const shortHash = pageId.slice(0, 4)
    //   return `${canonicalId}-${shortHash}`
    // }

    return canonicalId
  }
}
