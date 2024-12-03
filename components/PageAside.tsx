import * as config from 'lib/config'
import { isSearchEnabled, navigationLinks, navigationStyle } from 'lib/config'
import { type Block, type ExtendedRecordMap } from 'notion-types'
import {  getPageTitle, parsePageId } from 'notion-utils'

import { getPageTweet } from '@/lib/get-page-tweet'

import { PageActions } from './PageActions'
import { PageSocial } from './PageSocial'

export function PageAside({
  block,
  recordMap,
  isBlogPost
}: {
  block: Block
  recordMap: ExtendedRecordMap
  isBlogPost: boolean
}) {
  if (!block) {
    return null
  }

  // only display comments and page actions on blog post pages
  if (isBlogPost) {
    const tweet = getPageTweet(block, recordMap)
    if (!tweet) {
      return null
    }
    const title = getPageTitle(recordMap)
    const author = recordMap.notion_user.given_name
    // const url = recordMap.signed_urls
    const tweettext =   `${title} by ${author}`
    return <PageActions tweet={tweet} tweettext={tweettext} />
  }

  return <PageSocial />
}
