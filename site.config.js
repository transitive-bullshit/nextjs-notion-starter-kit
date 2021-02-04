module.exports = {
  // where it all starts -- the site's root Notion page (required)
  rootNotionPageId: '011aba605f584e42a8320e62be9bebc3',

  // if you want to restrict pages to a single notion workspace (optional)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'Ubiquity Algorithmic Dollar',
  domain: 'docs.ubq.fi',
  author: 'Ubiquity DAO',

  // open graph metadata (optional)
  description: 'Ubiquity Algorithmic Dollar Documentation',
  socialImageTitle: 'Ubiquity Algorithmic Dollar Docs',
  socialImageSubtitle: 'Hello World! 👋',

  // social usernames (optional)
  // twitter: 'ubiquitydao',
  github: 'ubiquity',
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
  utterancesGitHubRepo: null,

  // whether or not to enable support for LQIP preview images (optional)
  // NOTE: this requires you to set up Google Firebase and add the environment
  // variables specified in .env.example
  isPreviewImageSupportEnabled: false
}
