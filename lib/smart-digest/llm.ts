import type { DigestConfig, LLMMessage, LLMModelsResponse } from './types.js'

const MAX_RETRIES = 3
const INITIAL_BACKOFF_MS = 2_000

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  retries = MAX_RETRIES
): Promise<Response> {
  let lastError: Error | undefined

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, init)

      if (res.ok) return res

      // Don't retry client errors (4xx) except 429 (rate limit)
      if (res.status >= 400 && res.status < 500 && res.status !== 429) {
        const text = await res.text()
        throw new Error(`LLM API error ${res.status}: ${text}`)
      }

      // Retry on 429 and 5xx
      const text = await res.text()
      lastError = new Error(`LLM API error ${res.status}: ${text}`)
    } catch (err) {
      // Re-throw non-retryable errors (4xx except 429) — don't retry these
      const msg = err instanceof Error ? err.message : ''
      if (msg.startsWith('LLM API error')) {
        throw err
      }

      // Network error — LLM is offline
      lastError = new Error(`LLM offline: ${msg}`)
    }

    if (attempt < retries) {
      const delay = INITIAL_BACKOFF_MS * 2 ** attempt
      console.warn(
        `  ⚠ LLM request failed (attempt ${attempt + 1}/${retries + 1}), retrying in ${(delay / 1000).toFixed(0)}s...`
      )
      await sleep(delay)
    }
  }

  throw lastError ?? new Error('LLM request failed after retries')
}

export async function chatCompletion(
  config: DigestConfig,
  messages: LLMMessage[],
  options?: {
    temperature?: number
    maxTokens?: number
    jsonMode?: boolean
    disableThinking?: boolean
  }
): Promise<string> {
  const isMiMo = /xiaomimimo\.com/i.test(config.llmBaseUrl)
  const body: Record<string, unknown> = {
    model: config.llmModel,
    messages,
    temperature: options?.temperature ?? 0.7,
    stream: false
  }

  if (isMiMo) {
    body.max_completion_tokens = options?.maxTokens ?? 4096
    if (options?.jsonMode) body.response_format = { type: 'json_object' }
    if (options?.disableThinking) body.thinking = { type: 'disabled' }
  } else {
    body.max_tokens = options?.maxTokens ?? 4096
  }

  const res = await fetchWithRetry(`${config.llmBaseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.llmApiKey}`
    },
    body: JSON.stringify(body)
  })

  const data = (await res.json()) as {
    choices?: Array<{
      finish_reason?: string
      message?: { content?: string }
    }>
    usage?: {
      prompt_tokens?: number
      completion_tokens?: number
      total_tokens?: number
    }
  }

  const choice = data.choices?.[0]
  console.log(
    `  LLM response: chars=${choice?.message?.content?.length ?? 0}, ` +
      `finish_reason=${choice?.finish_reason ?? 'unknown'}, ` +
      `completion_tokens=${data.usage?.completion_tokens ?? 'unknown'}`
  )
  return choice?.message?.content ?? ''
}

export async function fetchModels(
  config: Pick<DigestConfig, 'llmBaseUrl' | 'llmApiKey'>
): Promise<LLMModelsResponse> {
  const res = await fetchWithRetry(
    `${config.llmBaseUrl}/models`,
    {
      headers: {
        Authorization: `Bearer ${config.llmApiKey}`
      }
    },
    1 // only 1 retry for model discovery
  )

  return res.json() as Promise<LLMModelsResponse>
}
