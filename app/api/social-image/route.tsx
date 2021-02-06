import { Buffer } from 'node:buffer'

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
  createCachedImageLoader,
  selectImageWithFallback,
  selectSocialImageBackground
} from '@/lib/social-image'
import { type NotionPageInfo, type PageError } from '@/lib/types'

const socialImageResponseHeaders = {
  'Cache-Control': 'public, max-age=60',
  'Vercel-CDN-Cache-Control': 'public, max-age=60, stale-while-revalidate=300'
}

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
            paddingTop: 48,
            paddingBottom: 48,
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              fontSize: 70,
              fontWeight: 700,
              fontFamily: 'Inter',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
              // TODO: text-wrap 'balance' currently seems broken
              // textWrap: 'balance',
              // wordBreak: 'break-word'
            }}
          >
            {pageInfo.title}
          </div>

          {/* {pageInfo.description && (
            <div
              style={{
                fontSize: 24,
                opacity: 0.8,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
                // TODO: text-wrap 'balance' currently seems broken
                // textWrap: 'balance',
                // wordBreak: 'break-word'
              }}
            >
              {pageInfo.description}
            </div>
          )} */}

          {pageInfo.detail && (
            <div
              style={{
                fontSize: 24,
                opacity: 0.6,
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'clip'
              }}
            >
              {pageInfo.detail}
            </div>
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
      headers: socialImageResponseHeaders,
      // debug: true,
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
  const loadImage = createCachedImageLoader(fetchAndInlineImage)
  const [authorImage, image] = await Promise.all([
    selectImageWithFallback(
      [authorImageBlockUrl],
      authorImageFallbackUrl,
      loadImage
    ),
    selectSocialImageBackground(
      {
        socialImageUrl,
        pageCoverUrl,
        fallbackUrl: imageFallbackUrl
      },
      loadImage
    )
  ])

  const author =
    getPageProperty<string>('Author', block, recordMap) || libConfig.author
  const description =
    getPageProperty<string>('Description', block, recordMap) ||
    libConfig.description

  const publishedTime = getPageProperty<number>('Published', block, recordMap)
  const datePublished = publishedTime ? new Date(publishedTime) : undefined
  const date =
    isBlogPost && datePublished
      ? `Published ${datePublished.toLocaleString('en-US', {
          month: 'long'
        })} ${datePublished.getFullYear()}`
      : undefined
  const detail = date || (author ? `By ${author}` : libConfig.domain)

  const pageInfo: NotionPageInfo = {
    pageId,
    title,
    description,
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

async function fetchAndInlineImage(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) {
      await response.body?.cancel()
      return
    }

    const contentType = response.headers.get('content-type')?.split(';')[0]
    if (!contentType?.startsWith('image/')) {
      await response.body?.cancel()
      return
    }

    const image = Buffer.from(await response.arrayBuffer()).toString('base64')
    return `data:${contentType};base64,${image}`
  } catch {
    return
  }
}
