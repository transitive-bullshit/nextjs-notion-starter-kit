import * as types from './types'
import { getCanonicalPageId, uuidToId, parsePageId } from 'notion-utils'

export const mapPageUrl = (
  site: types.Site,
  recordMap: types.ExtendedRecordMap,
  searchParams: URLSearchParams
) => (pageId: string = '') => {
  if (uuidToId(pageId) === site.rootNotionPageId) {
    return createUrl('/', searchParams)
  } else {
    return createUrl(
      `/${getCanonicalPageId(pageId, recordMap, { uuid: false })}`,
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
      uuid: false
    })}`
  }
}

function createUrl(path: string, searchParams: URLSearchParams) {
  return [path, searchParams.toString()].filter(Boolean).join('?')
}
