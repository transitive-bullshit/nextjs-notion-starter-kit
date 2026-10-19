import 'server-only'

import { cache } from 'react'

import { domain } from './config'
import { resolveNotionPage } from './resolve-notion-page'

export const getPageData = cache((pageId?: string) =>
  resolveNotionPage(domain, pageId)
)
