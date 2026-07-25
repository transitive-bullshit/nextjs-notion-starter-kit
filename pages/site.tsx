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

    // Roughly aligned with PAGE_CACHE_TTL_MS (25m) in lib/notion.ts. A shorter
    // window doesn't actually buy freshness: `getPage` is memoized per server
    // instance for 25m, so a warm instance regenerating every 10s just
    // re-serves the same cached recordMap. All it bought was ISR churn and
    // Notion rate-limit pressure on the site's hottest page.
    return { props, revalidate: 1800 }
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
