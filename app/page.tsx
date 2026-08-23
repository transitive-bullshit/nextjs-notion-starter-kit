import type { Metadata } from 'next'

import { NotionPageRoute } from '@/components/NotionPageRoute'
import { getPageData } from '@/lib/get-page-data'
import { createPageMetadata } from '@/lib/page-metadata'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata(await getPageData())
}

export default async function HomePage() {
  const pageProps = await getPageData()

  return <NotionPageRoute pageProps={pageProps} useEagerCollection />
}
