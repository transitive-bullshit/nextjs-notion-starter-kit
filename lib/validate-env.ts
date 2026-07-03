/**
 * Validate the *shape* of provided environment variables at startup.
 *
 * Presence of required vars is already enforced by getEnv() (it throws on the
 * server when a required var is missing). This complements that by catching
 * malformed values — a bad URL, a too-short owner secret, a non-numeric port —
 * with one clear error up front instead of a confusing downstream failure.
 *
 * Only vars that are actually set are checked, so it never fails a valid
 * minimal setup. Server-only.
 */
const MIN_OWNER_SECRET_LENGTH = 8

function isValidUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export function validateEnv(
  env: Record<string, string | undefined> = process.env
): void {
  const errors: string[] = []

  const secret = env.OWNER_MODE_SECRET
  if (secret !== undefined && secret.length < MIN_OWNER_SECRET_LENGTH) {
    errors.push(
      `OWNER_MODE_SECRET must be at least ${MIN_OWNER_SECRET_LENGTH} characters`
    )
  }

  for (const key of ['NOTION_API_BASE_URL', 'REDIS_URL'] as const) {
    const value = env[key]
    if (value !== undefined && value !== '' && !isValidUrl(value)) {
      errors.push(`${key} must be a valid URL (got "${value}")`)
    }
  }

  const port = env.PORT
  if (port !== undefined && port !== '' && !/^\d+$/.test(port)) {
    errors.push(`PORT must be a positive integer (got "${port}")`)
  }

  if (errors.length > 0) {
    throw new Error(
      `Invalid environment configuration:\n- ${errors.join('\n- ')}`
    )
  }
}
