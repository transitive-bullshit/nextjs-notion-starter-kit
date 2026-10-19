import type * as types from '@/lib/types'
import { search } from '@/lib/notion'

const maxBodySize = 1_000_000

export async function POST(request: Request) {
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return Response.json(
      { error: 'content type must be application/json' },
      { status: 415 }
    )
  }

  const contentLength = request.headers.get('content-length')
  if (contentLength && Number(contentLength) > maxBodySize) {
    return Response.json({ error: 'request body too large' }, { status: 413 })
  }

  let input: unknown

  try {
    input = JSON.parse(await readBody(request))
  } catch (err) {
    if (err instanceof RequestBodyTooLargeError) {
      return Response.json({ error: err.message }, { status: 413 })
    }

    return Response.json({ error: 'invalid JSON body' }, { status: 400 })
  }

  const searchParams = parseSearchParams(input)
  if (!searchParams) {
    return Response.json(
      { error: 'invalid search parameters' },
      { status: 400 }
    )
  }

  console.log('<<< lambda search-notion', searchParams)
  const results = await search(searchParams)
  console.log('>>> lambda search-notion', results)

  return Response.json(results, {
    headers: {
      'Cache-Control':
        'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
    }
  })
}

async function readBody(request: Request): Promise<string> {
  const reader = request.body?.getReader()
  if (!reader) {
    return ''
  }

  const decoder = new TextDecoder()
  let body = ''
  let bodySize = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }

    bodySize += value.byteLength
    if (bodySize > maxBodySize) {
      await reader.cancel()
      throw new RequestBodyTooLargeError()
    }

    body += decoder.decode(value, { stream: true })
  }

  return body + decoder.decode()
}

function parseSearchParams(input: unknown): types.SearchParams | undefined {
  if (!isRecord(input)) {
    return
  }

  const { ancestorId, filters, limit, query, searchSessionId } = input

  if (
    typeof ancestorId !== 'string' ||
    !ancestorId ||
    typeof query !== 'string' ||
    query.length > 1000
  ) {
    return
  }

  if (
    limit !== undefined &&
    (!Number.isInteger(limit) ||
      (limit as number) < 1 ||
      (limit as number) > 100)
  ) {
    return
  }

  if (
    searchSessionId !== undefined &&
    (typeof searchSessionId !== 'string' || searchSessionId.length > 200)
  ) {
    return
  }

  if (
    filters !== undefined &&
    (!isRecord(filters) ||
      typeof filters.isDeletedOnly !== 'boolean' ||
      typeof filters.excludeTemplates !== 'boolean' ||
      typeof filters.isNavigableOnly !== 'boolean' ||
      typeof filters.requireEditPermissions !== 'boolean')
  ) {
    return
  }

  return {
    ancestorId,
    query,
    limit: limit as number | undefined,
    searchSessionId: searchSessionId as string | undefined,
    filters: filters as types.SearchParams['filters']
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

class RequestBodyTooLargeError extends Error {
  constructor() {
    super('request body too large')
  }
}
