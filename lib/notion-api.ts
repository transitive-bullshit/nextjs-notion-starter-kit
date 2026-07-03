import { NotionAPI } from 'notion-client'

const RETRY_STATUS_CODES = new Set([429, 502, 503, 504])

const RUNTIME_MAX_RETRIES = 1
const RUNTIME_RETRY_DELAY_MS = 1100

const BUILD_MAX_RETRIES = 5
const BUILD_INITIAL_DELAY_MS = 5000
const BUILD_MAX_DELAY_MS = 60_000
const BUILD_MIN_FETCH_INTERVAL_MS = 1100

class RetryNotionAPI extends NotionAPI {
  constructor(
    opts: ConstructorParameters<typeof NotionAPI>[0],
    private retryOpts: {
      maxRetries: number
      initialDelay: number
      maxDelay: number
    }
  ) {
    super(opts)
  }

  override async fetch<T>(args: Parameters<NotionAPI['fetch']>[0]): Promise<T> {
    const { maxRetries, initialDelay, maxDelay } = this.retryOpts
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await super.fetch<T>(args)
      } catch (err: unknown) {
        const e = err as {
          statusCode?: number
          status?: number
          response?: { status?: number }
        }
        const status = e?.statusCode ?? e?.status ?? e?.response?.status
        if (
          attempt < maxRetries &&
          status !== undefined &&
          RETRY_STATUS_CODES.has(status)
        ) {
          const delay = Math.min(initialDelay * 2 ** attempt, maxDelay)
          console.warn(
            `Notion API ${args.endpoint} returned ${status}, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`
          )
          await new Promise((r) => setTimeout(r, delay))
          continue
        }
        throw err
      }
    }
    throw new Error('Unreachable')
  }
}

/**
 * Standard client with short retry for runtime use (ISR, API routes).
 * Retries 429/5xx once after a short delay to handle transient errors.
 */
export const notion = new RetryNotionAPI(
  { apiBaseUrl: process.env.NOTION_API_BASE_URL },
  {
    maxRetries: RUNTIME_MAX_RETRIES,
    initialDelay: RUNTIME_RETRY_DELAY_MS,
    maxDelay: RUNTIME_RETRY_DELAY_MS
  }
)

/**
 * Rate-limited client for build-time sitemap generation.
 * Serializes all fetch calls with a 1.2s gap to stay under the 300 req/300s
 * rate limit, and retries on 429/5xx with longer exponential backoff.
 */
class BuildNotionAPI extends RetryNotionAPI {
  private queue: Promise<void> = Promise.resolve()

  override async fetch<T>(args: Parameters<NotionAPI['fetch']>[0]): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue = this.queue.then(async () => {
        try {
          const result = await super.fetch<T>(args)
          resolve(result)
        } catch (err) {
          reject(err)
        }
        await new Promise((r) => setTimeout(r, BUILD_MIN_FETCH_INTERVAL_MS))
      })
    })
  }
}

export const buildNotion = new BuildNotionAPI(
  { apiBaseUrl: process.env.NOTION_API_BASE_URL },
  {
    maxRetries: BUILD_MAX_RETRIES,
    initialDelay: BUILD_INITIAL_DELAY_MS,
    maxDelay: BUILD_MAX_DELAY_MS
  }
)
