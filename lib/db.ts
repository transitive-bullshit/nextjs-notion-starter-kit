import * as firestore from '@google-cloud/firestore'
import * as types from './types'
import * as config from './env'

export const db = new firestore.Firestore({
  projectId: config.googleProjectId,
  credentials: config.googleApplicationCredentials
})
export const images = db.collection(config.firebaseCollectionImages)

export async function get<T extends types.Model>(
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

export function getSnapshot<T extends types.Model>(
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
