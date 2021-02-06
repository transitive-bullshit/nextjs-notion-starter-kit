export interface SiteIdentity {
  authorName: string
  description: string
  imageUrl?: string
  jobTitle?: string
  language?: string
  sameAs?: readonly string[]
  siteName: string
  siteUrl: string
}

export interface BlogPostingIdentity {
  description: string
  imageUrl?: string
  title: string
  url: string
}

export function createSiteJsonLd(identity: SiteIdentity) {
  const siteUrl = normalizeUrl(identity.siteUrl)
  const personId = `${siteUrl}#person`
  const websiteId = `${siteUrl}#website`
  const sameAs = [...new Set(identity.sameAs?.filter(Boolean) ?? [])]

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: identity.authorName,
        alternateName:
          identity.siteName !== identity.authorName
            ? identity.siteName
            : undefined,
        description: identity.description,
        url: siteUrl,
        image: identity.imageUrl,
        jobTitle: identity.jobTitle,
        sameAs: sameAs.length > 0 ? sameAs : undefined
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: identity.siteName,
        description: identity.description,
        url: siteUrl,
        inLanguage: identity.language,
        publisher: {
          '@id': personId
        }
      }
    ]
  }
}

export function createBlogPostingJsonLd(
  identity: SiteIdentity,
  article: BlogPostingIdentity
) {
  const siteUrl = normalizeUrl(identity.siteUrl)
  const articleUrl = normalizeUrl(article.url)

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${articleUrl}#BlogPosting`,
    mainEntityOfPage: articleUrl,
    url: articleUrl,
    headline: article.title,
    name: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      '@id': `${siteUrl}#person`,
      name: identity.authorName,
      url: siteUrl
    },
    isPartOf: {
      '@id': `${siteUrl}#website`
    },
    image: article.imageUrl
  }
}

export type JsonLd =
  | ReturnType<typeof createSiteJsonLd>
  | ReturnType<typeof createBlogPostingJsonLd>

export function serializeJsonLd(jsonLd: JsonLd): string {
  return JSON.stringify(jsonLd).replaceAll('<', '\\u003c')
}

function normalizeUrl(url: string): string {
  return new URL(url).toString()
}
