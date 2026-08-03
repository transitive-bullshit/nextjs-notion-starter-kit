/**
 * Delete empty digest pages from Notion so they can be re-generated.
 */
const key = process.env.NOTION_API_KEY!
const headers = {
  Authorization: `Bearer ${key}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json'
}

const emptyPages = [
  {
    id: '3399bc44-a67b-8158-9a7b-dfc6776fcb62',
    title: 'AI Digest — 2026-04-05'
  },
  {
    id: '3399bc44-a67b-8178-834b-dcb6fd25c475',
    title: 'AI Digest — 2026-04-02'
  },
  {
    id: '3399bc44-a67b-81f8-8628-c86560aafe1c',
    title: 'AI Digest — 2026-03-30'
  }
]

async function main() {
  for (const page of emptyPages) {
    console.log(`🗑️  Archiving: ${page.title} (${page.id})`)
    const res = await fetch(`https://api.notion.com/v1/pages/${page.id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ archived: true })
    })
    if (res.ok) {
      console.log(`   ✅ Archived`)
    } else {
      const err = await res.json()
      console.error(`   ❌ Failed:`, err)
    }
  }
  console.log('\nNow re-run digest for: 2026-03-30, 2026-04-02, 2026-04-05')
}

main().catch(console.error)
