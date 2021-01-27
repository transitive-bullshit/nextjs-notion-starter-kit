module.exports = {
  // where it all starts -- the site's root Notion page (required)
  rootNotionPageId: 'ef70445f3daa48edb825df2d537fb517',

  // basic site info (required)
  name: 'Edufair Online 2021',
  domain: 'edufair-blog.vercel.app',
  author: 'Wisesa',
  mainWeb: 'http://edufair-online-concept.wisesa.dev/',

  // open graph metadata (optional)
  description: 'Edufair Online 2021 Blog',
  socialImageTitle: 'Edufair Online 2021',
  socialImageSubtitle: 'Edufair Online 2021 Blog',

  // social usernames (optional)
  // twitter: 'transitive_bs',
  // github: 'transitive-bullshit',
  // linkedin: 'fisch2',

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null, // URL
  defaultPageCover: null, // URL
  defaultPageCoverPosition: 0.5,

  // image CDN host to proxy all image requests through (optional)
  // NOTE: this requires you to set up an external image proxy
  imageCDNHost: null,

  // Utteranc.es comments via GitHub issue comments (optional)
  // utterancesGitHubRepo: 'edufair-online/blog',

  // whether or not to enable support for LQIP preview images (optional)
  // NOTE: this requires you to set up Google Firebase and add the environment
  // variables specified in .env.example
  isPreviewImageSupportEnabled: true
}
