import Head from 'next/head'
import * as React from 'react'
import * as types from 'lib/types'
import { mapImageUrl } from 'lib/map-image-url'

// TODO: remove duplication between PageHead and NotionPage Head

export const PageHead: React.FC<types.PageProps> = ({ site }) => {
  return (
    <Head>
      <meta charSet='utf-8' />
      <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1, shrink-to-fit=no'
      />

      {site?.description && (
        <>
          <meta name='description' content={site.description} />
          <meta property='og:description' content={site.description} />
        </>
      )}

      {site?.image && (
        <meta property='og:image' content={mapImageUrl(site.image)} />
      )}

      <meta name='theme-color' content='#EB625A' />
      <meta property='og:type' content='website' />

      {site?.domain && (
        <meta property='og:url' content={`https://${site.domain}`} />
      )}
    </Head>
  )
}
