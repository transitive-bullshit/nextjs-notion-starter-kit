// TODO: [tagName].tsx

import { domain, isDev, rootNotionPageId } from 'lib/config'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import omit from 'lodash.omit'
import { type ExtendedRecordMap } from 'notion-types'
import { normalizeTitle } from 'notion-utils'
import React from 'react'

import { NotionPage } from '@/components/NotionPage'

const tagsPropertyNameLowerCase = 'tags'

export const getStaticProps = async (context: any) => {
  const rawTagName = (context.params.tagName as string) || ''

  try {
    const props = await resolveNotionPage(domain, rootNotionPageId)
    let propertyToFilterName: string | null = null

    if ((props as any).recordMap) {
      const recordMap = (props as any).recordMap as ExtendedRecordMap
      const collection = Object.values(recordMap.collection)[0]?.value

      if (collection) {
        const galleryView = Object.values(recordMap.collection_view).find(
          (view) => view.value?.type === 'gallery'
        )?.value

        if (galleryView) {
          const galleryBlock = Object.values(recordMap.block).find(
            (block) =>
              block.value?.type === 'collection_view' &&
              block.value.view_ids?.includes(galleryView.id)
          )

          if (galleryBlock?.value) {
            recordMap.block = {
              [galleryBlock.value.id]: galleryBlock,
              ...omit(recordMap.block, [galleryBlock.value.id])
            }

            const propertyToFilter = Object.entries(collection.schema).find(
              (property) =>
                property[1]?.name?.toLowerCase() === tagsPropertyNameLowerCase
            )
            const propertyToFilterId = propertyToFilter?.[0]
            const filteredValue = normalizeTitle(rawTagName)
            propertyToFilterName =
              propertyToFilter?.[1]?.options?.find(
                (option) => normalizeTitle(option.value) === filteredValue
              )?.value ?? null

            if (propertyToFilterId && filteredValue) {
              const query =
                recordMap.collection_query[collection.id]?.[galleryView.id]
              const queryResults = query?.collection_group_results ?? query

              if (queryResults) {
                queryResults.blockIds = queryResults.blockIds.filter((id) => {
                  const block = recordMap.block[id]?.value
                  if (!block || !block.properties) {
                    return false
                  }

                  const value = block.properties[propertyToFilterId]?.[0]?.[0]
                  if (!value) {
                    return false
                  }

                  const values = value.split(',')
                  if (
                    // eslint-disable-next-line unicorn/prefer-array-some
                    !values.find(
                      (value: string) => normalizeTitle(value) === filteredValue
                    )
                  ) {
                    return false
                  }

                  return true
                })
              }
            }
          }
        }
      }
    }

    return {
      props: {
        ...props,
        tagsPage: true,
        propertyToFilterName
      },
      revalidate: 10
    }
  } catch (err) {
    console.error('page error', domain, rawTagName, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export async function getStaticPaths() {
  if (!isDev) {
    const props = await resolveNotionPage(domain, rootNotionPageId)

    if ((props as any).recordMap) {
      const recordMap = (props as any).recordMap as ExtendedRecordMap
      const collection = Object.values(recordMap.collection)[0]?.value

      if (collection) {
        const propertyToFilterSchema = Object.entries(collection.schema).find(
          (property) =>
            property[1]?.name?.toLowerCase() === tagsPropertyNameLowerCase
        )?.[1]

        const paths = propertyToFilterSchema?.options
          ?.map((option) => normalizeTitle(option.value))
          .filter(Boolean)
          .map((slug) => `/tags/${slug}`)

        return {
          paths,
          fallback: true
        }
      }
    }
  }

  return {
    paths: [],
    fallback: true
  }
}

export default function NotionTagsPage(props: any) {
  return <NotionPage {...props} />
}
