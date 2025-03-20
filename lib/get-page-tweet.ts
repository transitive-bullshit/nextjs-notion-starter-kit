import { getPageProperty } from 'notion-utils'

import type * as types from './types'

export function getPageTweet(
  block: types.Block,
  recordMap: types.ExtendedRecordMap
): string | null {
  return getPageProperty('Tweet', block, recordMap)
}
