/**
 * Build-time script to seed the sitemap canonicalPageMap into Cloudflare KV.
 *
 * This avoids the cold-start penalty of crawling all Notion pages on the first
 * Workers request.  It also writes a static fallback JSON that gets bundled
 * into the worker so slug resolution works even without KV.
 *
 * Usage:  tsx --env-file=.env scripts/seed-sitemap-kv.ts
 */

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

import {
  getAllPagesInSpace,
  getBlockValue,
  getPageProperty,
  uuidToId
} from 'notion-utils'

import * as config from '../lib/config'
import { getCanonicalPageId } from '../lib/get-canonical-page-id'
import { notion } from '../lib/notion-api'

// Always generate slugs without Notion IDs (production mode)
const uuid = false

const KV_NAMESPACE_ID = '7249cd7e8dca4af2bf19a2b5e76392a8'
const KV_PREVIEW_ID = '8fd4ac1b14c549d0b267dc1b09fa505a'
const KV_KEY = 'sitemap:canonicalPageMap'
const KV_TTL = 86400 // 24 hours

// ── Notion page fetcher with retry ──────────────────────────────────────────

const getPage = async (pageId: string) => {
  console.log('notion getPage', uuidToId(pageId))
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await notion.getPage(pageId)
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

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🗺️  Building canonicalPageMap from Notion…')

  const pageMap = await getAllPagesInSpace(
    config.rootNotionPageId,
    config.rootNotionSpaceId ?? undefined,
    getPage,
    { concurrency: 1, maxDepth: 3 }
  )

  const canonicalPageMap: Record<string, string> = {}

  for (const pageId of Object.keys(pageMap)) {
    const recordMap = pageMap[pageId]
    if (!recordMap) {
      console.warn(`Skipping page "${pageId}" — no recordMap`)
      continue
    }

    const block = getBlockValue(recordMap.block[pageId])
    if (
      !(getPageProperty<boolean | null>('Public', block!, recordMap) ?? false)
    ) {
      continue
    }

    const canonicalPageId = getCanonicalPageId(pageId, recordMap, { uuid })!
    if (!canonicalPageId) continue

    if (canonicalPageMap[canonicalPageId]) {
      console.warn('Duplicate canonical page id', {
        canonicalPageId,
        pageId,
        existingPageId: canonicalPageMap[canonicalPageId]
      })
      continue
    }

    canonicalPageMap[canonicalPageId] = pageId
  }

  const json = JSON.stringify(canonicalPageMap)
  const entryCount = Object.keys(canonicalPageMap).length
  console.log(`✅ Built canonicalPageMap with ${entryCount} entries`)

  // ── 1. Write to KV via wrangler ─────────────────────────────────────────

  console.log('📤 Writing to Cloudflare KV (production + preview)…')
  for (const nsId of [KV_NAMESPACE_ID, KV_PREVIEW_ID]) {
    try {
      execSync(
        `pnpm wrangler kv key put --namespace-id=${nsId} --remote "${KV_KEY}" '${json.replace(/'/g, "'\\''")}' --ttl ${KV_TTL}`,
        { stdio: 'inherit' }
      )
    } catch (err) {
      console.error(`⚠️  Failed to write to KV namespace ${nsId}:`, err)
    }
  }
  console.log('✅ KV seeded successfully')

  // ── 2. Write static fallback JSON ───────────────────────────────────────

  const fallbackPath = path.join(
    import.meta.dirname,
    '..',
    'public',
    'sitemap-fallback.json'
  )
  fs.writeFileSync(fallbackPath, json, 'utf-8')
  console.log(`✅ Static fallback written to ${fallbackPath}`)
}

main().catch((err) => {
  console.error('❌ seed-sitemap-kv failed:', err)
  process.exit(1)
})
