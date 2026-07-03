import { beforeEach, describe, expect, it, vi } from 'vitest'

// Hoisted mocks: replace the Notion client + heavy side-effect modules so we
// exercise only the caching wrapper in lib/notion.ts.
const { getPageMock, searchMock } = vi.hoisted(() => ({
  getPageMock: vi.fn(),
  searchMock: vi.fn()
}))

vi.mock('../notion-api', () => ({
  notion: { getPage: getPageMock, search: searchMock },
  buildNotion: {}
}))
vi.mock('../config', () => ({
  isPreviewImageSupportEnabled: false,
  navigationLinks: [],
  navigationStyle: 'default'
}))
vi.mock('../preview-images', () => ({
  getPreviewImageMap: vi.fn(async () => ({}))
}))
vi.mock('../get-tweets', () => ({
  getTweetsMap: vi.fn(async () => {})
}))

const { getPage, search } = await import('../notion')

beforeEach(() => {
  getPageMock.mockReset()
  searchMock.mockReset()
})

describe('getPage caching', () => {
  it('dedupes concurrent calls for the same page into one fetch', async () => {
    getPageMock.mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve({ block: {} }), 5))
    )

    const [a, b] = await Promise.all([getPage('dedupe'), getPage('dedupe')])

    expect(a).toEqual({ block: {} })
    expect(b).toEqual({ block: {} })
    expect(getPageMock).toHaveBeenCalledTimes(1)
  })

  it('serves a second call from cache within the TTL', async () => {
    getPageMock.mockResolvedValue({ block: {} })

    await getPage('cached')
    await getPage('cached')

    expect(getPageMock).toHaveBeenCalledTimes(1)
  })

  // TTL eviction itself is owned by expiry-map's background cleaner (a real
  // timer that doesn't advance cleanly under fake timers), so it's not
  // asserted here — this suite covers our wrapper: dedup, cache hits, and
  // that rejections aren't cached.

  it('does not cache a rejected fetch', async () => {
    getPageMock.mockRejectedValueOnce(new Error('boom'))
    await expect(getPage('flaky')).rejects.toThrow('boom')

    getPageMock.mockResolvedValueOnce({ block: {} })
    await expect(getPage('flaky')).resolves.toEqual({ block: {} })

    expect(getPageMock).toHaveBeenCalledTimes(2)
  })
})

describe('search caching', () => {
  it('caches identical search params and refetches distinct ones', async () => {
    searchMock.mockResolvedValue({ results: [] })

    await search({ query: 'a' } as never)
    await search({ query: 'a' } as never)
    await search({ query: 'b' } as never)

    expect(searchMock).toHaveBeenCalledTimes(2)
  })
})
