import { Buffer } from 'node:buffer'

import ky from 'ky'
import { ImageResponse } from 'next/og'
import { type PageBlock } from 'notion-types'
import {
  getBlockIcon,
  getBlockTitle,
  getBlockValue,
  getPageProperty,
  getSignedFileUrl,
  isUrl,
  parsePageId
} from 'notion-utils'

import * as libConfig from '@/lib/config'
import interSemiBoldFont from '@/lib/fonts/inter-semibold'
import { mapImageUrl } from '@/lib/map-image-url'
import { notion } from '@/lib/notion-api'
import {
  selectImageWithFallback,
  selectSocialImageBackground
} from '@/lib/social-image'
import { type NotionPageInfo, type PageError } from '@/lib/types'

export async function GET(request: Request) {
  console.log(request.url)

  const { searchParams } = new URL(request.url)
  const pageId = parsePageId(
    searchParams.get('id') || libConfig.rootNotionPageId
  )
  if (!pageId) {
    return new Response('Invalid notion page id', { status: 400 })
  }

  const pageInfoOrError = await getNotionPageInfo({ pageId })
  if (pageInfoOrError.type === 'error') {
    return Response.json(
      { error: pageInfoOrError.error.message },
      { status: pageInfoOrError.error.statusCode }
    )
  }

  const pageInfo = pageInfoOrError.data

  return new ImageResponse(
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1F2027',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black'
      }}
    >
      {pageInfo.image && (
        <img
          src={pageInfo.image}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: pageInfo.imageObjectPosition
          }}
        />
      )}

      <div
        style={{
          position: 'relative',
          width: 900,
          height: 465,
          display: 'flex',
          flexDirection: 'column',
          border: '16px solid rgba(0,0,0,0.3)',
          borderRadius: 8
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            backgroundColor: '#fff',
            padding: 24,
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          {pageInfo.detail && (
            <div style={{ fontSize: 32, opacity: 0 }}>{pageInfo.detail}</div>
          )}

          <div
            style={{
              fontSize: 70,
              fontWeight: 700,
              fontFamily: 'Inter'
            }}
          >
            {pageInfo.title}
          </div>

          {pageInfo.detail && (
            <div style={{ fontSize: 32, opacity: 0.6 }}>{pageInfo.detail}</div>
          )}
        </div>
      </div>

      {pageInfo.authorImage && (
        <div
          style={{
            position: 'absolute',
            top: 47,
            left: 104,
            height: 128,
            width: 128,
            display: 'flex',
            borderRadius: '50%',
            border: '4px solid #fff'
          }}
        >
          <img
            src={pageInfo.authorImage}
            style={{
              width: '100%',
              height: '100%'
            }}
          />
        </div>
      )}
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: interSemiBoldFont,
          style: 'normal',
          weight: 700
        }
      ]
    }
  )
}

async function getNotionPageInfo({
  pageId
}: {
  pageId: string
}): Promise<
  | { type: 'success'; data: NotionPageInfo }
  | { type: 'error'; error: PageError }
> {
  const recordMap = await notion.getPage(pageId)

  const keys = Object.keys(recordMap?.block || {})
  const block = getBlockValue(recordMap?.block?.[keys[0]!])

  if (!block) {
    throw new Error('Invalid recordMap for page')
  }

  const blockSpaceId = block.space_id

  if (
    blockSpaceId &&
    libConfig.rootNotionSpaceId &&
    blockSpaceId !== libConfig.rootNotionSpaceId
  ) {
    return {
      type: 'error',
      error: {
        statusCode: 400,
        message: `Notion page "${pageId}" belongs to a different workspace.`
      }
    }
  }

  const isBlogPost =
    block.type === 'page' && block.parent_table === 'collection'
  const title = getBlockTitle(block, recordMap) || libConfig.name

  const imageCoverPosition =
    (block as PageBlock).format?.page_cover_position ??
    libConfig.defaultPageCoverPosition
  const imageObjectPosition = imageCoverPosition
    ? `center ${(1 - imageCoverPosition) * 100}%`
    : undefined

  const resolveImageUrl = (url: string | undefined) =>
    mapImageUrl(getSignedFileUrl(url, block, recordMap.signed_urls), block)

  const socialImageUrl = resolveImageUrl(
    getPageProperty<string>('Social Image', block, recordMap)
  )
  const pageCoverUrl = resolveImageUrl((block as PageBlock).format?.page_cover)
  const imageFallbackUrl = resolveImageUrl(libConfig.defaultPageCover)

  const blockIcon = getBlockIcon(block, recordMap)
  const authorImageBlockUrl = resolveImageUrl(
    blockIcon && isUrl(blockIcon) ? blockIcon : undefined
  )
  const authorImageFallbackUrl = resolveImageUrl(libConfig.defaultPageIcon)
  const [authorImage, selectedImage] = await Promise.all([
    selectImageWithFallback(
      [authorImageBlockUrl],
      authorImageFallbackUrl,
      isUrlReachable
    ),
    selectSocialImageBackground(
      {
        socialImageUrl,
        pageCoverUrl,
        fallbackUrl: imageFallbackUrl
      },
      isUrlReachable
    )
  ])
  const image = await inlineImageWithFallback(selectedImage, imageFallbackUrl)

  const author =
    getPageProperty<string>('Author', block, recordMap) || libConfig.author

  const publishedTime = getPageProperty<number>('Published', block, recordMap)
  const datePublished = publishedTime ? new Date(publishedTime) : undefined
  const date =
    isBlogPost && datePublished
      ? `${datePublished.toLocaleString('en-US', {
          month: 'long'
        })} ${datePublished.getFullYear()}`
      : undefined
  const detail = date || author || libConfig.domain

  const pageInfo: NotionPageInfo = {
    pageId,
    title,
    image,
    imageObjectPosition,
    author,
    authorImage,
    detail
  }

  return {
    type: 'success',
    data: pageInfo
  }
}

async function isUrlReachable(
  url: string | undefined | null
): Promise<boolean> {
  if (!url) {
    return false
  }

  try {
    const response = await ky.get(url, {
      headers: {
        Range: 'bytes=0-0'
      }
    })
    void response.body?.cancel()
    return true
  } catch {
    return false
  }
}

async function inlineImage(
  url: string | undefined
): Promise<string | undefined> {
  if (!url) return

  try {
    const response = await ky.get(url)
    const contentType = response.headers.get('content-type')?.split(';')[0]
    if (!contentType?.startsWith('image/')) return

    const image = Buffer.from(await response.arrayBuffer()).toString('base64')
    return `data:${contentType};base64,${image}`
  } catch {
    return
  }
}

async function inlineImageWithFallback(
  url: string | undefined,
  fallbackUrl: string | undefined
): Promise<string | undefined> {
  const image = await inlineImage(url)
  if (image || !fallbackUrl || fallbackUrl === url) return image

  return inlineImage(fallbackUrl)
}
