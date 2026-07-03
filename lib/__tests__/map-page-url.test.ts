import { type ExtendedRecordMap } from 'notion-types'
import { describe, expect, it } from 'vitest'

import { getCanonicalPageUrl, mapPageUrl } from '../map-page-url'
import { type Site } from '../types'

// A 32-char Notion id (no dashes). parsePageId(..., { uuid: true }) re-dashes
// it and uuidToId() strips back to this, so it matches rootNotionPageId.
const rootId = '1234567812341234123412345678abcd'

const site: Site = {
  name: 'Test',
  domain: 'example.com',
  rootNotionPageId: rootId,
  rootNotionSpaceId: 'space-1'
}

const recordMap = { block: {} } as unknown as ExtendedRecordMap

describe('mapPageUrl', () => {
  it('maps the root page to "/"', () => {
    const url = mapPageUrl(site, recordMap, new URLSearchParams())(rootId)
    expect(url).toBe('/')
  })

  it('appends search params to the root url', () => {
    const url = mapPageUrl(
      site,
      recordMap,
      new URLSearchParams('lite=true')
    )(rootId)
    expect(url).toBe('/?lite=true')
  })
})

describe('getCanonicalPageUrl', () => {
  it('maps the root page to the bare domain', () => {
    const url = getCanonicalPageUrl(site, recordMap)(rootId)
    expect(url).toBe('https://example.com')
  })
})
