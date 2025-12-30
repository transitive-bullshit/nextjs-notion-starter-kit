import { type PageBlock } from 'notion-types'
import { formatDate, getBlockTitle, getPageProperty } from 'notion-utils'

import { type ExtendedRecordMap } from './types'
import { getSiteMap } from './get-site-map'
import { mapPageUrl } from './map-page-url'
import { mapImageUrl } from './map-image-url'
import { normalizeTag } from './tags'

export interface PublishedPost {
  pageId: string
  title: string
  tags: string[]
  url: string
  cover?: string | null
  published?: string | null
  publishedTime?: number | null
  summary?: string | null
  author?: string | null
}

const normalizeTags = (value: any): string[] => {
  if (!value) return []

  const tags = Array.isArray(value) ? value : [value]

  return tags
    .map((tag) => {
      if (!tag) return ''
      if (typeof tag === 'string') return tag
      if (typeof tag?.value === 'string') return tag.value
      return `${tag}`.trim()
    })
    .map((tag) => normalizeTag(tag))
    .filter(Boolean)
}

export async function getPublishedPosts(): Promise<PublishedPost[]> {
  const siteMap = await getSiteMap()
  const posts: PublishedPost[] = []

  for (const canonicalPageId of Object.keys(siteMap.canonicalPageMap)) {
    const pageId = siteMap.canonicalPageMap[canonicalPageId]
    if (!pageId) continue
    const recordMap: ExtendedRecordMap | undefined = siteMap.pageMap[pageId]
    if (!recordMap) continue

    const block = recordMap.block[pageId]?.value
    if (!block || block.type !== 'page' || block.parent_table !== 'collection') {
      continue
    }

    const title = getBlockTitle(block, recordMap) || 'Untitled'
    const tags = normalizeTags(getPageProperty('Tags', block, recordMap))
    const url = mapPageUrl(
      siteMap.site,
      recordMap,
      new URLSearchParams()
    )(pageId)
    const coverSource =
      getPageProperty<string>('Social Image', block, recordMap) ||
      getPageProperty<string>('Cover', block, recordMap) ||
      (block as PageBlock).format?.page_cover
    const cover = coverSource ? mapImageUrl(coverSource, block) : null

    const rawPublished =
      getPageProperty<number | string>('Published', block, recordMap) ||
      getPageProperty<number | string>('Date', block, recordMap) ||
      (block as PageBlock)?.created_time
    const publishedTime =
      typeof rawPublished === 'number'
        ? rawPublished
        : rawPublished
          ? Date.parse(rawPublished)
          : null

    const published = publishedTime
      ? formatDate(publishedTime, {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      : null

    const summary =
      getPageProperty<string>('Summary', block, recordMap)?.trim() ||
      getPageProperty<string>('Description', block, recordMap)?.trim() ||
      null
    const author =
      getPageProperty<string>('Author', block, recordMap)?.trim() || null

    posts.push({
      pageId,
      title,
      tags,
      url,
      cover,
      publishedTime,
      published,
      summary,
      author
    })
  }

  return posts
}
