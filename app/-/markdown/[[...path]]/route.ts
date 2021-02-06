import { getPageData } from '@/lib/get-page-data'
import { getPageMetadataInfo } from '@/lib/page-metadata'
import { notionPageToMarkdown } from 'notion-x-to-md'

interface MarkdownRouteContext {
  params: Promise<{
    path?: string[]
  }>
}

export async function GET(_request: Request, context: MarkdownRouteContext) {
  const { path = [] } = await context.params
  const pagePath = path.length === 1 ? path[0] : undefined

  if (path.length > 1) return markdownNotFound()

  try {
    const pageProps = await getPageData(pagePath)
    if (
      pageProps.error ||
      !pageProps.pageId ||
      !pageProps.recordMap ||
      !pageProps.site
    ) {
      return markdownNotFound()
    }

    const { canonicalPageUrl } = getPageMetadataInfo(pageProps)
    const canonicalUrl =
      canonicalPageUrl ??
      `https://${pageProps.site.domain}${pagePath ? `/${pagePath}` : ''}`

    const markdown = await notionPageToMarkdown(pageProps.recordMap)

    return new Response(markdown, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'Content-Location': canonicalUrl,
        'Content-Type': 'text/markdown; charset=utf-8',
        Link: `<${canonicalUrl}>; rel="alternate"; type="text/html"`,
        Vary: 'Accept'
      }
    })
  } catch (err) {
    console.error('error rendering Markdown page', err)

    return new Response(
      '# Content temporarily unavailable\n\nThe page could not be read right now. Try again later or see the [agent index](/llms.txt).\n',
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store',
          'Content-Type': 'text/markdown; charset=utf-8',
          'Retry-After': '60',
          Vary: 'Accept'
        }
      }
    )
  }
}

export async function HEAD(request: Request, context: MarkdownRouteContext) {
  const response = await GET(request, context)

  return new Response(null, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  })
}

function markdownNotFound() {
  return new Response(
    '# Not found\n\nNo resource exists at this URL. See the [sitemap](/sitemap.xml) or [agent index](/llms.txt).\n',
    {
      status: 404,
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'text/markdown; charset=utf-8',
        Vary: 'Accept'
      }
    }
  )
}
