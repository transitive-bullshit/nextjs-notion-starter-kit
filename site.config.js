module.exports = {
  // where it all starts -- the site's root Notion page (required)
  rootNotionPageId: '9910f05bd73f4ba0bf218a84b99a6864',
  //rootNotionPageId: '466fbe4cf30b4c4e9db2c9d356ae9e67', // for test use

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'FKYnJYQ',
  domain: 'blog.fkynjyq.com',
  author: 'FKY',

  // open graph metadata (optional)
  description: 'Code for Good.',
  socialImageTitle: 'FKY',
  socialImageSubtitle: '一个有技术和思考的角落',

  // social usernames (optional)
  twitter: 'FKYnJYQ',
  github: 'fky2015',
  linkedin: '',

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // image CDN host to proxy all image requests through (optional)
  // NOTE: this requires you to set up an external image proxy
  imageCDNHost: null,

  // Utteranc.es comments via GitHub issue comments (optional)
  utterancesGitHubRepo: 'fky2015/utterances-store',

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
