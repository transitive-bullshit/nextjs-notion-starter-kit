import type * as types from 'notion-types'
import { Search, useNotionContext } from 'react-notion-x'

import { isSearchEnabled, navigationLinks } from '@/lib/config'

import { SiteHeader } from './SiteHeader'

function getNavigationHref(
  title: string,
  mapPageUrl: (pageId: string) => string,
  fallback: string
) {
  const link = navigationLinks?.find(
    (candidate) => candidate?.title.toLowerCase() === title.toLowerCase()
  )

  if (link?.pageId) return mapPageUrl(link.pageId)
  if (link?.url) return link.url

  return fallback
}

export function NotionPageHeader({
  block
}: {
  block: types.CollectionViewPageBlock | types.PageBlock
}) {
  const { mapPageUrl } = useNotionContext()
  const aboutHref = getNavigationHref('about', mapPageUrl, '/about')

  return (
    <SiteHeader
      aboutHref={aboutHref}
      search={
        isSearchEnabled ? <Search block={block} title={null} /> : undefined
      }
    />
  )
}
