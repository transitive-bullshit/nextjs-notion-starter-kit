import { execSync } from 'node:child_process'

import { Client } from '@notionhq/client'
import { createNotionBuilder, createPage } from 'notion-helper'

import type { DigestConfig, DigestPost } from './types.js'

interface CompactBlock {
  t: string
  text?: string
  emoji?: string
  color?: string
  toggle?: boolean
  items?: string[] | Array<{ text: string; checked?: boolean }>
  headers?: string[]
  rows?: string[][]
  url?: string
  caption?: string
  language?: string
}

export interface PublishedDigestPage {
  id: string
  title: string
  description: string
  tags: string[]
  hasCover: boolean
}

/**
 * Split a string with inline **bold** and *italic* markers into an array
 * of segments that notion-helper can parse individually.
 * e.g. "**OpenAI** shipped v2" → ["**OpenAI**", " shipped v2"]
 */
function parseInlineMarkdown(text: string): string[] {
  const segments: string[] = []
  const regex = /(\*{2,3})([\s\S]*?)\1/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push(text.slice(lastIndex, match.index))
    }
    // Keep the markers so notion-helper's bold/italic regex picks them up
    segments.push(match[0])
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    segments.push(text.slice(lastIndex))
  }

  return segments.length > 0 ? segments : [text]
}

function buildPage(
  config: DigestConfig,
  post: DigestPost,
  blocks: CompactBlock[]
) {
  // notion-helper uses a plain object builder pattern

  let b = (createNotionBuilder as any)({
    limitNesting: false,
    limitChildren: false
  })
    .parentDb(config.notionDatabaseId)
    .title('Name', post.title)
    .richText('Slug', post.slug)
    .richText('Description', post.description.slice(0, 2000))
    .date('Published', post.date)
    .checkbox('Public', true)
    .multiSelect('Tags', post.tags)
    .richText('Author', config.author)

  // Start with table of contents
  b = b.tableOfContents()

  for (const block of blocks) {
    switch (block.t) {
      case 'h1':
        b = b.heading1(block.text ?? '', {
          color: block.color,
          is_toggleable: block.toggle ?? false
        })
        break

      case 'h2':
        b = b.heading2(block.text ?? '', {
          color: block.color,
          is_toggleable: block.toggle ?? false
        })
        break

      case 'h3':
        b = b.heading3(block.text ?? '', {
          color: block.color,
          is_toggleable: block.toggle ?? false
        })
        break

      case 'callout':
        b = b.callout({
          rich_text: parseInlineMarkdown(block.text ?? ''),
          icon: block.emoji ?? '💡',
          color: block.color ?? 'gray_background'
        })
        break

      case 'p':
        b = b.paragraph(parseInlineMarkdown(block.text ?? ''))
        break

      case 'quote':
        b = b.quote(parseInlineMarkdown(block.text ?? ''))
        break

      case 'bullet':
        if (Array.isArray(block.items)) {
          for (const item of block.items) {
            const text = typeof item === 'string' ? item : item.text
            b = b.bullet(parseInlineMarkdown(text))
          }
        }
        break

      case 'numbered':
        if (Array.isArray(block.items)) {
          for (const item of block.items) {
            const text = typeof item === 'string' ? item : item.text
            b = b.num(parseInlineMarkdown(text))
          }
        }
        break

      case 'todo':
        if (Array.isArray(block.items)) {
          for (const item of block.items) {
            if (typeof item === 'object' && 'text' in item) {
              b = b.toDo(parseInlineMarkdown(item.text), item.checked ?? false)
            }
          }
        }
        break

      case 'table':
        if (
          block.headers &&
          block.headers.length > 0 &&
          block.rows &&
          block.rows.length > 0
        ) {
          // Build table rows as bullet items (notion-helper table can have width issues)
          b = b.heading3(`📊 ${block.headers.join(' | ')}`)
          for (const row of block.rows) {
            b = b.bullet(row.join(' — '))
          }
        }
        break

      case 'bookmark':
        if (block.url) {
          b = b.bookmark({ url: block.url, caption: block.caption })
        }
        break

      case 'divider':
        b = b.divider()
        break

      case 'code':
        b = b.code({
          rich_text: block.text ?? '',
          language: block.language ?? 'plain text'
        })
        break

      default:
        if (block.text) {
          b = b.paragraph(block.text)
        }
    }
  }

  return b.build()
}

export async function findExistingPublicPage(
  config: DigestConfig,
  databaseId: string,
  slug: string
): Promise<string | null> {
  return (await findPublishedDigestPage(config, databaseId, slug))?.id ?? null
}

export async function findPublishedDigestPage(
  config: DigestConfig,
  databaseId: string,
  slug: string
): Promise<PublishedDigestPage | null> {
  try {
    const res = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.notionApiKey}`,
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
    if (!res.ok) return null
    const data = (await res.json()) as {
      results: Array<{
        id: string
        cover?: unknown
        properties: {
          Name?: { title?: Array<{ plain_text: string }> }
          Description?: { rich_text?: Array<{ plain_text: string }> }
          Tags?: { multi_select?: Array<{ name: string }> }
        }
      }>
    }
    const page = data.results[0]
    if (!page) return null

    // Check if the page has actual content — archive and regen if empty
    const blocksRes = await fetch(
      `https://api.notion.com/v1/blocks/${page.id}/children?page_size=5`,
      {
        headers: {
          Authorization: `Bearer ${config.notionApiKey}`,
          'Notion-Version': '2022-06-28'
        }
      }
    )
    if (blocksRes.ok) {
      const blocks = (await blocksRes.json()) as { results: unknown[] }
      if (blocks.results.length <= 1) {
        console.log(
          `🗑️  Empty page "${slug}" (${page.id}), archiving for regen...`
        )
        await fetch(`https://api.notion.com/v1/pages/${page.id}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${config.notionApiKey}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ archived: true })
        })
        return null
      }
    }

    return {
      id: page.id,
      title: page.properties.Name?.title?.[0]?.plain_text ?? slug,
      description:
        page.properties.Description?.rich_text?.[0]?.plain_text ?? '',
      tags: page.properties.Tags?.multi_select?.map((tag) => tag.name) ?? [],
      hasCover: Boolean(page.cover)
    }
  } catch {
    return null
  }
}

export async function publishToNotion(
  config: DigestConfig,
  post: DigestPost
): Promise<string> {
  const notion = new Client({ auth: config.notionApiKey })

  // Skip if a public page with this slug already exists
  const existingId = await findExistingPublicPage(
    config,
    config.notionDatabaseId,
    post.slug
  )
  if (existingId) {
    console.log(
      `⏭️  Already published (public): "${post.slug}" (${existingId}), skipping.`
    )
    return existingId
  }

  // Parse compact blocks
  let compactBlocks: CompactBlock[]
  try {
    compactBlocks = JSON.parse(post.content) as CompactBlock[]
  } catch {
    compactBlocks = [{ t: 'p', text: post.content }]
  }

  // Build page with notion-helper (handles 2K char splits + block pagination)
  const page = buildPage(config, post, compactBlocks)

  const response = await createPage({
    data: page.content,
    client: notion
  })

  // notion-helper wraps the response: { apiResponse: { id, ... }, appendedBlocks: ... }
  const apiResponse = (response as any)?.apiResponse ?? response
  const pageId = apiResponse?.id as string | undefined
  console.log(`✅ Published to Notion: ${pageId}`)

  // Update sitemap KV with the new slug → pageId mapping
  if (pageId) {
    await updateSitemapKV(post.slug, pageId.replace(/-/g, ''))
  }

  return pageId ?? ''
}

/**
 * Incrementally update the sitemap KV entry with a new slug.
 * Uses wrangler CLI (already installed in CI) to avoid raw REST API token scope issues.
 */
async function updateSitemapKV(
  slug: string,
  notionPageId: string
): Promise<void> {
  const pendingUpdate = sitemapKvUpdateQueue.then(() =>
    writeSitemapKV(slug, notionPageId)
  )
  sitemapKvUpdateQueue = pendingUpdate.catch(() => {})
  await pendingUpdate
}

let sitemapKvUpdateQueue = Promise.resolve()

async function writeSitemapKV(
  slug: string,
  notionPageId: string
): Promise<void> {
  const kvNamespaceId = '7249cd7e8dca4af2bf19a2b5e76392a8'
  const kvKey = 'sitemap:canonicalPageMap'

  try {
    // Read current map via wrangler
    let canonicalPageMap: Record<string, string> = {}
    try {
      const current = execSync(
        `wrangler kv key get --remote --namespace-id="${kvNamespaceId}" "${kvKey}"`,
        { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
      ).trim()
      if (current)
        canonicalPageMap = JSON.parse(current) as Record<string, string>
    } catch {
      // Key may not exist yet — start fresh
    }

    // Add new entry and write back
    canonicalPageMap[slug] = notionPageId
    execSync(
      `wrangler kv key put --remote --namespace-id="${kvNamespaceId}" "${kvKey}" '${JSON.stringify(canonicalPageMap)}'`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    )
    console.log(`🗺️  Sitemap KV updated: ${slug} → ${notionPageId}`)
  } catch (err) {
    console.warn(
      `⚠ Sitemap KV update error: ${err instanceof Error ? err.message : err}`
    )
  }
}
