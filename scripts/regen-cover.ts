/**
 * Standalone script to generate + upload cover image for the latest daily digest.
 *
 * Usage: tsx --env-file=.env scripts/regen-cover.ts [date]
 * Default date: today (UTC)
 */

import { loadConfig } from '../lib/smart-digest/config.js'
import {
  generateAndSetCover,
  loadCoverConfig
} from '../lib/smart-digest/cover-image.js'

async function main() {
  const date = process.argv[2] ?? new Date().toISOString().split('T')[0]!
  const slug = `daily-digest-${date}`
  console.log(`🔍 Looking for "${slug}" in Notion...`)

  const config = await loadConfig()
  const coverConfig = loadCoverConfig()
  if (!coverConfig) {
    console.error(
      '❌ Missing R2 env vars (R2_ACCOUNT_ID, R2_BUCKET, R2_PUBLIC_URL)'
    )
    process.exit(1)
  }

  // Find the page by slug
  const res = await fetch(
    `https://api.notion.com/v1/databases/${config.notionDatabaseId}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.notionApiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filter: {
          property: 'Slug',
          rich_text: { equals: slug }
        },
        page_size: 1
      })
    }
  )

  if (!res.ok) {
    console.error(`❌ Notion API error: ${res.status}`)
    process.exit(1)
  }

  const data = (await res.json()) as {
    results: Array<{
      id: string
      properties: {
        Name?: { title: Array<{ plain_text: string }> }
        Tags?: { multi_select: Array<{ name: string }> }
      }
    }>
  }
  const page = data.results[0]
  if (!page) {
    console.error(`❌ No page found with slug "${slug}"`)
    process.exit(1)
  }

  const pageId = page.id
  const title = page.properties.Name?.title?.[0]?.plain_text ?? slug
  const tags = page.properties.Tags?.multi_select?.map((t) => t.name) ?? []

  console.log(`✓ Found page: "${title}" (${pageId})`)

  const post = { title, slug, description: '', tags, date, content: '[]' }
  const url = await generateAndSetCover(config, coverConfig, post, pageId)
  console.log(`\n✅ Cover set: ${url}`)
}

main().catch((err) => {
  console.error('❌ Failed:', err)
  process.exit(1)
})
