import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: 'fe1ec8ab2c544c2fb4886cd4670e3f96',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'Makers Of Change Biographies',
  domain: 'people.makersof.xyz/biographies',
  author: 'Makers Of XYZ Inc.',

  // open graph metadata (optional)
  description: 'Example Next.js Notion Starter Kit Site',

  // social usernames (optional)
  twitter: 'makersofxyz',
  linkedin: 'makersofxyz',
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

  isSearchEnabled: false,

  // whether or not redis is enabled for caching generated preview images (optional)
  // NOTE: if you enable redis, you need to set the `REDIS_HOST` and `REDIS_PASSWORD`
  // environment variables. see the readme for more info
  isRedisEnabled: false,

  includeNotionIdInUrls: true,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  // //
  pageUrlOverrides: {
    '/moc/': '5a0235a2764a418bada8d77bd05db55d',
    '/makers-of-change-people-with-disabilities-v01': '712dec5048e04265be821abc559b338e',
    '/makers-of-change-indigineous-americans-v02': '092e931325f04cd2ab460628d78a06d2',
    '/makers-of-change-muslims-of-the-west-v03': '462f141a14194b90994b218434933396',
    '/makers-of-change-inspirational-koreans-v04': '521c7fd9f3014f99b581015ddcf4135e',
    // '/andrea-bocelli': '6fc2b8f55c6445589db153ec0988a125',
    // '/bar': '0be6efce9daf42688f65c76b89f8eb27'
  },

  pageUrlAdditions: {
    '/moc/': '5a0235a2764a418bada8d77bd05db55d',
  },
  // pageUrlOverrides: null,

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
