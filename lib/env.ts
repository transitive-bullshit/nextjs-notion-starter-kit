/**
 * Config for third-party dependencies.
 *
 * - Google Cloud (Firebase) - for simple database functionality.
 * - Fathom - simple analytics.
 *
 * @see config.ts for primary configuration.
 */

import { getEnv } from './get-env'
import { isPreviewImageSupportEnabled } from './config'

export { isPreviewImageSupportEnabled }

const defaultEnvValueForPreviewImageSupport = isPreviewImageSupportEnabled
  ? undefined
  : null

export const googleProjectId = getEnv(
  'GCLOUD_PROJECT',
  defaultEnvValueForPreviewImageSupport
)

export const googleApplicationCredentials = getGoogleApplicationCredentials()

export const firebaseCollectionImages = getEnv(
  'FIREBASE_COLLECTION_IMAGES',
  defaultEnvValueForPreviewImageSupport
)

// this hack is necessary because vercel doesn't support secret files so we need to encode our google
// credentials a base64-encoded string of the JSON-ified content
function getGoogleApplicationCredentials() {
  if (!isPreviewImageSupportEnabled) {
    return null
  }

  try {
    const googleApplicationCredentialsBase64 = getEnv(
      'GOOGLE_APPLICATION_CREDENTIALS',
      defaultEnvValueForPreviewImageSupport
    )

    return JSON.parse(
      Buffer.from(googleApplicationCredentialsBase64, 'base64').toString()
    )
  } catch (err) {
    console.error(
      'Firebase config error: invalid "GOOGLE_APPLICATION_CREDENTIALS" should be base64-encoded JSON\n'
    )

    throw err
  }
}
