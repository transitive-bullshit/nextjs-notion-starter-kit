import type { Metadata } from 'next'

import { NotionPage } from '@/components/NotionPage'
import { NotionPageRoute } from '@/components/NotionPageRoute'
import { getPageData } from '@/lib/get-page-data'

interface EmbedPageProps {
  params: Promise<{
    pageId: string
  }>
}

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
}

export default async function EmbedPage({ params }: EmbedPageProps) {
  const { pageId } = await params
  const pageProps = await getPageData(pageId === 'root' ? undefined : pageId)

  return (
    <NotionPageRoute
      pageProps={pageProps}
      pageComponent={NotionPage}
      isLiteMode={true}
    />
  )
}
