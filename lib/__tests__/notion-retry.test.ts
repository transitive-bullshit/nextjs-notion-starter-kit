import { NotionAPI } from 'notion-client'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { RetryNotionAPI } from '../notion-api'

// Silence the retry warnings so the test output stays clean.
vi.spyOn(console, 'warn').mockImplementation(() => {})

type FetchArgs = Parameters<NotionAPI['fetch']>[0]
const args = { endpoint: 'getPage' } as unknown as FetchArgs

function makeClient(maxRetries: number) {
  return new RetryNotionAPI({}, { maxRetries, initialDelay: 1, maxDelay: 1 })
}

describe('RetryNotionAPI', () => {
  afterEach(() => vi.restoreAllMocks())

  it('retries a 429 and returns the eventual success', async () => {
    const fetchSpy = vi
      .spyOn(NotionAPI.prototype, 'fetch')
      .mockRejectedValueOnce({ statusCode: 429 })
      .mockResolvedValueOnce('ok' as never)

    await expect(makeClient(2).fetch(args)).resolves.toBe('ok')
    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })

  it('does not retry a non-retryable status and rethrows immediately', async () => {
    const fetchSpy = vi
      .spyOn(NotionAPI.prototype, 'fetch')
      .mockRejectedValueOnce({ statusCode: 400 })

    await expect(makeClient(3).fetch(args)).rejects.toMatchObject({
      statusCode: 400
    })
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('gives up after maxRetries on a persistent 503', async () => {
    const fetchSpy = vi
      .spyOn(NotionAPI.prototype, 'fetch')
      .mockRejectedValue({ statusCode: 503 })

    await expect(makeClient(2).fetch(args)).rejects.toMatchObject({
      statusCode: 503
    })
    // initial attempt + 2 retries
    expect(fetchSpy).toHaveBeenCalledTimes(3)
  })

  it('reads the status from response.status too', async () => {
    const fetchSpy = vi
      .spyOn(NotionAPI.prototype, 'fetch')
      .mockRejectedValueOnce({ response: { status: 502 } })
      .mockResolvedValueOnce('ok' as never)

    await expect(makeClient(1).fetch(args)).resolves.toBe('ok')
    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })
})
