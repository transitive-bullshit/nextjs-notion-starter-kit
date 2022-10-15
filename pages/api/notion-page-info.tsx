import { NextApiRequest, NextApiResponse } from 'next'

import {
  getBlockTitle,
  getBlockIcon,
  getPageProperty,
  isUrl,
  parsePageId
} from 'notion-utils'
import { PageBlock } from 'notion-types'

import { notion } from 'lib/notion-api'
import { mapImageUrl } from 'lib/map-image-url'
import { NotionPageInfo } from 'lib/types'
import * as libConfig from 'lib/config'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const pageId: string = parsePageId(req.body.pageId)
  if (!pageId) {
    throw new Error('Invalid notion page id')
  }

  const recordMap = await notion.getPage(pageId)

  const keys = Object.keys(recordMap?.block || {})
  const block = recordMap?.block?.[keys[0]]?.value

  if (!block) {
    throw new Error('Invalid recordMap for page')
  }

  const blockSpaceId = block.space_id

  if (
    blockSpaceId &&
    libConfig.rootNotionSpaceId &&
    blockSpaceId !== libConfig.rootNotionSpaceId
  ) {
    return res.status(400).send({
      error: `Notion page "${pageId}" belongs to a different workspace.`
    })
  }

  const isBlogPost =
    block.type === 'page' && block.parent_table === 'collection'
  const title = getBlockTitle(block, recordMap) || libConfig.name
  let image = mapImageUrl(
    getPageProperty<string>('Social Image', block, recordMap) ||
      (block as PageBlock).format?.page_cover ||
      libConfig.defaultPageCover,
    block
  )

  if (image) {
    const imageUrl = new URL(image)

    if (imageUrl.host === 'images.unsplash.com') {
      if (!imageUrl.searchParams.has('w')) {
        imageUrl.searchParams.set('w', '2000')
        imageUrl.searchParams.set('fit', 'max')
        image = imageUrl.toString()
      }
    }
  }

  const imageCoverPosition =
    (block as PageBlock).format?.page_cover_position ??
    libConfig.defaultPageCoverPosition
  const imageObjectPosition = imageCoverPosition
    ? `center ${(1 - imageCoverPosition) * 100}%`
    : null

  const blockIcon = getBlockIcon(block, recordMap)
  const authorImage = mapImageUrl(
    blockIcon && isUrl(blockIcon) ? blockIcon : libConfig.defaultPageIcon,
    block
  )

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

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=30, max-age=30, stale-while-revalidate=30'
  )
  res.status(200).json(pageInfo)
}
