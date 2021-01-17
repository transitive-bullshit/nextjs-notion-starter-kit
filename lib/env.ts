/**
 * Config for third-party dependencies.
 *
 * - Google Cloud (Firebase) - used very simple database functionality.
 * - Fathom - simple analytics.
 *
 * @see config.ts for primary configuration.
 */

import { getEnv } from './get-env'

export const googleProjectId = getEnv('GCLOUD_PROJECT')

export let googleApplicationCredentials

// this hack is necessary because vercel doesn't support secret files so we need to encode our google
// credentials a base64-encoded string of the JSON-ified content
try {
  const googleApplicationCredentialsBase64 = getEnv(
    'GOOGLE_APPLICATION_CREDENTIALS'
  )
  googleApplicationCredentials = JSON.parse(
    Buffer.from(googleApplicationCredentialsBase64, 'base64').toString()
  )
} catch (err) {
  console.error(
    'Firebase config error: invalid "GOOGLE_APPLICATION_CREDENTIALS" should be base64-encoded JSON\n'
  )
  throw err
}

export const firebaseCollectionImages = getEnv('FIREBASE_COLLECTION_IMAGES')
