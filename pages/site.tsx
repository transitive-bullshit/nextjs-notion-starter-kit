import type { PageProps } from '@/lib/types'
import { HomePage } from '@/components/HomePage'
import { domain } from '@/lib/config'
import { resolveNotionPage } from '@/lib/resolve-notion-page'

export const getStaticProps = async () => {
  // CI build verification: skip the live Notion fetch so `next build` stays
  // offline/deterministic. The page falls back to on-demand ISR at runtime.
  if (process.env.SKIP_NOTION_STATIC_BUILD === 'true') {
    return { notFound: true as const, revalidate: 10 }
  }

  try {
    const props = await resolveNotionPage(domain)

    return { props, revalidate: 10 }
  } catch (err) {
    console.error('page error', domain, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export default function NotionHomePage(props: PageProps) {
  return <HomePage {...props} />
}
