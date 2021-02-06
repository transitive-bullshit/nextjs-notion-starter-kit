export interface AiCatalogOptions {
  authorName: string
  domain: string
  siteName: string
  siteUrl: string
}

export function createAiCatalog({
  authorName,
  domain,
  siteName,
  siteUrl
}: AiCatalogOptions) {
  const llmsUrl = new URL('/llms.txt', siteUrl).toString()

  return {
    specVersion: '1.0',
    host: {
      displayName: siteName,
      identifier: domain
    },
    entries: [
      {
        identifier: `urn:air:${domain}:docs:llms`,
        displayName: `${siteName} agent content index`,
        type: 'text/markdown',
        url: llmsUrl,
        description: `Markdown index of ${authorName}'s public essays and supporting pages for AI readers.`
      }
    ]
  }
}
