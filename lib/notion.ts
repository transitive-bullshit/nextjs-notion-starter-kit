import {
  type ExtendedRecordMap,
  type SearchParams,
  type SearchResults
} from 'notion-types'
import { getBlockValue, getPageProperty } from 'notion-utils'

import { isPreviewImageSupportEnabled, rootNotionPageId } from './config'
import { getTweetsMap } from './get-tweets'
import { notion } from './notion-api'

// Limit the daily digest gallery on the homepage to N most recent posts
const digestDatabaseId = process.env.DIGEST_DATABASE_ID || ''
const digestCollectionLimit = 4

export async function getPage(pageId: string): Promise<ExtendedRecordMap> {
  const recordMap = await notion.getPage(pageId)

  if (isPreviewImageSupportEnabled) {
    const { getPreviewImageMap } = await import('./preview-images')
    const previewImageMap = await getPreviewImageMap(recordMap)
    ;(recordMap as any).preview_images = previewImageMap
  }

  await getTweetsMap(recordMap)

  // Filter non-public pages from collection views (gallery/table on homepage)
  filterNonPublicPages(recordMap)

  // The public Notion page payload can lag behind Notion's current view order.
  applyCollectionViewSorts(recordMap)

  // Keep hidden collection views aligned with Notion's native default view.
  normalizeCollectionViewOrder(recordMap)

  // Cap the daily digest gallery on the homepage only
  const normalizedPageId = pageId.replace(/-/g, '')
  if (normalizedPageId === rootNotionPageId) {
    limitDigestCollection(recordMap)
  }

  return recordMap
}

/**
 * Removes pages where the "Public" checkbox is unchecked from all
 * collection_query results so they don't render in gallery/table views.
 */
function filterNonPublicPages(recordMap: ExtendedRecordMap): void {
  const collectionQuery = recordMap.collection_query
  if (!collectionQuery) return

  for (const collectionId of Object.keys(collectionQuery)) {
    // Find the "Public" property ID from the collection schema
    const collection = getBlockValue(recordMap.collection?.[collectionId])
    if (!collection?.schema) continue

    const publicPropId = Object.keys(collection.schema).find(
      (key) =>
        collection.schema[key]?.name === 'Public' &&
        collection.schema[key]?.type === 'checkbox'
    )
    if (!publicPropId) continue

    // Check if a block's "Public" property is "Yes"
    const isPublic = (blockId: string): boolean => {
      const block = getBlockValue(recordMap.block[blockId])
      const val = block?.properties?.[publicPropId]
      return val?.[0]?.[0] === 'Yes'
    }

    for (const viewId of Object.keys(collectionQuery[collectionId]!)) {
      const data = collectionQuery[collectionId]![viewId] as any
      if (!data) continue

      // Filter flat blockIds
      if (data.blockIds) {
        data.blockIds = data.blockIds.filter(isPublic)
      }

      // Filter grouped results (board/gallery)
      if (data.collection_group_results?.blockIds) {
        data.collection_group_results.blockIds =
          data.collection_group_results.blockIds.filter(isPublic)
      }

      // Filter per-group results (board columns)
      if (data.groupResults) {
        for (const group of data.groupResults) {
          if (group.blockIds) {
            group.blockIds = group.blockIds.filter(isPublic)
          }
        }
      }
    }
  }
}

function applyCollectionViewSorts(recordMap: ExtendedRecordMap): void {
  const collectionQuery = recordMap.collection_query
  if (!collectionQuery) return

  for (const collectionId of Object.keys(collectionQuery)) {
    const collection = getBlockValue(recordMap.collection?.[collectionId])
    if (!collection?.schema) continue

    for (const viewId of Object.keys(collectionQuery[collectionId]!)) {
      const collectionView = getBlockValue(recordMap.collection_view?.[viewId])
      const sorts = (collectionView as any)?.query2?.sort as
        | Array<{ property: string; direction: 'ascending' | 'descending' }>
        | undefined
      if (!sorts?.length) continue

      const sortBlockIds = (blockIds: string[]) =>
        blockIds.sort((a, b) => {
          const blockA = getBlockValue(recordMap.block[a])
          const blockB = getBlockValue(recordMap.block[b])
          if (!blockA || !blockB) return 0

          for (const sort of sorts) {
            const schema = collection.schema[sort.property]
            const valueA = getSortValue(blockA, sort.property, schema?.type)
            const valueB = getSortValue(blockB, sort.property, schema?.type)
            const comparison = compareSortValues(valueA, valueB)
            if (comparison !== 0) {
              return sort.direction === 'descending' ? -comparison : comparison
            }
          }

          return 0
        })

      const data = collectionQuery[collectionId]![viewId] as any
      if (data.blockIds) {
        data.blockIds = sortBlockIds(data.blockIds)
      }
      if (data.collection_group_results?.blockIds) {
        data.collection_group_results.blockIds = sortBlockIds(
          data.collection_group_results.blockIds
        )
      }
    }
  }
}

function getSortValue(block: any, propertyId: string, type?: string) {
  if (type === 'created_time') return block.created_time || 0
  if (type === 'last_edited_time') return block.last_edited_time || 0

  const property = block.properties?.[propertyId]
  if (type === 'checkbox') return property?.[0]?.[0] === 'Yes' ? 1 : 0
  if (type === 'date') {
    const date = property?.[0]?.[1]?.[0]?.[1]?.start_date
    return date ? Date.parse(date) : 0
  }

  return property?.map((part: any[]) => part[0]).join('') ?? ''
}

function compareSortValues(a: number | string, b: number | string): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b))
}

/**
 * The site hides react-notion-x's collection view dropdown, but react-notion-x
 * still restores the last selected view from localStorage. Keep only Notion's
 * first/default view so stale localStorage can't switch cards back to a table.
 */
function normalizeCollectionViewOrder(recordMap: ExtendedRecordMap): void {
  const collectionQuery = recordMap.collection_query
  if (!collectionQuery) return

  for (const blockEntry of Object.values(recordMap.block)) {
    const block = getBlockValue(blockEntry)
    if (
      block?.type !== 'collection_view' ||
      !block.collection_id ||
      !block.view_ids?.length
    ) {
      continue
    }

    const queries = collectionQuery[block.collection_id]
    if (!queries) continue

    const orderedViewIds = [
      ...block.view_ids,
      ...Object.keys(queries).filter(
        (viewId) => !block.view_ids!.includes(viewId)
      )
    ]

    const orderedQueries = {} as typeof queries
    for (const viewId of orderedViewIds) {
      const query = queries[viewId]
      if (query) orderedQueries[viewId] = query
    }

    block.view_ids = [orderedViewIds[0]!]
    collectionQuery[block.collection_id] = orderedQueries
  }
}

export async function search(params: SearchParams): Promise<SearchResults> {
  return notion.search(params)
}

/**
 * Limits the daily digest collection to show only the most recent N posts.
 * Sorts by Published date → Last edited → Created time (all descending).
 */
function limitDigestCollection(recordMap: ExtendedRecordMap): void {
  const collectionQuery = recordMap.collection_query
  if (!collectionQuery) return

  const sortBlockIds = (blockIds: string[]): string[] => {
    return blockIds.sort((a, b) => {
      const blockA = getBlockValue(recordMap.block[a])
      const blockB = getBlockValue(recordMap.block[b])
      if (!blockA || !blockB) return 0

      const pubA = getPageProperty<number>('Published', blockA, recordMap) || 0
      const pubB = getPageProperty<number>('Published', blockB, recordMap) || 0
      if (pubA !== pubB) return pubB - pubA

      const editA = blockA.last_edited_time || 0
      const editB = blockB.last_edited_time || 0
      if (editA !== editB) return editB - editA

      const createA = blockA.created_time || 0
      const createB = blockB.created_time || 0
      return createB - createA
    })
  }

  for (const collectionId of Object.keys(collectionQuery)) {
    const collection = getBlockValue(recordMap.collection?.[collectionId])
    if (!collection) continue

    // Match digest collection by parent_id (the database page ID)
    const parentId = (collection as any).parent_id?.replace(/-/g, '')
    if (parentId !== digestDatabaseId) continue

    for (const viewId of Object.keys(collectionQuery[collectionId]!)) {
      const data = collectionQuery[collectionId]![viewId] as any
      if (!data) continue

      if (data.blockIds) {
        data.blockIds = sortBlockIds(data.blockIds).slice(
          0,
          digestCollectionLimit
        )
      }
      if (data.collection_group_results?.blockIds) {
        data.collection_group_results.blockIds = sortBlockIds(
          data.collection_group_results.blockIds
        ).slice(0, digestCollectionLimit)
      }
    }
  }
}
