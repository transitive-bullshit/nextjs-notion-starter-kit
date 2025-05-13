import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: process.env.NEXT_PUBLIC_NOTION_PAGE_ID,

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'Coursetexts',
  domain: 'coursetexts.org',
  author: 'Coursetexts',

  // open graph metadata (optional)
  description: 'Coursetexts is a modern, open library of MIT and Harvard course notes.',

  // social usernames (optional)
  // twitter: 'yush_g',
  github: 'coursetexts',
  // mastodon: '#', // optional mastodon profile URL, provides link verification
  newsletter: 'mailto:coursetexts@mit.edu', // optional newsletter URL
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
  pageUrlOverrides: {
    '/why': 'Coursetexts-is-open-sourcing-the-frontiers-of-knowledge-19dab1b19f368051ac74efcdc80e1449',
    '/about': 'About-199ab1b19f3681ce8ab2d06bc1b17175',
    // '/proseminar-in-social-psychologypsy2500': 'Proseminar-in-Social-Psychology-PSY-2500-1d819a13312a80029367cbd949d47920',
    // '/classical-social-theory-sociol2204': 'Classical-Social-Theory-SOCIOL-2204-1c219a13312a8020b47dc2ac02b5adb0',
    // '/wwii-american-and-european-painting-and-mass-culture-haa272m': 'WWII-American-and-European-Painting-and-Mass-Culture-HAA-272M-1c919a13312a80fcbbd8e928fe96c8cd',
  },

  // whether to use the default notion navigation style or a custom one with links to
  // important pages. To use `navigationLinks`, set `navigationStyle` to `custom`.
  navigationStyle: 'default'
  // navigationStyle: 'custom',
  // navigationLinks: [
  //   {
  //     title: 'About',
  //     pageId: 'f1199d37579b41cbabfc0b5174f4256a'
  //   },
  //   {
  //     title: 'Contact',
  //     pageId: '6a29ebcb935a4f0689fe661ab5f3b8d1'
  //   }
  // ]
})
