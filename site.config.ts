import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: '1d2fe6fa899280b087fff187979d7b89',
  // rootNotionPageId: '1d3fe6fa89928016b161d69be3a74cd6',


  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'David',
  domain: 'www.davidunlimited.com',
  author: 'David',

  // open graph metadata (optional)
  description: 'This is a small blog where I share technical knowledge and problem-solving experiences.',

  // social usernames (optional)
  // twitter: '#',
  github: 'YChaoWang',
  linkedin: 'david-wang712',
  // mastodon: '#', // optional mastodon profile URL, provides link verification
  // newsletter: '#', // optional newsletter URL
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
//   pageUrlOverrides: {
//   '/blogs': '1d2fe6fa899280afb3a6fc3fa8d4ca4b'
// },
  pageUrlOverrides: null,

  // whether to use the default notion navigation style or a custom one with links to
  // important pages. To use `navigationLinks`, set `navigationStyle` to `custom`.
  // includeNotionIdInUrls: true,
  navigationStyle: 'default',
  // navigationLinks: [
  //   {
  //     title: 'Blogs',
  //     pageId: '1d2fe6fa899280afb3a6fc3fa8d4ca4b'
  //   }
  // ]
})
