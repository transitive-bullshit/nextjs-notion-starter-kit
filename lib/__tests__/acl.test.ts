import { type ExtendedRecordMap } from 'notion-types'
import { describe, expect, it } from 'vitest'

import { pageAcl } from '../acl'
import { type Site } from '../types'

const site: Site = {
  name: 'Test',
  domain: 'example.com',
  rootNotionPageId: 'root-page',
  rootNotionSpaceId: 'space-1'
}

function recordMapWith(
  blockValue: Record<string, unknown> | undefined
): ExtendedRecordMap {
  const block = blockValue
    ? { root: { role: 'reader', value: blockValue } }
    : {}
  return { block } as unknown as ExtendedRecordMap
}

describe('pageAcl', () => {
  it('errors when the site is missing', async () => {
    const result = await pageAcl({ pageId: 'p' })
    expect(result?.error?.statusCode).toBe(404)
    expect(result?.error?.message).toMatch(/notion site/i)
  })

  it('errors when the record map is missing', async () => {
    const result = await pageAcl({ site, pageId: 'p' })
    expect(result?.error?.statusCode).toBe(404)
    expect(result?.error?.message).toMatch(/not found/i)
  })

  it('errors when the record map has no blocks', async () => {
    const result = await pageAcl({
      site,
      recordMap: recordMapWith(undefined),
      pageId: 'p'
    })
    expect(result?.error?.statusCode).toBe(404)
    expect(result?.error?.message).toMatch(/invalid data/i)
  })

  it('rejects a page from a different workspace', async () => {
    const result = await pageAcl({
      site,
      recordMap: recordMapWith({ id: 'root', space_id: 'space-2' }),
      pageId: 'p'
    })
    expect(result?.error?.statusCode).toBe(404)
    expect(result?.error?.message).toMatch(/workspace/i)
  })

  it('allows a page from the matching workspace', async () => {
    const result = await pageAcl({
      site,
      recordMap: recordMapWith({ id: 'root', space_id: 'space-1' }),
      pageId: 'p'
    })
    expect(result).toBeUndefined()
  })

  it('allows a page whose block has no space_id', async () => {
    const result = await pageAcl({
      site,
      recordMap: recordMapWith({ id: 'root' }),
      pageId: 'p'
    })
    expect(result).toBeUndefined()
  })
})
