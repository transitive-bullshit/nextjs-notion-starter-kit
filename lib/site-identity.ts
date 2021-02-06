import 'server-only'

import {
  author,
  defaultPageIcon,
  description,
  domain,
  github,
  language,
  linkedin,
  mastodon,
  name,
  twitter,
  youtube,
  zhihu
} from './config'
import { type SiteIdentity } from './json-ld'

export const siteIdentity = {
  authorName: author,
  description,
  imageUrl: defaultPageIcon,
  language,
  sameAs: [
    twitter ? `https://x.com/${twitter}` : undefined,
    github ? `https://github.com/${github}` : undefined,
    linkedin ? `https://www.linkedin.com/in/${linkedin}` : undefined,
    mastodon,
    youtube ? `https://www.youtube.com/${youtube}` : undefined,
    zhihu ? `https://zhihu.com/people/${zhihu}` : undefined
  ].filter((url): url is string => Boolean(url)),
  siteName: name,
  siteUrl: `https://${domain}`
} satisfies SiteIdentity
