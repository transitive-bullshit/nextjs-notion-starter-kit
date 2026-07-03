import { type ExtendedRecordMap } from 'notion-types'
import { describe, expect, it } from 'vitest'

import { getCanonicalPageId } from '../get-canonical-page-id'

const emptyRecordMap = { block: {} } as unknown as ExtendedRecordMap

describe('getCanonicalPageId', () => {
  it('returns undefined for an unparseable page id', () => {
    expect(getCanonicalPageId('', emptyRecordMap)).toBeUndefined()
    expect(
      getCanonicalPageId('not-a-notion-id', emptyRecordMap)
    ).toBeUndefined()
  })
})
