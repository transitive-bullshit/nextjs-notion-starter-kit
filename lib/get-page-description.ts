import * as types from './types'
import { getPageProperty } from 'notion-utils'

export function getPageDescription(
  block: types.Block,
  recordMap: types.ExtendedRecordMap
): string | null {
  try {
    return getPageProperty('Description', block, recordMap)
  } catch (err) {
    return null
  }
}
