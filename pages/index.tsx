import type { PageProps } from '@/lib/types'
import { NotionPage } from '@/components/NotionPage'
import { domain } from '@/lib/config'
import { resolveNotionPage } from '@/lib/resolve-notion-page'

export const getStaticProps = async () => {
  try {
    const props = await resolveNotionPage(domain)

    return { props, revalidate: 10 }
  } catch (err) {
    console.error('page error', domain, err)
    // Gracefully return an error page instead of failing the build (e.g. Notion 429)
    const props: PageProps = {
      error: { message: 'Failed to load Notion content', statusCode: 503 }
    }
    return { props, revalidate: 10 }
  }
}

export default function NotionDomainPage(props: PageProps) {
  return <NotionPage {...props} />
}
