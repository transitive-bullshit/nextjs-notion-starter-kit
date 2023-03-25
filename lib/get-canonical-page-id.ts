import { ExtendedRecordMap } from 'notion-types'
import {
  getCanonicalPageId as getCanonicalPageIdImpl,
  parsePageId
} from 'notion-utils'

import { inversePageUrlOverrides } from './config'

export function getCanonicalPageId(
  pageId: string,
  recordMap: ExtendedRecordMap,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    // @patch: set page uri to uuid
    // return getCanonicalPageIdImpl(pageId, recordMap, {
    //   uuid
    // })
    return getCanonicalPageIdImpl(pageId, recordMap, { uuid: true }).split('-').slice(-1).join('')
  }
}
