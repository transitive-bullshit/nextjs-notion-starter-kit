import Head from 'next/head'

import type * as types from '@/lib/types'
import * as config from '@/lib/config'
import { getSocialImageUrl } from '@/lib/get-social-image-url'

export function PageHead({
  site,
  title,
  description,
  pageId,
  image,
  url,
  isBlogPost
}: types.PageProps & {
  title?: string
  description?: string
  image?: string
  url?: string
  isBlogPost?: boolean
}) {
  const rssFeedUrl = `${config.host}/feed`

  title = title ?? site?.name
  description = description ?? site?.description

  const socialImageUrl = getSocialImageUrl(pageId) || image

  return (
    <Head>
      <meta charSet='utf-8' />
      <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover'
      />

      <meta name='mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='black' />

      <meta
        name='theme-color'
        media='(prefers-color-scheme: light)'
        content='#fefffe'
        key='theme-color-light'
      />
      <meta
        name='theme-color'
        media='(prefers-color-scheme: dark)'
        content='#2d3439'
        key='theme-color-dark'
      />

      <meta name='robots' content='index,follow' />
      <meta property='og:type' content='website' />

      {/* Google Search Console verification */}
      <meta
        name='google-site-verification'
        content='9XqpZQWD7-m5d0ZhXrspN03D57jXu_iSiWsFty005_8'
      />

      {/* SEO Keywords */}
      <meta
        name='keywords'
        content='일본 IT 취업, 일본 개발자, 일본 취업, 일본 이직, 일본 IT 커리어, 일본 IT 커뮤니티, 재일 한국인, 일본 외국계 기업, 일본 빅테크, 일본 스타트업, 일본 개발자 취업, 일본 개발자 커뮤니티, Japan Tech Career, Japan IT Jobs, Japan IT Community, 일본 취업 준비, 일본 이력서, 일본 면접, 일본 워킹 비자, 일본 취업 멘토링, 일본 커리어 상담'
      />

      {/* Additional SEO Meta Tags */}
      <meta name='author' content={config.author} />
      <meta name='language' content='ko' />
      <meta property='og:locale' content='ko_KR' />
      <meta property='og:locale:alternate' content='ja_JP' />
      <meta property='og:locale:alternate' content='en_US' />

      {site && (
        <>
          <meta property='og:site_name' content={site.name} />
          <meta property='twitter:domain' content={site.domain} />
        </>
      )}

      {config.twitter && (
        <meta name='twitter:creator' content={`@${config.twitter}`} />
      )}

      {description && (
        <>
          <meta name='description' content={description} />
          <meta property='og:description' content={description} />
          <meta name='twitter:description' content={description} />
        </>
      )}

      {socialImageUrl ? (
        <>
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:image' content={socialImageUrl} />
          <meta property='og:image' content={socialImageUrl} />
        </>
      ) : (
        <meta name='twitter:card' content='summary' />
      )}

      {url && (
        <>
          <link rel='canonical' href={url} />
          <meta property='og:url' content={url} />
          <meta property='twitter:url' content={url} />
        </>
      )}

      <link
        rel='alternate'
        type='application/rss+xml'
        href={rssFeedUrl}
        title={site?.name}
      />

      <meta property='og:title' content={title} />
      <meta name='twitter:title' content={title} />
      <title>{title}</title>

      {/* Structured Data - JSON-LD */}
      {!isBlogPost && site && (
        <script type='application/ld+json'>
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: site.name,
            url: `https://${site.domain}`,
            logo: `https://${site.domain}/apple-touch-icon.png`,
            description: site.description,
            sameAs: [
              config.twitter && `https://twitter.com/${config.twitter}`,
              config.github && `https://github.com/${config.github}`,
              config.linkedin && `https://www.linkedin.com/in/${config.linkedin}`
            ].filter(Boolean)
          })}
        </script>
      )}

      {/* Better SEO for the blog posts */}
      {isBlogPost && (
        <script type='application/ld+json'>
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            '@id': `${url}#BlogPosting`,
            mainEntityOfPage: url,
            url,
            headline: title,
            name: title,
            description,
            author: {
              '@type': 'Person',
              name: config.author
            },
            image: socialImageUrl,
            publisher: {
              '@type': 'Organization',
              name: config.author,
              logo: {
                '@type': 'ImageObject',
                url: `https://${site?.domain}/apple-touch-icon.png`
              }
            }
          })}
        </script>
      )}
    </Head>
  )
}
