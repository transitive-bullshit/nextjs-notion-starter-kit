module.exports = {
  // where it all starts -- the site's root Notion page (required)
  rootNotionPageId: '20233eb12f0d49bcbf717ed260376c24',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: "d26bb8d7-99c2-4a69-b346-b959a22877df",

  // basic site info (required)
  name: 'Suith\' Blog',
  domain: 'asuith.com',
  author: 'Suith',

  // open graph metadata (optional)
  description: 'Yet Another Suith\'s Blog',
  socialImageTitle: '',
  socialImageSubtitle: 'Hello World! 👋',

  // social usernames (optional)
  twitter: 'leosuith',
  github: 'asuith',
  // linkedin: '',

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // image CDN host to proxy all image requests through (optional)
  // NOTE: this requires you to set up an external image proxy
  imageCDNHost: null,

  // Utteranc.es comments via GitHub issue comments (optional)
  utterancesGitHubRepo: null,

  // whether or not to enable support for LQIP preview images (optional)
  // NOTE: this requires you to set up Google Firebase and add the environment
  // variables specified in .env.example
  isPreviewImageSupportEnabled: false,

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
