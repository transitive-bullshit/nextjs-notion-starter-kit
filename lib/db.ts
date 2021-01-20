import * as firestore from '@google-cloud/firestore'
import * as types from './types'
import * as env from './env'
import { isPreviewImageSupportEnabled } from './config'

export let db = null
export let images = null

if (isPreviewImageSupportEnabled) {
  db = new firestore.Firestore({
    projectId: env.googleProjectId,
    credentials: env.googleApplicationCredentials
  })

  images = db.collection(env.firebaseCollectionImages)
}

async function get<T extends types.Model>(
  doc: firestore.DocumentReference,
  userId?: string
): Promise<T> {
  const snapshot = await doc.get()

  if (snapshot.exists) {
    const res = getSnapshot<T>(snapshot)

    if (userId && res.userId && res.userId !== userId) {
      throw {
        message: 'Unauthorized',
        status: 403
      }
    }

    return res
  }

  throw {
    message: 'Not found',
    status: 404
  }
}

function getSnapshot<T extends types.Model>(
  snapshot: firestore.DocumentSnapshot<firestore.DocumentData>
): T {
  const data = snapshot.data()
  delete data.timestamp

  return {
    ...data,
    id: snapshot.id,
    createdAt: (snapshot.createTime.toDate().getTime() / 1000) | 0,
    updatedAt: (snapshot.updateTime.toDate().getTime() / 1000) | 0
  } as T
}
