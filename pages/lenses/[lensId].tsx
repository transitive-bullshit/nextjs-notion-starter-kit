import type { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'

import { LensesPage } from '@/components/wustep/lenses'
import { LENS_BY_ID, LENSES } from '@/components/wustep/lenses/registry'
import { domain, host, name, x } from '@/lib/config'

type LensDetailProps = {
  lensId: string
  lensTitle: string
  lensTagline: string
}

/**
 * Per-lens route — /lenses/<id>. Renders the same canvas experience as
 * /lenses but seeds the open panel from the path (LensesPage reads
 * `router.query.lensId`) and ships per-lens SEO metadata. Each lens is
 * prerendered via getStaticPaths from the deck registry.
 */
export default function LensDetailPage({
  lensId,
  lensTitle,
  lensTagline
}: LensDetailProps) {
  const title = `${lensTitle} — Lenses`
  const description = lensTagline
  const previewImage = `${host}/favicon-512x512.png`
  const canonicalUrl = `${host}/lenses/${lensId}`

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <link rel='canonical' href={canonicalUrl} />
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content={name} />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
        <meta property='og:url' content={canonicalUrl} />
        <meta property='og:image' content={previewImage} />
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:domain' content={domain} />
        {x && <meta name='twitter:creator' content={`@${x}`} />}
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={description} />
        <meta name='twitter:image' content={previewImage} />
      </Head>
      <LensesPage />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = () => ({
  paths: LENSES.map((lens) => ({ params: { lensId: lens.id } })),
  fallback: false
})

export const getStaticProps: GetStaticProps<LensDetailProps> = ({ params }) => {
  const lensId = typeof params?.lensId === 'string' ? params.lensId : ''
  const lens = LENS_BY_ID[lensId]
  if (!lens) return { notFound: true }
  return {
    props: {
      lensId,
      lensTitle: lens.title,
      lensTagline: lens.tagline
    }
  }
}
