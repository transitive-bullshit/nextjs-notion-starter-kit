import { describe, expect, it } from 'vitest'

import { parseLenses } from '../parse-lenses.mjs'

const validLens = `# Agency
id: agency
category: Systems
tagline: Ceilings are self-imposed.
bg: #f5d89a
fg: #1a1a1a
illustration: eye
reading: Some Book | https://example.com/book

Body text goes here.
`

describe('parseLenses', () => {
  it('parses a well-formed lens with no errors', () => {
    const { records, errors } = parseLenses(validLens)
    expect(errors).toEqual([])
    expect(records).toHaveLength(1)
    expect(records[0]).toMatchObject({
      id: 'agency',
      category: 'Systems',
      title: 'Agency',
      tagline: 'Ceilings are self-imposed.',
      bg: '#f5d89a',
      fg: '#1a1a1a',
      illustration: 'eye',
      body: 'Body text goes here.'
    })
    expect(records[0].readings).toEqual([
      { label: 'Some Book', href: 'https://example.com/book' }
    ])
  })

  it('reports every missing required field', () => {
    const { errors } = parseLenses(`# Incomplete\nid: incomplete\n\nBody.\n`)
    // Missing category, tagline, bg, fg, illustration.
    expect(errors.some((e) => /missing "category"/.test(e))).toBe(true)
    expect(errors.some((e) => /missing "fg"/.test(e))).toBe(true)
  })

  it('flags a malformed reading line', () => {
    const raw = validLens.replace(
      'reading: Some Book | https://example.com/book',
      'reading: no separator here'
    )
    const { errors } = parseLenses(raw)
    expect(errors.some((e) => /reading must be/.test(e))).toBe(true)
  })

  it('detects duplicate ids', () => {
    const { errors } = parseLenses(validLens + '\n' + validLens)
    expect(errors.some((e) => /duplicate id "agency"/.test(e))).toBe(true)
  })

  it('drops the doc-comment header before the first H1', () => {
    const raw = `<!-- format notes -->\nSome preamble.\n\n${validLens}`
    const { records } = parseLenses(raw)
    expect(records).toHaveLength(1)
    expect(records[0].id).toBe('agency')
  })
})
