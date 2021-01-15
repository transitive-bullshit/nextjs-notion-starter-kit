import { Block, ExtendedRecordMap } from 'notion-types'

export * from 'notion-types'

export interface PageError {
  message?: string
  statusCode: number
}

export interface PageProps {
  site?: Site
  recordMap?: ExtendedRecordMap
  pageId?: string
  error?: PageError
}

export interface Model {
  id: string
  userId: string

  createdAt: number
  updatedAt: number
}

export interface Site extends Model {
  name: string
  domain: string

  rootNotionPageId: string
  rootNotionSpaceId: string

  // settings
  html?: string
  fontFamily?: string
  darkMode?: boolean
  previewImages?: boolean

  // opengraph metadata
  description?: string
  image?: string

  timestamp: Date

  // disabled for payment reasons
  isDisabled: boolean
}

export interface SiteMap {
  site: Site
  pageIds: string[]
}

export interface Breadcrumb {
  block: Block
  active: boolean
  pageId: string
  title: string
  icon: string
}

export interface PreviewImage {
  url: string
  originalWidth: number
  originalHeight: number
  width: number
  height: number
  type: string
  dataURIBase64: string

  error?: string
  statusCode?: number
}

export interface PreviewImageMap {
  [url: string]: PreviewImage
}
