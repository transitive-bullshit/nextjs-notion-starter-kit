import { describe, expect, it } from 'vitest'

import { validateEnv } from '../validate-env'

describe('validateEnv', () => {
  it('passes on an empty environment', () => {
    expect(() => validateEnv({})).not.toThrow()
  })

  it('passes on a valid environment', () => {
    expect(() =>
      validateEnv({
        OWNER_MODE_SECRET: 'a-long-enough-secret',
        NOTION_API_BASE_URL: 'https://notion.example.com',
        PORT: '3000'
      })
    ).not.toThrow()
  })

  it('rejects a too-short owner secret', () => {
    expect(() => validateEnv({ OWNER_MODE_SECRET: 'short' })).toThrow(
      /OWNER_MODE_SECRET/
    )
  })

  it('rejects a malformed URL', () => {
    expect(() => validateEnv({ NOTION_API_BASE_URL: 'not a url' })).toThrow(
      /NOTION_API_BASE_URL/
    )
  })

  it('rejects a non-numeric port', () => {
    expect(() => validateEnv({ PORT: 'abc' })).toThrow(/PORT/)
  })

  it('collects multiple errors in one message', () => {
    expect(() => validateEnv({ OWNER_MODE_SECRET: 'x', PORT: 'nope' })).toThrow(
      /OWNER_MODE_SECRET[\s\S]*PORT/
    )
  })
})
