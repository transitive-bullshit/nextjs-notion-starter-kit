import * as firestore from '@google-cloud/firestore'
import * as config from './config'

export let db: firestore.Firestore = null
export let images: firestore.CollectionReference = null

if (config.isPreviewImageSupportEnabled) {
  db = new firestore.Firestore({
    projectId: config.googleProjectId,
    credentials: config.googleApplicationCredentials
  })

  images = db.collection(config.firebaseCollectionImages)
}
