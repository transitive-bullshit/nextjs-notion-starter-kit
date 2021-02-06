import { describe, expect, it, vi } from 'vitest'

vi.mock('../../../lib/config', () => ({
  author: 'Travis Fischer',
  domain: 'transitivebullsh.it',
  host: 'https://transitivebullsh.it',
  name: 'Transitive Bullshit'
}))

import { GET } from './route'

describe('GET /.well-known/ai-catalog.json', () => {
  it('serves a cacheable, cross-origin JSON catalog', async () => {
    const response = GET()

    expect(response.status).toBe(200)
    expect(response.headers.get('access-control-allow-origin')).toBe('*')
    expect(response.headers.get('cache-control')).toBe(
      'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400'
    )
    expect(response.headers.get('content-type')).toBe(
      'application/json; charset=utf-8'
    )
    expect(await response.json()).toMatchObject({
      specVersion: '1.0',
      host: {
        displayName: 'Transitive Bullshit',
        identifier: 'transitivebullsh.it'
      },
      entries: [
        {
          identifier: 'urn:air:transitivebullsh.it:docs:llms',
          type: 'text/markdown',
          url: 'https://transitivebullsh.it/llms.txt'
        }
      ]
    })
  })
})
