import { describe, expect, it, vi } from 'vitest'

import { selectSocialImageBackground } from './social-image'

describe('selectSocialImageBackground', () => {
  it('uses the article cover before the site fallback', async () => {
    const isReachable = vi.fn<(url: string) => Promise<boolean>>(
      async () => true
    )

    const image = await selectSocialImageBackground(
      {
        pageCoverUrl: 'https://file.notion.com/signed-article-cover',
        fallbackUrl: 'https://example.com/default-cover.jpg'
      },
      isReachable
    )

    expect(image).toBe('https://file.notion.com/signed-article-cover')
    expect(isReachable).toHaveBeenCalledOnce()
    expect(isReachable).toHaveBeenCalledWith(
      'https://file.notion.com/signed-article-cover'
    )
  })

  it('keeps an explicit social image ahead of the article cover', async () => {
    const isReachable = vi.fn<(url: string) => Promise<boolean>>(
      async () => true
    )

    const image = await selectSocialImageBackground(
      {
        socialImageUrl: 'https://example.com/social-cover.jpg',
        pageCoverUrl: 'https://file.notion.com/signed-article-cover',
        fallbackUrl: 'https://example.com/default-cover.jpg'
      },
      isReachable
    )

    expect(image).toBe('https://example.com/social-cover.jpg')
    expect(isReachable).toHaveBeenCalledOnce()
  })

  it('falls through an unavailable override before using the article cover', async () => {
    const isReachable = vi.fn<(url: string) => Promise<boolean>>(
      async (url: string) => url.includes('signed-article-cover')
    )

    const image = await selectSocialImageBackground(
      {
        socialImageUrl: 'https://example.com/missing-social-cover.jpg',
        pageCoverUrl: 'https://file.notion.com/signed-article-cover',
        fallbackUrl: 'https://example.com/default-cover.jpg'
      },
      isReachable
    )

    expect(image).toBe('https://file.notion.com/signed-article-cover')
    expect(isReachable).toHaveBeenCalledTimes(2)
  })

  it('uses the site fallback when no page image is reachable', async () => {
    const isReachable = vi.fn<(url: string) => Promise<boolean>>(
      async () => false
    )

    const image = await selectSocialImageBackground(
      {
        pageCoverUrl: 'https://file.notion.com/expired-article-cover',
        fallbackUrl: 'https://example.com/default-cover.jpg'
      },
      isReachable
    )

    expect(image).toBe('https://example.com/default-cover.jpg')
  })
})
