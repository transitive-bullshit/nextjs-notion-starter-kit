import {
  getAllPagesInSpace,
  getBlockValue,
  getPageProperty,
  normalizeTitle,
  uuidToId
} from 'notion-utils'

import type * as types from './types'
import * as config from './config'
import { includeNotionIdInUrls } from './config'
import { getCanonicalPageId } from './get-canonical-page-id'
import { notion } from './notion-api'

const uuid = !!includeNotionIdInUrls

const KV_KEY = 'sitemap:canonicalPageMap'
// Default: no expiry. Override via SITEMAP_KV_TTL env var (seconds).
const KV_TTL = process.env.SITEMAP_KV_TTL
  ? parseInt(process.env.SITEMAP_KV_TTL)
  : undefined

const defaultDigestDatabaseId = '3399bc44a67b80278628c06528b48558'
const defaultBlogDatabaseId = 'fff9bc44a67b8185a461f62cad7fc444'

type NotionDatabasePage = {
  id: string
  properties: Record<string, any>
}

function getSlugDatabaseIds(): string[] {
  return [
    process.env.DIGEST_DATABASE_ID,
    defaultDigestDatabaseId,
    process.env.BLOG_DATABASE_ID,
    defaultBlogDatabaseId
  ]
    .filter(Boolean)
    .filter(
      (databaseId, index, databaseIds) =>
        databaseIds.indexOf(databaseId) === index
    ) as string[]
}

// ── L1 hot cache (Cache API — per-colo, persists across isolates) ────────────

async function cacheGet(slug: string): Promise<string | null> {
  try {
    const cache = caches.default
    const cacheKey = new Request(`https://cache.internal/sitemap-slug/${slug}`)
    const response = await cache.match(cacheKey)
    if (response) return response.text()
  } catch {
    // Cache API not available (local dev)
  }
  return null
}

async function cacheSet(slug: string, notionPageId: string): Promise<void> {
  try {
    const cache = caches.default
    const cacheKey = new Request(`https://cache.internal/sitemap-slug/${slug}`)
    await cache.put(
      cacheKey,
      new Response(notionPageId, {
        headers: { 'Cache-Control': 'public, max-age=86400' }
      })
    )
  } catch {
    // Cache API not available (local dev)
  }
}

export { cacheGet as hotCacheGet }

// ── L2 KV cache (persistent, edge-distributed) ─────────────────────────────

async function getKVNamespace(): Promise<KVNamespace | null> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    const { env } = await getCloudflareContext()
    return env.SITEMAP_KV
  } catch {
    return null
  }
}

async function kvGet(): Promise<types.CanonicalPageMap | null> {
  const kv = await getKVNamespace()
  if (!kv) return null
  return kv.get(KV_KEY, 'json') as Promise<types.CanonicalPageMap | null>
}

async function kvPut(map: types.CanonicalPageMap): Promise<void> {
  const kv = await getKVNamespace()
  if (!kv) return
  await kv.put(
    KV_KEY,
    JSON.stringify(map),
    KV_TTL ? { expirationTtl: KV_TTL } : undefined
  )
}

/**
 * Append a single slug→pageId to both L1 hot cache and L2 KV.
 */
export async function kvAppendSlug(
  slug: string,
  notionPageId: string
): Promise<void> {
  // L1: update Cache API (per-colo hot cache)
  await cacheSet(slug, notionPageId)

  // L2: update KV
  try {
    const existing = (await kvGet()) ?? {}
    existing[slug] = notionPageId
    await kvPut(existing)
    console.log(`getSiteMap: KV appended ${slug}`)
  } catch {
    // non-critical
  }
}

// ── Static fallback (bundled in worker at build time) ───────────────────────

async function getStaticFallback(): Promise<types.CanonicalPageMap | null> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    const { env } = await getCloudflareContext()
    const res = await env.ASSETS.fetch(
      new URL('https://assets.local/sitemap-fallback.json')
    )
    if (res.ok) {
      return (await res.json()) as types.CanonicalPageMap
    }
  } catch {
    // not available
  }
  return null
}

// ── Main getSiteMap ─────────────────────────────────────────────────────────

export async function getSiteMap(): Promise<types.SiteMap> {
  // 1. KV cache (fastest — seeded at deploy or updated incrementally)
  const cached = await kvGet()
  if (cached) {
    console.log('getSiteMap: KV hit')
    return { site: config.site, pageMap: {}, canonicalPageMap: cached }
  }

  // 2. Static fallback JSON (bundled in worker)
  const fallback = await getStaticFallback()
  if (fallback) {
    console.log('getSiteMap: static fallback hit, re-seeding KV')
    await kvPut(fallback)
    return { site: config.site, pageMap: {}, canonicalPageMap: fallback }
  }

  // 3. Last resort — full Notion crawl (only on first request ever)
  console.warn('getSiteMap: KV + fallback miss — full Notion crawl')
  const partialSiteMap = await getAllPagesImpl(
    config.rootNotionPageId,
    config.rootNotionSpaceId ?? undefined
  )
  await kvPut(partialSiteMap.canonicalPageMap!)
  console.log('getSiteMap: wrote canonicalPageMap to KV')

  return { site: config.site, ...partialSiteMap } as types.SiteMap
}

/**
 * Try to resolve a single slug by querying Notion databases directly (1 API call per DB)
 * instead of doing a full space crawl. Returns the Notion page ID or null.
 *
 * Explicit "Slug" values are queried first. If no explicit slug matches, the
 * public database rows are scanned and compared against Notion's normalized
 * title slug behavior.
 */
export async function resolveSlugDirect(slug: string): Promise<string | null> {
  const notionApiKey =
    process.env.NOTION_API_KEY || process.env.NOTION_API_TOKEN
  if (!notionApiKey) return null

  // All databases that have a "Slug" property
  const databaseIds = getSlugDatabaseIds()

  if (databaseIds.length === 0) return null

  for (const databaseId of databaseIds) {
    try {
      const res = await fetch(
        `https://api.notion.com/v1/databases/${databaseId}/query`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${notionApiKey}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            filter: {
              and: [
                { property: 'Slug', rich_text: { equals: slug } },
                { property: 'Public', checkbox: { equals: true } }
              ]
            },
            page_size: 1
          })
        }
      )

      if (!res.ok) continue

      const data = (await res.json()) as {
        results: Array<{ id: string }>
      }

      const pageId = data.results[0]?.id
      if (pageId) {
        const cleanId = pageId.replace(/-/g, '')
        console.log(`getSiteMap: direct slug lookup hit: ${slug} → ${cleanId}`)
        await kvAppendSlug(slug, cleanId)
        return cleanId
      }

      const titleSlugPageId = await resolveTitleSlugInDatabase(
        databaseId,
        slug,
        notionApiKey
      )
      if (titleSlugPageId) return titleSlugPageId
    } catch (err) {
      console.warn(
        `getSiteMap: direct slug lookup failed for ${databaseId}: ${err}`
      )
    }
  }

  return null
}

async function resolveTitleSlugInDatabase(
  databaseId: string,
  slug: string,
  notionApiKey: string
): Promise<string | null> {
  let cursor: string | undefined

  do {
    const res = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${notionApiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filter: { property: 'Public', checkbox: { equals: true } },
          page_size: 100,
          ...(cursor ? { start_cursor: cursor } : {})
        })
      }
    )

    if (!res.ok) return null

    const data = (await res.json()) as {
      results: NotionDatabasePage[]
      has_more: boolean
      next_cursor: string | null
    }

    for (const page of data.results) {
      const titleSlug = normalizeTitle(getRestPageTitle(page))
      if (titleSlug === slug) {
        const cleanId = page.id.replace(/-/g, '')
        console.log(`getSiteMap: title slug lookup hit: ${slug} → ${cleanId}`)
        await kvAppendSlug(slug, cleanId)
        return cleanId
      }
    }

    cursor = data.has_more ? (data.next_cursor ?? undefined) : undefined
  } while (cursor)

  return null
}

function getRestPageTitle(page: NotionDatabasePage): string {
  const titleProperty = Object.values(page.properties).find(
    (property) => property?.type === 'title'
  )

  return (
    titleProperty?.title?.map((part: any) => part.plain_text).join('') ?? ''
  )
}

// ── Full Notion crawl (last resort) ─────────────────────────────────────────

const getPage = async (pageId: string, ...args: any[]) => {
  console.log('\nnotion getPage', uuidToId(pageId))
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await notion.getPage(pageId, ...args)
    } catch (err: any) {
      const is429 = err?.message?.includes('429') || err?.status === 429
      if (is429 && attempt < 2) {
        const delay = (attempt + 1) * 2000
        console.warn(
          `Rate limited on ${uuidToId(pageId)}, retrying in ${delay}ms...`
        )
        await new Promise((r) => setTimeout(r, delay))
        continue
      }
      throw err
    }
  }
  throw new Error(`Failed to load page ${pageId} after retries`)
}

async function getAllPagesImpl(
  rootNotionPageId: string,
  rootNotionSpaceId?: string,
  {
    maxDepth = 3
  }: {
    maxDepth?: number
  } = {}
): Promise<Partial<types.SiteMap>> {
  const pageMap = await getAllPagesInSpace(
    rootNotionPageId,
    rootNotionSpaceId,
    getPage,
    {
      concurrency: 1,
      maxDepth
    }
  )

  const canonicalPageMap = Object.keys(pageMap).reduce(
    (map: Record<string, string>, pageId: string) => {
      const recordMap = pageMap[pageId]
      if (!recordMap) {
        throw new Error(`Error loading page "${pageId}"`)
      }

      const block = getBlockValue(recordMap.block[pageId])
      if (
        !(getPageProperty<boolean | null>('Public', block!, recordMap) ?? false)
      ) {
        return map
      }

      const canonicalPageId = getCanonicalPageId(pageId, recordMap, {
        uuid
      })!

      if (map[canonicalPageId]) {
        console.warn('error duplicate canonical page id', {
          canonicalPageId,
          pageId,
          existingPageId: map[canonicalPageId]
        })

        return map
      } else {
        return {
          ...map,
          [canonicalPageId]: pageId
        }
      }
    },
    {}
  )

  return {
    pageMap,
    canonicalPageMap
  }
}
