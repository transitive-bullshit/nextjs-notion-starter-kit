import { type Block } from 'notion-types'
import { describe, expect, it } from 'vitest'

import { isNotionFileHostUrl, mapImageUrl } from '../map-image-url'

const block = { id: '1285cb08-cf2c-806c-83d9-ce2bbaaa663f' } as Block

describe('isNotionFileHostUrl', () => {
  it('matches file.notion.com', () => {
    expect(
      isNotionFileHostUrl(
        'https://file.notion.com/f/f/abc/image.png?table=block&id=1'
      )
    ).toBe(true)
  })

  it('does not match the notion.so image proxy', () => {
    expect(
      isNotionFileHostUrl(
        'https://www.notion.so/image/https%3A%2F%2Ffile.notion.com%2Ff%2Fimage.png'
      )
    ).toBe(false)
  })
})

describe('mapImageUrl', () => {
  it('does not wrap file.notion.com URLs in the notion.so image proxy', () => {
    const url =
      'https://file.notion.com/f/f/30725683-e071-41f1-988d-e6e6fa72abd8/07ac880a-4a18-4935-b277-a439c76ce80c/image.png?table=block&id=1285cb08-cf2c-806c-83d9-ce2bbaaa663f&spaceId=30725683'

    expect(mapImageUrl(url, block)).toBe(url)
  })

  it('still proxies S3-hosted Notion files through notion.so/image', () => {
    const url =
      'https://prod-files-secure.s3.us-west-2.amazonaws.com/30725683-e071-41f1-988d-e6e6fa72abd8/c20d3edd-9bce-47ab-9643-d3bae6cdd143/photo.png'

    const mapped = mapImageUrl(url, block)
    expect(mapped).toContain('https://www.notion.so/image/')
    expect(mapped).toContain(encodeURIComponent(url))
  })

  it('leaves Unsplash URLs alone', () => {
    const url =
      'https://images.unsplash.com/photo-1620121478247-ec786b9be2fa?ixlib=rb-4.0.3'

    expect(mapImageUrl(url, block)).toBe(url)
  })
})
