import pMemoize from 'p-memoize'
import { getAllPagesInSpace, getCanonicalPageId } from 'notion-utils'

import notion from './notion'

export const getAllPages = pMemoize(getAllPagesImpl, { maxAge: 60000 * 5 })

export async function getAllPagesImpl(
  rootNotionPageId: string,
  rootNotionSpaceId: string
): Promise<string[]> {
  const pages = await getAllPagesInSpace(
    rootNotionPageId,
    rootNotionSpaceId,
    notion.getPage.bind(notion)
  )

  const canonicalPageIds = Object.keys(pages)
    .map((pageId) => getCanonicalPageId(pageId, pages[pageId]))
    .filter(Boolean)

  return canonicalPageIds
}
