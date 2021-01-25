import * as types from './types'
import { getPageProperty } from 'notion-utils'

export function getPageDescription(
  block: types.Block,
  recordMap: types.ExtendedRecordMap
): string | null {
  return getPageProperty('Description', block, recordMap)
}
