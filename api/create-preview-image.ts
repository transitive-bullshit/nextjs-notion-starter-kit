import { NextApiRequest, NextApiResponse } from 'next'

import got from 'got'
import lqip from 'lqip-modern'

import { isPreviewImageSupportEnabled } from '../lib/config'
import * as types from '../lib/types'
import * as db from '../lib/db'

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  if (!isPreviewImageSupportEnabled) {
    return res.status(418).send({
      error: 'preview image support has been disabled for this deployment'
    })
  }

  const { url, id } = req.body

  const result = await createPreviewImage(url, id)

  res.setHeader(
    'Cache-Control',
    result.error
      ? 'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
      : 'public, immutable, s-maxage=31536000, max-age=31536000, stale-while-revalidate=60'
  )
  res.status(200).json(result)
}

export async function createPreviewImage(
  url: string,
  id: string
): Promise<types.PreviewImage> {
  console.log('createPreviewImage lambda', { url, id })
  const doc = db.images.doc(id)

  try {
    const model = await doc.get()
    if (model.exists) {
      return model.data() as types.PreviewImage
    }

    const { body } = await got(url, { responseType: 'buffer' })
    const result = await lqip(body)
    console.log('lqip', result.metadata)

    const image = {
      url,
      originalWidth: result.metadata.originalWidth,
      originalHeight: result.metadata.originalHeight,
      width: result.metadata.width,
      height: result.metadata.height,
      type: result.metadata.type,
      dataURIBase64: result.metadata.dataURIBase64
    }

    await doc.create(image)
    return image
  } catch (err) {
    console.error('lqip error', err)

    try {
      const error: any = {
        url,
        error: err.message || 'unknown error'
      }

      if (err?.response?.statusCode) {
        error.statusCode = err?.response?.statusCode
      }

      await doc.create(error)
      return error
    } catch (err) {
      // ignore errors
      console.error(err)
    }
  }
}
