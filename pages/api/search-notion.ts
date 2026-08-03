import { type NextApiRequest, type NextApiResponse } from 'next'

import type * as types from '../../lib/types'
import { search } from '../../lib/notion'

export default async function searchNotion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const searchParams: types.SearchParams = req.body
  const results = await search(searchParams)

  // Normalize the recordMap from Notion's raw search response.
  // The search API returns blocks as { value: { value: {...} } }
  // but react-notion-x expects { value: {...} }.
  if (results.recordMap?.block) {
    for (const id of Object.keys(results.recordMap.block)) {
      const entry = results.recordMap.block[id] as any
      if (entry?.value?.value) {
        results.recordMap.block[id] = {
          role: entry.role ?? entry.value.role,
          value: entry.value.value
        }
      }
    }
  }

  // Also normalize collections (same double-nested issue)
  if (results.recordMap?.collection) {
    for (const id of Object.keys(results.recordMap.collection)) {
      const entry = results.recordMap.collection[id] as any
      if (entry?.value?.value) {
        results.recordMap.collection[id] = {
          role: entry.role ?? entry.value.role,
          value: entry.value.value
        }
      }
    }
  }

  // Filter out non-public pages from search results
  if (
    results.results?.length &&
    results.recordMap?.block &&
    results.recordMap?.collection
  ) {
    // Find the "Public" checkbox property ID from any collection schema
    let publicPropId: string | undefined
    for (const coll of Object.values(results.recordMap.collection)) {
      const schema = (coll as any)?.value?.schema
      if (!schema) continue
      publicPropId = Object.keys(schema).find(
        (key) =>
          schema[key]?.name === 'Public' && schema[key]?.type === 'checkbox'
      )
      if (publicPropId) break
    }

    if (publicPropId) {
      results.results = results.results.filter((r: any) => {
        const block = (results.recordMap as any).block[r.id]?.value
        if (!block?.properties) return false
        return block.properties[publicPropId!]?.[0]?.[0] === 'Yes'
      })
      results.total = results.results.length
    }
  }

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
  )
  res.status(200).json(results)
}
