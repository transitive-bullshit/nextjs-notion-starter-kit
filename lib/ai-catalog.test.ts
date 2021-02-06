import { describe, expect, it } from 'vitest'

import { createAiCatalog } from './ai-catalog'

describe('createAiCatalog', () => {
  it('creates a spec-compliant catalog entry for the agent content index', () => {
    expect(
      createAiCatalog({
        authorName: 'Travis Fischer',
        domain: 'transitivebullsh.it',
        siteName: 'Transitive Bullshit',
        siteUrl: 'https://transitivebullsh.it'
      })
    ).toEqual({
      specVersion: '1.0',
      host: {
        displayName: 'Transitive Bullshit',
        identifier: 'transitivebullsh.it'
      },
      entries: [
        {
          identifier: 'urn:air:transitivebullsh.it:docs:llms',
          displayName: 'Transitive Bullshit agent content index',
          type: 'text/markdown',
          url: 'https://transitivebullsh.it/llms.txt',
          description:
            "Markdown index of Travis Fischer's public essays and supporting pages for AI readers."
        }
      ]
    })
  })
})
