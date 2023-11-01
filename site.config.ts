import { siteConfig } from './lib/site-config'

export default siteConfig({
  
  // the site's root Notion page (required)
  rootNotionPageId: '0284c2c1996d4246bc781fb433f058a1',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'personal webpage',
  domain: 'https://verdant-meteorite-47a.notion.site/Resume-0284c2c1996d4246bc781fb433f058a1',
  author: 'Hanna Z',

  // open graph metadata (optional)
  description: 'Notion',

  // social usernames (optional)
  twitter: 'hanna_zeng',
  github: 'HQhanqiZHQ',
  linkedin: 'hanna-z-092423226',
  newsletter: 'https://scholar.google.ca/citations?user=z9QF4YEAAAAJ&hl=zh-CN', // optional newsletter URL
  // youtube: '#', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // whether or not to enable support for LQIP preview images (optional)
  isPreviewImageSupportEnabled: true,

  // whether or not redis is enabled for caching generated preview images (optional)
  // NOTE: if you enable redis, you need to set the `REDIS_HOST` and `REDIS_PASSWORD`
  // environment variables. see the readme for more info
  isRedisEnabled: false,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  // pageUrlOverrides: {
  //   '/foo': '067dd719a912471ea9a3ac10710e7fdf',
  //   '/bar': '0be6efce9daf42688f65c76b89f8eb27'
  // }
  pageUrlOverrides: null,

 // Choose either 'default' or 'custom' for navigation style
  navigationStyle: 'default',
  // navigationStyle: 'custom',

  navigationLinks: [
    {
      title: 'About',
      pageId: 'f1199d37579b41cbabfc0b5174f4256a'
    },
    {
      title: 'Contact',
      pageId: '6a29ebcb935a4f0689fe661ab5f3b8d1'
    }
  ]
})
