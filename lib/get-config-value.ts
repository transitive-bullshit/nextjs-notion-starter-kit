import siteConfig from '../site.config'

if (!siteConfig) {
  throw new Error(`Config error: invalid site.config.js`)
}

export function getSiteConfig<T>(
  key: string,
  envKey?: string,
  defaultValue?: T
): T {
  if (envKey) {
    // allow environment variables to override site.config.js (optional)
    const envValue = process.env[envKey]

    if (envValue !== undefined) {
      return (envValue as unknown) as T
    }
  }

  const value = siteConfig[key]

  if (value !== undefined) {
    return value
  }

  if (defaultValue !== undefined) {
    return defaultValue
  }

  throw new Error(`Config error: missing required site config value "${key}"`)
}

export function getEnv(
  key: string,
  defaultValue?: string,
  env = process.env
): string {
  const value = env[key]

  if (value !== undefined) {
    return value
  }

  if (defaultValue !== undefined) {
    return defaultValue
  }

  throw new Error(`Config error: missing required env variable "${key}"`)
}
