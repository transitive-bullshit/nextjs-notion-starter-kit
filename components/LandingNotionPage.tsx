'use client'

import type { NotionComponents } from 'react-notion-x'
import { Collection } from 'react-notion-x/third-party/collection'

import { NotionPage, type NotionPageProps } from './NotionPage'

const landingNotionComponents: Partial<NotionComponents> = {
  Collection
}

export function LandingNotionPage(props: NotionPageProps) {
  return <NotionPage {...props} components={landingNotionComponents} />
}
