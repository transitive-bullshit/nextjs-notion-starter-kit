import { NextApiRequest, NextApiResponse } from 'next'

import axios from 'axios'
import sharp from 'sharp'

import { notion } from '@/lib/notion-api'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const blockId: string = req.query.blockId as string
  // Currently unused, but takes a parameter to change the cache key if the original image is replaced by a file with Replace Image in Notion.
  // const fileId: string = req.query.fileId as string
  // const fileName : string = req.query.fileName as string

  const sourceUrl = await extractImageSourceUrlFromBlockId(blockId)
  const signedImageUrl = await getSignedUrl(blockId, sourceUrl)

  const origImageBuffer = await axios.get(signedImageUrl, {
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

const extractImageSourceUrlFromBlockId = async (
  blockId: string
): Promise<string> => {
  const blockList = await notion.getBlocks([blockId])
  const imageBlock = blockList.recordMap.block[blockId].value

  return imageBlock.properties.source?.[0]?.[0]
}

const getSignedUrl = async (
  blockId: string,
  sourceUrl: string
): Promise<string> => {
  const signedUrlResponse = await notion.getSignedFileUrls([
    {
      permissionRecord: {
        table: 'block',
        id: blockId
      },
      url: sourceUrl
    }
  ])

  return signedUrlResponse.signedUrls[0]
}
