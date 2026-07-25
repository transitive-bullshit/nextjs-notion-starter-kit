import ky from 'ky'
import { type NextApiRequest, type NextApiResponse } from 'next'
import { ImageResponse } from 'next/og'
import { type PageBlock } from 'notion-types'
import {
  getBlockIcon,
  getBlockTitle,
  getBlockValue,
  getPageProperty,
  isUrl,
  parsePageId
} from 'notion-utils'

import * as libConfig from '@/lib/config'
import interSemiBoldFont from '@/lib/fonts/inter-semibold'
import { mapImageUrl } from '@/lib/map-image-url'
import { notion } from '@/lib/notion-api'
import { type NotionPageInfo, type PageError } from '@/lib/types'

export const runtime = 'edge'

export default async function OGImage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { searchParams } = new URL(req.url!)
  const pageId = parsePageId(
    searchParams.get('id') || libConfig.rootNotionPageId
  )
  if (!pageId) {
    return new Response('Invalid notion page id', { status: 400 })
  }

  const pageInfoOrError = await getNotionPageInfo({ pageId })
  if (pageInfoOrError.type === 'error') {
    return res.status(pageInfoOrError.error.statusCode).send({
      error: pageInfoOrError.error.message
    })
  }
  const pageInfo = pageInfoOrError.data

  // @wustep: Hack to avoid double Stephen Wu / Stephen Wu on homepage.
  let detail = pageInfo.detail
  if (pageInfo.detail === pageInfo.title && pageInfo.detail === 'Stephen Wu') {
    detail = 'wustep.me'
  }

  return new ImageResponse(
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#2f3437',
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
            objectFit: 'cover'
            // TODO: satori doesn't support background-size: cover and seems to
            // have inconsistent support for filter + transform to get rid of the
            // blurred edges. For now, we'll go without a blur filter on the
            // background, but Satori is still very new, so hopefully we can re-add
            // the blur soon.

            // backgroundImage: pageInfo.image
            //   ? `url(${pageInfo.image})`
            //   : undefined,
            // backgroundSize: '100% 100%'
            // TODO: pageInfo.imageObjectPosition
            // filter: 'blur(8px)'
            // transform: 'scale(1.05)'
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
          borderRadius: 64,
          zIndex: 1
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
            textAlign: 'center',
            borderRadius: 18,
            boxShadow: '4px 6px 12px 2px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div
            style={{
              fontSize: 66,
              fontWeight: 600,
              fontFamily: 'Inter',
              letterSpacing: '-1px',
              marginTop: 64
            }}
          >
            {pageInfo.title}
          </div>

          {detail && <div style={{ fontSize: 38, opacity: 0.6 }}>{detail}</div>}
        </div>
      </div>

      {pageInfo.authorImage && (
        <div
          style={{
            position: 'absolute',
            top: 32,
            left: 82,
            height: 144,
            width: 144,
            display: 'flex',
            borderRadius: '50%',
            border: '6px solid #fff',
            boxShadow: '0 4px 12px 0 rgba(0,0,0,.4)',
            zIndex: 5,
            backgroundColor: '#fff'
          }}
        >
          <img
            src={pageInfo.authorImage}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%'
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
      ],
      // OG images are hit repeatedly by crawlers and link unfurlers and change
      // only when the page title/cover changes. Without a cache header every
      // one of those hits was a fresh Notion fetch plus a full image render on
      // a public, unauthenticated endpoint.
      headers: {
        'Cache-Control':
          'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800'
      }
    }
  )
}

export async function getNotionPageInfo({
  pageId
}: {
  pageId: string
}): Promise<
  | { type: 'success'; data: NotionPageInfo }
  | { type: 'error'; error: PageError }
> {
  const recordMap = await notion.getPage(pageId)

  const blocks = recordMap?.block ?? {}
  const firstBlockId = Object.keys(blocks)[0]
  const block = firstBlockId ? getBlockValue(blocks[firstBlockId]) : undefined

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

  const imageBlockUrl = mapImageUrl(
    getPageProperty<string>('Social Image', block, recordMap) ||
      (block as PageBlock).format?.page_cover,
    block
  )
  const imageFallbackUrl = mapImageUrl(libConfig.defaultPageCover, block)

  const blockIcon = getBlockIcon(block, recordMap)
  const authorImageBlockUrl = mapImageUrl(
    blockIcon && isUrl(blockIcon) ? blockIcon : undefined,
    block
  )
  const authorImageFallbackUrl = mapImageUrl(libConfig.defaultPageIcon, block)
  const [authorImage, image] = await Promise.all([
    getCompatibleImageUrl(authorImageBlockUrl, authorImageFallbackUrl),
    getCompatibleImageUrl(imageBlockUrl, imageFallbackUrl)
  ])

  const author =
    getPageProperty<string>('Author', block, recordMap) || libConfig.author

  // const socialDescription =
  //   getPageProperty<string>('Description', block, recordMap) ||
  //   libConfig.description

  // const lastUpdatedTime = getPageProperty<number>(
  //   'Last Updated',
  //   block,
  //   recordMap
  // )
  const publishedTime = getPageProperty<number>('Published', block, recordMap)
  const datePublished = publishedTime ? new Date(publishedTime) : undefined
  // const dateUpdated = lastUpdatedTime
  //   ? new Date(lastUpdatedTime)
  //   : publishedTime
  //   ? new Date(publishedTime)
  //   : undefined
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
    await ky.head(url)
    return true
  } catch {
    return false
  }
}

async function getCompatibleImageUrl(
  url: string | undefined | null,
  fallbackUrl: string | undefined | null
): Promise<string | undefined> {
  const image = (await isUrlReachable(url)) ? url : fallbackUrl

  if (image) {
    const imageUrl = new URL(image)

    if (imageUrl.host === 'images.unsplash.com') {
      if (!imageUrl.searchParams.has('w')) {
        imageUrl.searchParams.set('w', '1200')
        imageUrl.searchParams.set('fit', 'max')
        return imageUrl.toString()
      }
    }
  }

  return image ?? undefined
}
