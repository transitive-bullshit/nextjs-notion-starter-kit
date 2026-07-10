import Head from 'next/head'

import { LlmsDirectory } from '@/components/wustep/lenses/llms/LlmsDirectory'
import { domain, host, name, x } from '@/lib/config'

const title = 'Lenses, by language models'
const description =
  'Language models were each handed the same empty 28-card deck and asked how they see the world — same structure, different sensibilities.'
const previewImage = `${host}/favicon-512x512.png`
const canonicalUrl = `${host}/lenses/llms`

export default function LlmLensesDirectoryPage() {
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
      <LlmsDirectory />
    </>
  )
}
