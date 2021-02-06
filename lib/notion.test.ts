import type {
  ExtendedRecordMap,
  PreviewImageMap,
  SearchParams,
  SearchResults
} from 'notion-types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getNotionPage:
    vi.fn<(pageId: string, options?: unknown) => Promise<ExtendedRecordMap>>(),
  getPreviewImageMap:
    vi.fn<(recordMap: ExtendedRecordMap) => Promise<PreviewImageMap>>(),
  getTweetsMap: vi.fn<(recordMap: ExtendedRecordMap) => Promise<void>>(),
  searchNotion: vi.fn<(params: SearchParams) => Promise<SearchResults>>()
}))

vi.mock('./config', () => ({
  isPreviewImageSupportEnabled: true,
  navigationLinks: [{ pageId: 'navigation-page' }],
  navigationStyle: 'custom'
}))

vi.mock('./get-tweets', () => ({
  getTweetsMap: mocks.getTweetsMap
}))

vi.mock('./notion-api', () => ({
  notion: {
    getPage: mocks.getNotionPage,
    search: mocks.searchNotion
  }
}))

vi.mock('./preview-images', () => ({
  getPreviewImageMap: mocks.getPreviewImageMap
}))

import { getPage } from './notion'

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise
  })

  return { promise, resolve }
}

function createRecordMap(pageId: string): ExtendedRecordMap {
  return {
    block: {
      [pageId]: {
        role: 'reader',
        value: { id: pageId }
      }
    }
  } as unknown as ExtendedRecordMap
}

describe('getPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads the page and navigation concurrently, then enriches concurrently', async () => {
    const pageRecordMap = createRecordMap('page')
    const navigationRecordMap = createRecordMap('navigation-page')
    navigationRecordMap.block['navigation-page-child'] = {
      role: 'reader',
      value: { id: 'navigation-page-child' }
    } as never
    const previewImageMap = {
      image: {
        dataURIBase64: 'data:image/webp;base64,preview',
        originalHeight: 1,
        originalWidth: 1
      }
    } as PreviewImageMap
    const page = createDeferred<ExtendedRecordMap>()
    const navigation = createDeferred<ExtendedRecordMap>()
    const previewImages = createDeferred<PreviewImageMap>()
    const tweets = createDeferred<void>()

    mocks.getNotionPage.mockImplementation((pageId: string) => {
      if (pageId === 'page') return page.promise
      if (pageId === 'navigation-page') return navigation.promise

      throw new Error(`Unexpected page ID: ${pageId}`)
    })
    mocks.getPreviewImageMap.mockReturnValue(previewImages.promise)
    mocks.getTweetsMap.mockImplementation(
      async (recordMap: ExtendedRecordMap) => {
        await tweets.promise
        ;(
          recordMap as ExtendedRecordMap & { tweets: Record<string, unknown> }
        ).tweets = { tweet: { id: 'tweet' } }
      }
    )

    let isSettled = false
    const resultPromise = getPage('page').then((result) => {
      isSettled = true
      return result
    })

    await vi.waitFor(() => {
      expect(mocks.getNotionPage).toHaveBeenCalledTimes(2)
    })
    expect(mocks.getPreviewImageMap).not.toHaveBeenCalled()
    expect(mocks.getTweetsMap).not.toHaveBeenCalled()

    page.resolve(pageRecordMap)
    await Promise.resolve()
    expect(mocks.getPreviewImageMap).not.toHaveBeenCalled()

    navigation.resolve(navigationRecordMap)
    await vi.waitFor(() => {
      expect(mocks.getPreviewImageMap).toHaveBeenCalledOnce()
      expect(mocks.getTweetsMap).toHaveBeenCalledOnce()
    })

    const enrichedRecordMap = mocks.getPreviewImageMap.mock.calls[0]![0]
    expect(mocks.getTweetsMap).toHaveBeenCalledWith(enrichedRecordMap)
    expect(Object.keys(enrichedRecordMap.block)).toEqual([
      'page',
      'navigation-page'
    ])

    previewImages.resolve(previewImageMap)
    await Promise.resolve()
    expect(isSettled).toBe(false)

    tweets.resolve()
    const result = await resultPromise

    const enrichedResult = result as ExtendedRecordMap & {
      preview_images: PreviewImageMap
      tweets: Record<string, unknown>
    }
    expect(enrichedResult.preview_images).toBe(previewImageMap)
    expect(enrichedResult.tweets).toEqual({ tweet: { id: 'tweet' } })
  })
})
