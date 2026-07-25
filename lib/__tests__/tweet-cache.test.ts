import { beforeEach, describe, expect, it, vi } from 'vitest'

// Hoisted mocks: stub the syndication client and the Redis-backed db so we
// exercise only the caching semantics in lib/get-tweets.ts.
const { getTweetDataMock, dbGetMock, dbSetMock } = vi.hoisted(() => ({
  getTweetDataMock: vi.fn(),
  dbGetMock: vi.fn(),
  dbSetMock: vi.fn()
}))

vi.mock('react-tweet/api', () => ({ getTweet: getTweetDataMock }))
vi.mock('../db', () => ({ dbGet: dbGetMock, dbSet: dbSetMock }))

const { getTweet, getTweetsMap } = await import('../get-tweets')

beforeEach(() => {
  getTweetDataMock.mockReset()
  dbGetMock.mockReset()
  dbSetMock.mockReset()
  // Default: cache read succeeds and misses.
  dbGetMock.mockResolvedValue({ ok: true, value: undefined })
  dbSetMock.mockResolvedValue(undefined)
})

describe('getTweet caching', () => {
  it('dedupes concurrent calls for the same tweet into one fetch', async () => {
    getTweetDataMock.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ id: '1' }), 5))
    )

    await Promise.all([getTweet('1'), getTweet('1')])

    expect(getTweetDataMock).toHaveBeenCalledTimes(1)
  })

  it('caches a genuinely-missing tweet so it is not refetched', async () => {
    // react-tweet resolves `undefined` for deleted/private/404 tweets — a
    // durable fact worth caching.
    getTweetDataMock.mockResolvedValue(undefined)

    const first = await getTweet('2')
    const second = await getTweet('2')

    expect(first).toBeNull()
    expect(second).toBeNull()
    expect(getTweetDataMock).toHaveBeenCalledTimes(1)
  })

  it('does not cache a transient failure', async () => {
    // A 429/5xx throws out of react-tweet. Caching that would blank a
    // perfectly good embed for the life of the process.
    getTweetDataMock.mockRejectedValueOnce(new Error('429'))
    await expect(getTweet('3')).rejects.toThrow('429')

    getTweetDataMock.mockResolvedValueOnce({ id: '3' })
    await expect(getTweet('3')).resolves.toMatchObject({ id: '3' })

    expect(getTweetDataMock).toHaveBeenCalledTimes(2)
  })

  it('does not persist a transient failure to the shared db cache', async () => {
    getTweetDataMock.mockRejectedValueOnce(new Error('503'))

    await expect(getTweet('4')).rejects.toThrow('503')

    expect(dbSetMock).not.toHaveBeenCalled()
  })

  it('skips the write-back when the cache read errored', async () => {
    dbGetMock.mockResolvedValue({ ok: false })
    getTweetDataMock.mockResolvedValue({ id: '5' })

    await getTweet('5')

    expect(dbSetMock).not.toHaveBeenCalled()
  })
})

describe('getTweetsMap', () => {
  it('contains a per-tweet failure instead of failing the page render', async () => {
    getTweetDataMock.mockRejectedValue(new Error('boom'))
    vi.spyOn(console, 'warn').mockImplementation(() => {})

    const recordMap = {
      block: {
        b1: {
          value: {
            id: 'b1',
            type: 'tweet',
            properties: { source: [['https://twitter.com/x/status/6']] }
          }
        }
      },
      collection: {},
      collection_view: {},
      notion_user: {},
      signed_urls: {}
    } as never

    await expect(getTweetsMap(recordMap)).resolves.toBeUndefined()
    expect((recordMap as { tweets?: unknown }).tweets).toEqual({ '6': null })
  })
})
