module.exports = {
  // where it all starts -- the site's root Notion page (required)
  rootNotionPageId: '5359641e17344c3fb2d57374094896f3',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: '5adb8a9b-7746-40fb-af87-7b848a9573bc',

  // basic site info (required)
  name: 'NOMAD 6995',
  domain: 'nextjs-notion-starter-kit-sepia-eight.vercel.app',
  author: 'Jeremiah Shue',

  // open graph metadata (optional)
  description: 'A community FIRST Robotics team',
  socialImageTitle: 'NOMAD 6995',
  socialImageSubtitle: 'Hello World! 👋',

  // social usernames (optional)
  github: 'frc6995',
  instagram: 'frc6995nomad',
  facebook: 'frc6995nomad',
  thebluealliance: 'frc6995',

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
  pageUrlOverrides: {
    '/about': 'b7f41ae066b2497e925db1ba43b926a1',
    '/blog': '2a989c111df447089cfbccf630f5410a'
  }
}
