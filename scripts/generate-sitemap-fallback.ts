/**
 * Lightweight post-build script to generate sitemap-fallback.json.
 *
 * Queries Notion databases for all public pages.
 * Uses 1-2 API calls (paginated, 100 per page) instead of crawling
 * every page individually (60+ calls).
 *
 * Output: public/sitemap-fallback.json (bundled into worker assets)
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { normalizeTitle } from 'notion-utils'

const __dirname = dirname(fileURLToPath(import.meta.url))

const DEFAULT_DIGEST_DATABASE_ID = '3399bc44a67b80278628c06528b48558'
const DEFAULT_BLOG_DATABASE_ID = 'fff9bc44a67b8185a461f62cad7fc444'

const DATABASES = [
  process.env.DIGEST_DATABASE_ID,
  DEFAULT_DIGEST_DATABASE_ID,
  process.env.BLOG_DATABASE_ID,
  DEFAULT_BLOG_DATABASE_ID
]
  .filter(Boolean)
  .filter(
    (databaseId, index, databaseIds) =>
      databaseIds.indexOf(databaseId) === index
  ) as string[]

const NOTION_API_KEY =
  process.env.NOTION_API_KEY || process.env.NOTION_API_TOKEN

type NotionDatabasePage = {
  id: string
  properties: Record<string, any>
}

async function queryAllPublicSlugs(): Promise<Record<string, string>> {
  if (!NOTION_API_KEY || DATABASES.length === 0) {
    console.log(
      '⚠ No NOTION_API_KEY or database IDs — skipping fallback generation'
    )
    return {}
  }

  const map: Record<string, string> = {}
  let totalCalls = 0
  let failedCalls = 0

  for (const dbId of DATABASES) {
    let cursor: string | undefined

    do {
      const body: Record<string, unknown> = {
        filter: { property: 'Public', checkbox: { equals: true } },
        page_size: 100
      }
      if (cursor) body.start_cursor = cursor

      const res = await fetch(
        `https://api.notion.com/v1/databases/${dbId}/query`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }
      )

      totalCalls++

      if (!res.ok) {
        console.warn(`⚠ DB query failed for ${dbId}: ${res.status}`)
        failedCalls++
        break
      }

      const data = (await res.json()) as {
        results: NotionDatabasePage[]
        has_more: boolean
        next_cursor: string | null
      }

      for (const page of data.results) {
        const slug = getPageSlug(page)
        if (slug) {
          map[slug] = page.id.replace(/-/g, '')
        }
      }

      cursor = data.has_more ? (data.next_cursor ?? undefined) : undefined
    } while (cursor)
  }

  console.log(
    `✓ Found ${Object.keys(map).length} public pages (${totalCalls} API call${totalCalls > 1 ? 's' : ''})`
  )
  if (failedCalls > 0) {
    console.warn(
      `⚠ ${failedCalls} database query failed; preserving old entries`
    )
  }
  return map
}

function getPageSlug(page: NotionDatabasePage): string {
  const explicitSlug = page.properties?.Slug?.rich_text?.[0]?.plain_text
  if (explicitSlug) return explicitSlug

  const titleProperty = Object.values(page.properties).find(
    (property) => property?.type === 'title'
  )
  const title =
    titleProperty?.title?.map((part: any) => part.plain_text).join('') ?? ''

  return normalizeTitle(title)
}

function readExistingFallback(outPath: string): Record<string, string> {
  if (!existsSync(outPath)) return {}

  try {
    return JSON.parse(readFileSync(outPath, 'utf-8')) as Record<string, string>
  } catch {
    return {}
  }
}

async function main() {
  console.log('📄 Generating sitemap-fallback.json...')
  const map = await queryAllPublicSlugs()

  const outPath = join(__dirname, '..', 'public', 'sitemap-fallback.json')
  const existing = readExistingFallback(outPath)
  const merged = { ...existing, ...map }

  if (Object.keys(merged).length === 0) {
    console.log('⚠ No pages found — keeping existing fallback if any')
    return
  }

  writeFileSync(outPath, `${JSON.stringify(merged, null, 2)}\n`)
  console.log(`✓ Written ${outPath} (${Object.keys(merged).length} entries)`)
}

main().catch((err) => {
  console.error('❌ Fallback generation failed:', err)
  // Non-fatal — build continues without fresh fallback
})
