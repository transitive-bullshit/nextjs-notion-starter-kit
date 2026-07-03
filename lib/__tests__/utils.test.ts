import { describe, expect, it } from 'vitest'

import { cn } from '../utils'

describe('cn', () => {
  it('joins truthy class values', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('drops falsy values and supports conditional objects', () => {
    expect(cn('a', false, null, undefined, { b: true, c: false })).toBe('a b')
  })

  it('merges conflicting tailwind classes, last one wins', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })
})
