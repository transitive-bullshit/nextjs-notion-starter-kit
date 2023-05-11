import { NextApiRequest, NextApiResponse } from 'next'

import axios from 'axios'
import { Block } from 'notion-types'
import sharp from 'sharp'

import { notion } from '@/lib/notion-api'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const blockId: string = req.query.blockId as string
  const fileId: string = req.query.fileId as string
  const fileName: string = req.query.fileName as string

  const block = await getBlockFromBlockId(blockId)

  const notionImageUrl = await getNotionImageUrl(block, fileId, fileName)

  const origImageBuffer = await axios.get(notionImageUrl, {
    responseType: 'arraybuffer'
  })

  // The vercel function has a response payload limit of 4MB.
  // For large images, the limit can be exceeded, so compress the response with webp.
  const webpImage = await sharp(origImageBuffer.data)
    .webp({ quality: 80 })
    .toBuffer()

  res.setHeader('Content-Type', 'image/webp')
  res.setHeader('Content-Length', webpImage.length)
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')

  // Send the image as a response
  res.status(200).send(webpImage)
}

const getBlockFromBlockId = async (blockId: string): Promise<Block> => {
  const blockList = await notion.getBlocks([blockId])
  return blockList.recordMap.block[blockId].value
}

const getNotionImageUrl = async (
  block: Block,
  fileId: string,
  fileName: string
): Promise<string> => {
  const s3Url = `https://s3.us-west-2.amazonaws.com/secure.notion-static.com/${fileId}/${fileName}`
  const notionImageUrlV2 = new URL(
    `https://www.notion.so/image/${encodeURIComponent(s3Url)}`
  )

  let table: string

  if (
    block.parent_table === 'space' ||
    block.parent_table == 'collection' ||
    block.parent_table == 'team'
  ) {
    table = 'block'
  } else {
    table = block.parent_table
  }

  notionImageUrlV2.searchParams.set('table', table)
  notionImageUrlV2.searchParams.set('id', block.id)
  notionImageUrlV2.searchParams.set('cache', 'v2')

  return notionImageUrlV2.toString()
}
