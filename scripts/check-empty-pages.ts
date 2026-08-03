const dbId = '3399bc44a67b80278628c06528b48558'
const key = process.env.NOTION_API_KEY!
const headers = {
  Authorization: `Bearer ${key}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json'
}

async function queryPages() {
  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
      page_size: 40
    })
  })
  return (await res.json()) as any
}

async function getBlockChildren(pageId: string) {
  const res = await fetch(
    `https://api.notion.com/v1/blocks/${pageId}/children?page_size=5`,
    { headers }
  )
  return (await res.json()) as any
}

async function main() {
  const data = await queryPages()
  if (!data.results) {
    console.error('API error:', JSON.stringify(data, null, 2))
    return
  }
  console.log(`Found ${data.results.length} pages\n`)

  for (const page of data.results) {
    const props = page.properties
    const title =
      props?.Name?.title?.[0]?.plain_text ||
      props?.title?.title?.[0]?.plain_text ||
      '?'
    const date = props?.Date?.date?.start || '?'

    const blocks = await getBlockChildren(page.id)
    const blockCount = blocks.results?.length ?? 0
    const flag =
      blockCount <= 1
        ? `❌ ONLY ${blockCount} blocks`
        : `✅ ${blockCount}+ blocks`

    console.log(`${date}  ${page.id}  ${flag}  ${title.slice(0, 60)}`)

    // Show detail for suspicious pages (0 or 1 block)
    if (blockCount <= 1 && title.includes('Digest')) {
      for (const b of blocks.results || []) {
        console.log(
          `   → ${b.type}: ${JSON.stringify(b[b.type]?.rich_text?.[0]?.plain_text || b[b.type]?.caption || '').slice(0, 120)}`
        )
      }
    }
  }
}

main().catch(console.error)
