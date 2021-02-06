import { describe, expect, it } from 'vitest'

import {
  createBlogPostingJsonLd,
  createSiteJsonLd,
  serializeJsonLd,
  type SiteIdentity
} from './json-ld'

const siteIdentity = {
  authorName: 'Ada Lovelace',
  description: 'Notes on analytical engines',
  language: 'en',
  sameAs: ['https://example.com/ada', 'https://example.com/ada'],
  siteName: 'Ada’s Notes',
  siteUrl: 'https://example.com'
} satisfies SiteIdentity

describe('JSON-LD metadata', () => {
  it('links the site, author, and blog posting with stable identifiers', () => {
    const site = createSiteJsonLd(siteIdentity)
    const article = createBlogPostingJsonLd(siteIdentity, {
      description: 'A program for the Analytical Engine',
      title: 'Note G',
      url: 'https://example.com/note-g'
    })

    expect(site['@graph'][0]).toMatchObject({
      '@type': 'Person',
      '@id': 'https://example.com/#person',
      sameAs: ['https://example.com/ada']
    })
    expect(site['@graph'][1]).toMatchObject({
      '@type': 'WebSite',
      '@id': 'https://example.com/#website',
      publisher: { '@id': 'https://example.com/#person' }
    })
    expect(article).toMatchObject({
      '@id': 'https://example.com/note-g#BlogPosting',
      author: { '@id': 'https://example.com/#person' },
      isPartOf: { '@id': 'https://example.com/#website' }
    })
  })

  it('escapes markup when serializing user-authored fields', () => {
    const article = createBlogPostingJsonLd(siteIdentity, {
      description: 'Unsafe-looking content',
      title: '</script><script>alert(1)</script>',
      url: 'https://example.com/note-g'
    })

    expect(serializeJsonLd(article)).not.toContain('</script>')
    expect(serializeJsonLd(article)).toContain('\\u003c/script>')
  })
})
