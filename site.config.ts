import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: '792d1f7371e442749e9ae402f2728393',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'My School',
  domain: 'anhgerel.ml',
  author: 'Ankhgerel',

  // open graph metadata (optional)
  description: 'My school coming soon...',

  // social usernames (optional)
  //twitter: 'transitive_bs',
  github: 'ankhgerel',
  facebook: 'dev.filename',
  //linkedin: 'fisch2',
  // newsletter: '#', // optional newsletter URL
  // youtube: '#', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: '',
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
  pageUrlOverrides: {
    '/9': 'e4f0ebefda224c0ea6bf92eaa7ba28a9',
    '/8': '6c898e99e9b0459a9c82eb25f488e7e0'
  },

  // whether to use the default notion navigation style or a custom one with links to
  // important pages

  navigationStyle: 'custom',
  navigationLinks: [
    {
      title: 'Home',
      pageId: '792d1f7371e442749e9ae402f2728393'
    }
  ]
})
