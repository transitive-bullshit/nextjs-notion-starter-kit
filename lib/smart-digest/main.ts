import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import pMap from 'p-map'

import type { DigestConfig } from './types.js'
import { loadConfig } from './config.js'
import { generateAndSetCover, loadCoverConfig } from './cover-image.js'
import { extractEntities } from './extract.js'
import { fetchReports } from './fetch-reports.js'
import { findPublishedDigestPage, publishToNotion } from './notion-publish.js'
import { deduplicateEntities } from './novelty.js'
import { generatePost } from './writer.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = join(__dirname, 'data')

async function runPipeline(
  config: DigestConfig,
  today: string,
  dryRun: boolean,
  skipPublish: boolean
) {
  const slug = `daily-digest-${today}`
  console.log(`\n📅 Date: ${today}`)

  // Early check: recover a missing cover or skip an already complete page
  if (!dryRun) {
    const existingPage = await findPublishedDigestPage(
      config,
      config.notionDatabaseId,
      slug
    )
    if (existingPage) {
      if (existingPage.hasCover) {
        console.log(
          `⏭️  Already published with cover: "${slug}" (${existingPage.id}), skipping.`
        )
        return
      }

      const coverConfig = loadCoverConfig()
      if (!coverConfig) {
        console.warn(
          `⚠ Missing cover config for "${slug}", skipping cover recovery.`
        )
        return
      }

      console.log(`🎨 Published page missing cover: "${slug}", recovering...`)
      try {
        await generateAndSetCover(
          config,
          coverConfig,
          {
            title: existingPage.title,
            slug,
            description: existingPage.description,
            tags: existingPage.tags,
            date: today,
            content: '[]'
          },
          existingPage.id
        )
      } catch (err) {
        console.warn(
          `⚠ Cover recovery failed for "${slug}": ${err instanceof Error ? err.message : err}`
        )
      }
      return
    }
  }

  // Step 1: Fetch reports
  const reports = await fetchReports(today)

  if (reports.length === 0) {
    console.log('No reports found. Exiting.')
    return
  }

  // Step 2: Extract entities (parallel)
  console.log('\n🔍 Extracting entities...')
  const extractions = await extractEntities(config, reports)
  const totalEntities = extractions.reduce(
    (sum, e) => sum + e.entities.length,
    0
  )
  console.log(`Total entities extracted: ${totalEntities}`)

  if (totalEntities === 0) {
    console.log('No entities extracted (LLM may be offline).')
    return
  }

  // Step 3: Deduplicate entities
  const entities = deduplicateEntities(extractions)
  console.log(`📊 ${entities.length} unique entities after dedup`)

  if (entities.length === 0) {
    console.log('No entities after dedup. Nothing to write.')
    return
  }

  // Step 4: Generate post
  console.log('\n✍️  Generating digest post...')
  const post = await generatePost(config, entities, today)

  console.log(`Title: ${post.title}`)
  console.log(`Tags: ${post.tags.join(', ')}`)

  // Always save digest data for CI artifact upload
  await mkdir(OUTPUT_DIR, { recursive: true })
  const previewPath = join(OUTPUT_DIR, `digest-${today}.json`)
  const preview = JSON.stringify(
    {
      title: post.title,
      slug: post.slug,
      description: post.description,
      tags: post.tags,
      date: today,
      blocks: JSON.parse(post.content)
    },
    null,
    2
  )
  await writeFile(previewPath, preview, 'utf-8')
  console.log(`\n📄 Digest saved: ${previewPath}`)

  if (dryRun || skipPublish) {
    console.log(`(${dryRun ? 'dry run' : 'skip-publish'} — not published)`)
    return
  }

  // Guard: don't publish empty fallback pages (writer JSON parse failed)
  const parsedBlocks = JSON.parse(post.content) as unknown[]
  if (parsedBlocks.length === 0) {
    console.log(
      '⚠ Skipping publish: writer produced no blocks (fallback). Will retry next run.'
    )
    return
  }

  // Step 5: Publish to Notion
  console.log('\n📤 Publishing to Notion...')
  const pageId = await publishToNotion(config, post)

  // Step 6: Generate and set cover image
  const coverConfig = loadCoverConfig()
  if (coverConfig && pageId) {
    try {
      await generateAndSetCover(config, coverConfig, post, pageId)
    } catch (err) {
      console.warn(
        `⚠ Cover image failed: ${err instanceof Error ? err.message : err}`
      )
    }
  }

  console.log('\n✅ Done!')
}

function getDateRange(days: number): string[] {
  const dates: string[] = []
  const now = new Date()
  for (let i = days; i >= 0; i--) {
    const d = new Date(now)
    d.setUTCDate(d.getUTCDate() - i)
    dates.push(d.toISOString().split('T')[0]!)
  }
  return dates
}

function getGenerationConcurrency(): number {
  const parsed = Number.parseInt(
    process.env.DAILY_DIGEST_GEN_CONCURRENT ?? '5',
    10
  )
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5
}

// Backfill jobs use p-map's bounded concurrency.

async function main() {
  const args = process.argv.slice(2)
  const dateArg = args.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a))
  const dryRun = args.includes('--dry-run')
  const skipPublish = args.includes('--skip-publish')
  const backfillArg = args.find((a) => a.startsWith('--backfill'))
  const backfillDays = backfillArg
    ? parseInt(backfillArg.split('=')[1] ?? '7', 10)
    : 0

  console.log('🚀 Smart Digest Pipeline')
  console.log('========================\n')

  const config = await loadConfig()

  if (dateArg) {
    // Explicit date: run exactly that date
    await runPipeline(config, dateArg, dryRun, skipPublish)
  } else if (backfillDays > 0) {
    // Backfill mode: recover missing posts and covers through one bounded pool
    const dates = getDateRange(backfillDays)
    const concurrency = getGenerationConcurrency()
    console.log(
      `🔄 Backfill mode: checking ${dates.length} dates (last ${backfillDays} days + today) with concurrency ${concurrency}\n`
    )
    await pMap(
      dates,
      (date) => runPipeline(config, date, dryRun, skipPublish),
      { concurrency }
    )
  } else {
    // Default: today only
    const today = new Date().toISOString().split('T')[0]!
    await runPipeline(config, today, dryRun, skipPublish)
  }
}

main().catch((err) => {
  console.error('❌ Pipeline failed:', err)
  process.exit(1)
})
