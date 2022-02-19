import * as types from './types'
import { getPageProperty } from 'notion-utils'

export function getPageTweet(
  block: types.Block,
  recordMap: types.ExtendedRecordMap
): string | null {
  try {
    return getPageProperty('Tweet', block, recordMap)
  } catch (err) {
    return null
  }
}
