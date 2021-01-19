import * as types from './types'
import { isDev } from './config'
import { getCanonicalPageId, uuidToId, parsePageId } from 'notion-utils'

// include UUIDs in page URLs during local development but not in production
// (they're nice for debugging and speed up local dev)
const uuid = !!isDev

export const mapPageUrl = (
  site: types.Site,
  recordMap: types.ExtendedRecordMap,
  searchParams: URLSearchParams
) => (pageId: string = '') => {
  if (uuidToId(pageId) === site.rootNotionPageId) {
    return createUrl('/', searchParams)
  } else {
    return createUrl(
      `/${getCanonicalPageId(pageId, recordMap, { uuid })}`,
      searchParams
    )
  }
}

export const getCanonicalPageUrl = (
  site: types.Site,
  recordMap: types.ExtendedRecordMap
) => (pageId: string = '') => {
  const pageUuid = parsePageId(pageId, { uuid: true })

  if (uuidToId(pageId) === site.rootNotionPageId) {
    return `https://${site.domain}`
  } else {
    return `https://${site.domain}/${getCanonicalPageId(pageUuid, recordMap, {
      uuid
    })}`
  }
}

function createUrl(path: string, searchParams: URLSearchParams) {
  return [path, searchParams.toString()].filter(Boolean).join('?')
}
