import Head from 'next/head'

import { PromptingLayout, RecapContent } from '@/components/wustep/prompting'
import { host, name } from '@/lib/config'

const parentTitle = 'How to talk to coding agents'
const chapterTitle = 'Recap'
const title = `${chapterTitle} — ${parentTitle}`
const description =
  'Five reminders before you go. The four mental models on one page, plus the techniques worth practicing.'
const canonicalUrl = `${host}/prompting/recap`
const previewImage = `${host}/favicon-512x512.png`

export default function PromptingRecapPage() {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <link rel='canonical' href={canonicalUrl} />
        <meta property='og:type' content='article' />
        <meta property='og:site_name' content={name} />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
        <meta property='og:url' content={canonicalUrl} />
        <meta property='og:image' content={previewImage} />
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={description} />
      </Head>
      <PromptingLayout
        chapter={{
          index: 7,
          title: chapterTitle,
          prevHref: '/prompting/orchestration',
          prevLabel: 'Orchestration',
          nextHref: '/prompting',
          nextLabel: 'From the top',
          nextKind: 'restart'
        }}
      >
        <RecapContent />
      </PromptingLayout>
    </>
  )
}
