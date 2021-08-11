module.exports = {
  // where it all starts -- the site's root Notion page (required)
  rootNotionPageId: 'ff1a3cae900941e49cc4d4458cc2867d',
  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: '684fb1cf-ad2b-40c7-8e31-c099fa61e45f',

  // basic site info (required)
  name: 'Ubiquity DAO Hub',
  domain: 'dao.ubq.fi',
  author: 'Ubiquity DAO',

  // open graph metadata (optional)
  description: 'Ubiquity DAO Contributors Hub',
  socialImageTitle: 'Ubiquity DAO Contributors Hub',
  socialImageSubtitle: 'Hello World! 👋',

  // social usernames (optional)
  twitter: 'ubiquitydao',
  github: 'ubiquity',
  discord: 'SjymJ5maJ4',
  // linkedin: 'fisch2',

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // image CDN host to proxy all image requests through (optional)
  // NOTE: this requires you to set up an external image proxy
  imageCDNHost: 'https://ssfy.io',

  // Utteranc.es comments via GitHub issue comments (optional)
  utterancesGitHubRepo: null,

  // whether or not to enable support for LQIP preview images (optional)
  // NOTE: this requires you to set up Google Firebase and add the environment
  // variables specified in .env.example
  isPreviewImageSupportEnabled: true,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  // pageUrlOverrides: {
  //   '/foo': '067dd719a912471ea9a3ac10710e7fdf',
  //   '/bar': '0be6efce9daf42688f65c76b89f8eb27'
  // }
  pageUrlOverrides: null
}
