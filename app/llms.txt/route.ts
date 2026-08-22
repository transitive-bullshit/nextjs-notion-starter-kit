import { type ExtendedRecordMap } from 'notion-types'
import {
  getBlockParentPage,
  getBlockTitle,
  getBlockValue,
  idToUuid,
  parsePageId
} from 'notion-utils'

import * as config from '@/lib/config'
import { getSiteMap } from '@/lib/get-site-map'

export const revalidate = 28_800

interface PublicPageSummary {
  isArticle: boolean
  title: string
  url: string
}

export async function GET() {
  const siteMap = await getSiteMap()
  const pages = Object.entries(siteMap.canonicalPageMap)
    .flatMap(([pagePath, pageId]): PublicPageSummary[] => {
      if (
        !pagePath ||
        parsePageId(pageId) === parsePageId(config.rootNotionPageId)
      ) {
        return []
      }

      const recordMap = siteMap.pageMap[pageId] as ExtendedRecordMap | undefined
      if (!recordMap) return []

      const firstBlockKey = Object.keys(recordMap.block)[0]
      const block = firstBlockKey
        ? getBlockValue(recordMap.block[firstBlockKey])
        : undefined
      if (!block) return []

      const parentPage = getBlockParentPage(block, recordMap)
      const isArticle =
        block.type === 'page' &&
        block.parent_table === 'collection' &&
        parentPage?.id === idToUuid(config.rootNotionPageId)

      return [
        {
          isArticle,
          title: getBlockTitle(block, recordMap) || pagePath,
          url: new URL(pagePath, `${config.host}/`).toString()
        }
      ]
    })
    .toSorted((a, b) => a.title.localeCompare(b.title))

  const articles = pages.filter((page) => page.isArticle)
  const supportingPages = pages.filter((page) => !page.isArticle)

  return new Response(createLlmsTxt({ articles, supportingPages }), {
    headers: {
      'Cache-Control': 'public, max-age=28800, stale-while-revalidate=28800',
      'Content-Type': 'text/markdown; charset=utf-8'
    }
  })
}

function createLlmsTxt({
  articles,
  supportingPages
}: {
  articles: PublicPageSummary[]
  supportingPages: PublicPageSummary[]
}): string {
  const sections = [
    `# ${escapeMarkdown(config.name)}`,
    `> ${escapeMarkdown(config.description)}`,
    'Essays by Travis Fischer about AI, developer tools, startups, and open-source software.',
    `## URL structure\n\n- [Home](${config.host}/): Landing page, author note, and writing index.\n- \`/{slug}\`: Public articles and supporting Notion pages.\n- [RSS feed](${config.host}/feed): Published articles in RSS format.\n- [XML sitemap](${config.host}/sitemap.xml): Crawlable public URLs.\n- [LLM index](${config.host}/llms.txt): This Markdown document.`,
    renderPageSection('Articles', articles),
    renderPageSection('Other pages', supportingPages)
  ].filter(Boolean)

  return `${sections.join('\n\n')}\n`
}

function renderPageSection(
  heading: string,
  pages: PublicPageSummary[]
): string {
  if (pages.length === 0) return ''

  const links = pages
    .map((page) => `- [${escapeMarkdown(page.title)}](${page.url})`)
    .join('\n')

  return `## ${heading}\n\n${links}`
}

function escapeMarkdown(value: string): string {
  return value
    .replaceAll('\\', '\\\\')
    .replaceAll('[', '\\[')
    .replaceAll(']', '\\]')
}
