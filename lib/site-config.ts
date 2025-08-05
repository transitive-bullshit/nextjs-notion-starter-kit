import type * as types from './types'

export interface SiteConfig {
  rootNotionPageId: string
  rootNotionSpaceId?: string | null
  rootNotionProjectPageId: string

  name: string
  domain: string
  author: string
  description?: string
  language?: string

  github?: string
  linkedin?: string
  youtube?: string
  linktree?: string

  defaultPageIcon?: string | null
  defaultPageCover?: string | null
  defaultPageCoverPosition?: number | null

  isPreviewImageSupportEnabled?: boolean
  isTweetEmbedSupportEnabled?: boolean
  isRedisEnabled?: boolean
  isSearchEnabled?: boolean

  includeNotionIdInUrls?: boolean
  pageUrlOverrides?: types.PageUrlOverridesMap | null
  pageUrlAdditions?: types.PageUrlOverridesMap | null

  navigationStyle?: types.NavigationStyle
  navigationLinks?: Array<NavigationLink>
}

export interface NavigationLink {
  title: string
  pageId?: string
  url?: string
}

export const siteConfig = (config: SiteConfig): SiteConfig => {
  return config
}
