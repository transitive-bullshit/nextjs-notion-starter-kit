import * as types from './types'
import { getPageProperty, uuidToId } from 'notion-utils'
import * as config from "./config"

export function getPageDescription(
  block: types.Block,
  recordMap: types.ExtendedRecordMap
): string | null {
  return config.pageDescriptionOverrides[uuidToId(block.id)] || getPageProperty('Description', block, recordMap) || null
}
