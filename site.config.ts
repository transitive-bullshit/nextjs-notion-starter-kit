import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: '6ad1588dfd2b4479a14fa14356d174c4',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'Mas0n\'s blog',
  domain: 'mas0n.cn',
  author: 'Mas0n',

  // open graph metadata (optional)
  description: 'New blog for Mas0n | CTF | 逆向 | Reverse',

  // social usernames (optional)
  twitter: 'Mas0nShi',
  github: 'Mas0nShi',
  // linkedin: '#',
  // mastodon: '#', // optional mastodon profile URL, provides link verification
  // newsletter: '#', // optional newsletter URL
  // youtube: '#', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`

  // ICP & Public Security Record Number 
  icp: '浙ICP备2021002476号-2',
  recordName: '浙公网安备 33028102000963号',
  recordNumber: '33028102000963',

  // comment system
  walineHost: 'https://line.mas0n.cn',

  // google analytics ID
  googleAnalyticsId: 'G-PR1E4LD9CZ',

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // whether or not to enable support for LQIP preview images (optional)
  isPreviewImageSupportEnabled: true,

  // whether or not redis is enabled for caching generated preview images (optional)
  // NOTE: if you enable redis, you need to set the `KV_URL`
  // environment variables. see the readme for more info
  isRedisEnabled: true,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  pageUrlOverrides: {
    '/about': '8ffe26f578a84d6ea3ded535e4729b6e',
    '/links': 'e4733f1b091b458fa9d25aa5d14efce8'
  },
  // pageUrlOverrides: null,

  // whether to use the default notion navigation style or a custom one with links to
  // important pages
  // navigationStyle: 'default'
  navigationStyle: 'custom',
  navigationLinks: [
    {
      title: 'About',
      pageId: '8ffe26f578a84d6ea3ded535e4729b6e'
    },
    {
      title: 'Links',
      pageId: 'e4733f1b091b458fa9d25aa5d14efce8'
    }
  ]
})
