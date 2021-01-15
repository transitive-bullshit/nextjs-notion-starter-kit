import crypto from 'crypto'
import got from 'got'

import { api } from './env'
import * as types from './types'
import * as db from './db'

function sha256(input: Buffer | string) {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input)
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

export async function getPreviewImages(
  images: string[]
): Promise<types.PreviewImageMap> {
  const imageDocRefs = images.map((url) => {
    const id = sha256(url)
    return db.images.doc(id)
  })

  if (!imageDocRefs.length) {
    return {}
  }

  const imageDocs = await db.db.getAll(...imageDocRefs)
  const results = imageDocs.map((model, index) => {
    if (model.exists) {
      return model.data() as types.PreviewImage
    } else {
      // fire and forget
      got.post(api.createPreviewImage, {
        json: {
          url: images[index],
          id: model.id
        }
      })
    }
  })

  return results
    .filter(Boolean)
    .filter((image) => !image.error)
    .reduce(
      (acc, result) => ({
        ...acc,
        [result.url]: result
      }),
      {}
    )
}
