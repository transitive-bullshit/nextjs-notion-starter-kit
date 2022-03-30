import { ExtendedRecordMap } from 'notion-types'
import {
  parsePageId,
  getCanonicalPageId as getCanonicalPageIdImpl,
  getPageProperty
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
    let ret = getCanonicalPageIdImpl(pageId, recordMap, {
      uuid
    })

    const block = recordMap.block[pageId]?.value
    if (block) {
      const slugName = getPageProperty('SlugName', block, recordMap) as string
      if (slugName) {
        ret = slugName
      }
    }

    // console.log('getCanonicalPageId>getCanonicalPageId', ret)
    return ret
  }
}
