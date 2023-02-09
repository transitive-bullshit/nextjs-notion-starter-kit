import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: '6110c35ff03548a8b94492398f42e150',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'W4nder\'s Blog',
  domain: 'test',
  author: 'W4nder',

  // open graph metadata (optional)
  description: '',

  // social usernames (optional)


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
//   pageUrlOverrides: {
//     '/javasec': 'e12dd5850aaa4e5c8aeec025842c03f2',
//     '/toolkits': '53d483b0884a4c9291bfd763b6ec9f65',
//     '/toys':'55625e20e0eb4158b571e3735574cdb5'
//   }
  pageUrlOverrides: null,

  // whether to use the default notion navigation style or a custom one with links to
  // important pages
  navigationStyle: 'default'
  // navigationStyle: 'custom',
  navigationLinks: [
    {
      title: 'Javasec',
      pageId: 'e12dd5850aaa4e5c8aeec025842c03f2'
    },
    {
      title: 'toolkits',
      pageId: '53d483b0884a4c9291bfd763b6ec9f65'
    },
    {
      title:'toys',
      pageId:'55625e20e0eb4158b571e3735574cdb5'
    }
  ]
})
