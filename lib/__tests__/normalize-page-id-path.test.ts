import { describe, expect, it } from 'vitest'

import { normalizePageIdPath } from '../normalize-page-id-path'

describe('normalizePageIdPath', () => {
  it('returns a slug with no trailing uuid unchanged', () => {
    expect(normalizePageIdPath('advice-students')).toBe('advice-students')
    expect(normalizePageIdPath('')).toBe('')
  })

  it('strips the dashes from a trailing uuid, keeping the prefix', () => {
    expect(
      normalizePageIdPath('notes-12345678-1234-1234-1234-1234567890ab')
    ).toBe('notes-123456781234123412341234567890ab')
  })

  it('handles a bare dashed uuid', () => {
    expect(normalizePageIdPath('12345678-1234-1234-1234-1234567890ab')).toBe(
      '123456781234123412341234567890ab'
    )
  })
})
