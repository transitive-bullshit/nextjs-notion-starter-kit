import { NextApiRequest, NextApiResponse } from 'next'
import chromium from 'chrome-aws-lambda'
import renderSocialImage from 'puppeteer-social-image-transitive-bs'
import { getBlockTitle, parsePageId } from 'notion-utils'

import { mapNotionImageUrl } from '../../lib/map-image-url'
// import { getPageDescription } from '../../lib/get-page-description'
import { getPage } from '../../lib/notion'
import * as types from '../../lib/types'
import {
  socialImageTitle,
  // socialImageSubtitle,
  defaultPageCover,
  defaultPageIcon,
  rootNotionPageId,
  socialImageSubtitle
} from '../../lib/config'

export interface SocialImageConfig {
  title: string
  subtitle?: string
  eyebrow?: string
  logo?: string
  imageUrl?: string
  unsplashId?: string
  unsplashKeywords?: string
  backgroundImageAnchor?: string
  backgroundImageOverlay?: boolean
  background?: string
  color?: string
  googleFont?: string
  fontFamily?: string
  watermark?: string
  size?:
    | 'facebook'
    | 'twitter'
    | 'ig-landscape'
    | 'ig-portrait'
    | 'ig-square'
    | 'ig-story'
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const pageId = req.query.pageId as string

  if (!pageId) {
    return res.status(400).send({ error: 'missing required parameter pageId' })
  }

  let recordMap: types.ExtendedRecordMap
  let block: types.PageBlock

  try {
    recordMap = await getPage(pageId)

    const pageBlockId = Object.keys(recordMap.block)[0]
    block = recordMap.block[pageBlockId]?.value as types.PageBlock

    if (!block) {
      return res.status(404).send({
        error: `unable to resolve root block for notion page "${pageId}"`
      })
    }
  } catch (err) {
    return res
      .status(404)
      .send({ error: `unable to load notion page "${pageId}"` })
  }

  const isRootPage = parsePageId(block.id) === parsePageId(rootNotionPageId)

  const image = await createSocialImage({
    imageUrl: mapNotionImageUrl(
      block.format?.page_cover || defaultPageCover,
      block
    ),
    logo: mapNotionImageUrl(defaultPageIcon, block),
    title: isRootPage
      ? socialImageTitle
      : getBlockTitle(block, recordMap) || socialImageTitle,
    subtitle: isRootPage ? socialImageSubtitle : undefined
    // subtitle: getPageDescription(block, recordMap) || socialImageSubtitle
  })

  res.setHeader(
    'Cache-Control',
    'public, immutable, s-maxage=31536000, max-age=31536000, stale-while-revalidate=60'
  )
  res.setHeader('Content-Type', 'image/jpeg')
  res.status(200).send(image)
}

async function createSocialImage(params: SocialImageConfig) {
  let browser

  try {
    // add font support for emojis
    // @see https://github.com/alixaxel/chrome-aws-lambda#fonts
    await chromium.font(
      'https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf'
    )

    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true, // chromium.headless,
      ignoreHTTPSErrors: true
    })

    const res = await renderSocialImage({
      template: 'article',
      templateParams: params,
      templateStyles: `h1 { font-size: 96px; text-align: center; } h2 { margin-top: 48px; font-size: 48px; text-align: center; }`,
      size: params.size,
      browser
    })

    return res
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
