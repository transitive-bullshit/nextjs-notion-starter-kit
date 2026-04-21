import { NotionAPI } from 'notion-client'
import { type ExtendedRecordMap } from 'notion-types'
import { getBlockCollectionId, getPageContentBlockIds } from 'notion-utils'
import pMap from 'p-map'

function unwrapEntries(entries: Record<string, any> | undefined) {
  return Object.fromEntries(
    Object.entries(entries ?? {}).map(([key, entry]) => {
      const normalizedValue = entry?.value?.value ?? entry?.value
      return [key, { ...entry, value: normalizedValue }]
    })
  )
}

function normalizeRecordMap(recordMap: any): ExtendedRecordMap {
  return {
    ...recordMap,
    block: unwrapEntries(recordMap.block),
    collection: unwrapEntries(recordMap.collection),
    collection_view: unwrapEntries(recordMap.collection_view),
    notion_user: unwrapEntries(recordMap.notion_user),
    collection_query: recordMap.collection_query ?? {},
    signed_urls: recordMap.signed_urls ?? {}
  } as ExtendedRecordMap
}

class AppNotionAPI extends NotionAPI {
  override async getPage(
    pageId: string,
    {
      concurrency = 3,
      fetchMissingBlocks = true,
      fetchCollections = true,
      signFileUrls = true,
      chunkLimit = 100,
      chunkNumber = 0,
      throwOnCollectionErrors = false,
      collectionReducerLimit = 999,
      fetchRelationPages = false,
      ofetchOptions
    }: any = {}
  ) {
    const page = await this.getPageRaw(pageId, {
      chunkLimit,
      chunkNumber,
      ofetchOptions
    })

    const recordMap = normalizeRecordMap(page?.recordMap)

    if (!recordMap?.block) {
      throw new Error(`Notion page not found "${pageId}"`)
    }

    recordMap.collection = recordMap.collection ?? {}
    recordMap.collection_view = recordMap.collection_view ?? {}
    recordMap.notion_user = recordMap.notion_user ?? {}
    recordMap.collection_query = {}
    recordMap.signed_urls = {}

    if (fetchMissingBlocks) {
      while (true) {
        const pendingBlockIds = getPageContentBlockIds(recordMap).filter(
          (id) => !recordMap.block[id]
        )

        if (!pendingBlockIds.length) {
          break
        }

        const newBlocks = normalizeRecordMap(
          (await this.getBlocks(pendingBlockIds, ofetchOptions)) as any
        ).block
        recordMap.block = { ...recordMap.block, ...newBlocks }
      }
    }

    const contentBlockIds = getPageContentBlockIds(recordMap)

    if (fetchCollections) {
      const allCollectionInstances = contentBlockIds.flatMap((blockId) => {
        const block = recordMap.block[blockId]?.value
        const collectionId =
          block &&
          (block.type === 'collection_view' || block.type === 'collection_view_page') &&
          getBlockCollectionId(block, recordMap)

        return collectionId
          ? block.view_ids?.map((collectionViewId) => ({
              collectionId,
              collectionViewId
            })) || []
          : []
      })

      await pMap(
        allCollectionInstances,
        async (collectionInstance) => {
          const { collectionId, collectionViewId } = collectionInstance
          const collectionView = recordMap.collection_view[collectionViewId]?.value

          try {
            const collectionData = await this.getCollectionData(
              collectionId,
              collectionViewId,
              collectionView,
              {
                limit: collectionReducerLimit,
                ofetchOptions
              }
            )

            const normalizedCollectionData = normalizeRecordMap(
              collectionData?.recordMap || {}
            )

            recordMap.block = {
              ...recordMap.block,
              ...normalizedCollectionData.block
            }
            recordMap.collection = {
              ...recordMap.collection,
              ...normalizedCollectionData.collection
            }
            recordMap.collection_view = {
              ...recordMap.collection_view,
              ...normalizedCollectionData.collection_view
            }
            recordMap.notion_user = {
              ...recordMap.notion_user,
              ...normalizedCollectionData.notion_user
            }
            const collectionQuery = recordMap.collection_query as any
            collectionQuery[collectionId] = {
              ...collectionQuery[collectionId],
              [collectionViewId]: collectionData?.result?.reducerResults
            }
          } catch (err: any) {
            console.warn(
              'NotionAPI collectionQuery error',
              { pageId, collectionId, collectionViewId },
              err.message
            )

            if (throwOnCollectionErrors) {
              throw err
            } else {
              console.error(err)
            }
          }
        },
        { concurrency }
      )
    }

    if (signFileUrls) {
      await this.addSignedUrls({ recordMap, contentBlockIds, ofetchOptions })
    }

    if (fetchRelationPages) {
      const newBlocks = await this.fetchRelationPages(recordMap, ofetchOptions)
      recordMap.block = { ...recordMap.block, ...newBlocks }
    }

    return recordMap
  }
}

export const notion = new AppNotionAPI({
  apiBaseUrl: process.env.NOTION_API_BASE_URL
})
