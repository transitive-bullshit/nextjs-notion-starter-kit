import { describe, expect, it, vi } from 'vitest'

import {
  createCachedImageLoader,
  selectImageWithFallback,
  selectSocialImageBackground
} from './social-image'

const inlineImage = (url: string) => `inline:${url}`

describe('selectSocialImageBackground', () => {
  it('uses the article cover before the site fallback', async () => {
    const loadImage = vi.fn<(url: string) => Promise<string | undefined>>(
      async (url) => inlineImage(url)
    )

    const image = await selectSocialImageBackground(
      {
        pageCoverUrl: 'https://file.notion.com/signed-article-cover',
        fallbackUrl: 'https://example.com/default-cover.jpg'
      },
      loadImage
    )

    expect(image).toBe(
      inlineImage('https://file.notion.com/signed-article-cover')
    )
    expect(loadImage).toHaveBeenCalledOnce()
    expect(loadImage).toHaveBeenCalledWith(
      'https://file.notion.com/signed-article-cover'
    )
  })

  it('keeps an explicit social image ahead of the article cover', async () => {
    const loadImage = vi.fn<(url: string) => Promise<string | undefined>>(
      async (url) => inlineImage(url)
    )

    const image = await selectSocialImageBackground(
      {
        socialImageUrl: 'https://example.com/social-cover.jpg',
        pageCoverUrl: 'https://file.notion.com/signed-article-cover',
        fallbackUrl: 'https://example.com/default-cover.jpg'
      },
      loadImage
    )

    expect(image).toBe(inlineImage('https://example.com/social-cover.jpg'))
    expect(loadImage).toHaveBeenCalledOnce()
  })

  it('falls through an unavailable override before using the article cover', async () => {
    const loadImage = vi.fn<(url: string) => Promise<string | undefined>>(
      async (url) =>
        url.includes('signed-article-cover') ? inlineImage(url) : undefined
    )

    const image = await selectSocialImageBackground(
      {
        socialImageUrl: 'https://example.com/missing-social-cover.jpg',
        pageCoverUrl: 'https://file.notion.com/signed-article-cover',
        fallbackUrl: 'https://example.com/default-cover.jpg'
      },
      loadImage
    )

    expect(image).toBe(
      inlineImage('https://file.notion.com/signed-article-cover')
    )
    expect(loadImage).toHaveBeenCalledTimes(2)
  })

  it('uses the site fallback when no page image is reachable', async () => {
    const loadImage = vi.fn<(url: string) => Promise<string | undefined>>(
      async (url) =>
        url.includes('default-cover') ? inlineImage(url) : undefined
    )

    const image = await selectSocialImageBackground(
      {
        pageCoverUrl: 'https://file.notion.com/expired-article-cover',
        fallbackUrl: 'https://example.com/default-cover.jpg'
      },
      loadImage
    )

    expect(image).toBe(inlineImage('https://example.com/default-cover.jpg'))
    expect(loadImage).toHaveBeenNthCalledWith(
      1,
      'https://file.notion.com/expired-article-cover'
    )
    expect(loadImage).toHaveBeenNthCalledWith(
      2,
      'https://example.com/default-cover.jpg'
    )
  })

  it('returns undefined when the fallback also fails validation', async () => {
    const loadImage = vi.fn<(url: string) => Promise<string | undefined>>(
      async () => undefined
    )

    const image = await selectSocialImageBackground(
      {
        pageCoverUrl: 'https://example.com/missing-cover.jpg',
        fallbackUrl: 'https://example.com/missing-fallback.jpg'
      },
      loadImage
    )

    expect(image).toBeUndefined()
    expect(loadImage).toHaveBeenCalledTimes(2)
  })

  it('prepares an Unsplash URL before downloading it', async () => {
    const loadImage = vi.fn<(url: string) => Promise<string | undefined>>(
      async (url) => inlineImage(url)
    )

    const image = await selectSocialImageBackground(
      {
        socialImageUrl: 'https://images.unsplash.com/photo-123'
      },
      loadImage
    )

    const preparedUrl = 'https://images.unsplash.com/photo-123?w=1200&fit=max'
    expect(image).toBe(inlineImage(preparedUrl))
    expect(loadImage).toHaveBeenCalledWith(preparedUrl)
  })
})

describe('createCachedImageLoader', () => {
  it('downloads a shared image once across parallel selection pipelines', async () => {
    const downloadImage = vi.fn<(url: string) => Promise<string | undefined>>(
      async (url) => inlineImage(url)
    )
    const loadImage = createCachedImageLoader(downloadImage)
    const sharedUrl = 'https://example.com/shared-image.jpg'

    const [authorImage, backgroundImage] = await Promise.all([
      selectImageWithFallback([sharedUrl], undefined, loadImage),
      selectSocialImageBackground({ socialImageUrl: sharedUrl }, loadImage)
    ])

    expect(authorImage).toBe(inlineImage(sharedUrl))
    expect(backgroundImage).toBe(inlineImage(sharedUrl))
    expect(downloadImage).toHaveBeenCalledOnce()
  })

  it('shares a failed download before each pipeline tries its own fallback', async () => {
    const sharedUrl = 'https://example.com/missing-shared-image.jpg'
    const authorFallbackUrl = 'https://example.com/author-fallback.jpg'
    const backgroundFallbackUrl = 'https://example.com/background-fallback.jpg'
    const downloadImage = vi.fn<(url: string) => Promise<string | undefined>>(
      async (url) => (url === sharedUrl ? undefined : inlineImage(url))
    )
    const loadImage = createCachedImageLoader(downloadImage)

    const [authorImage, backgroundImage] = await Promise.all([
      selectImageWithFallback([sharedUrl], authorFallbackUrl, loadImage),
      selectSocialImageBackground(
        {
          socialImageUrl: sharedUrl,
          fallbackUrl: backgroundFallbackUrl
        },
        loadImage
      )
    ])

    expect(authorImage).toBe(inlineImage(authorFallbackUrl))
    expect(backgroundImage).toBe(inlineImage(backgroundFallbackUrl))
    expect(downloadImage).toHaveBeenCalledTimes(3)
    expect(
      downloadImage.mock.calls.filter(([url]) => url === sharedUrl)
    ).toHaveLength(1)
  })
})
