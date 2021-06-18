module.exports = {
  // where it all starts -- the site's root Notion page (required)
  rootNotionPageId: '78fc5a4b88d74b0e824e29407e9f1ec1',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: 'fde5ac74eea345278f004482710e1af3',

  // basic site info (required)
  name: 'Transitive Bullshit',
  domain: 'transitivebullsh.it',
  author: 'Travis Fischer',

  // open graph metadata (optional)
  description: 'Personal site of Travis Fischer aka Transitive Bullshit',
  socialImageTitle: 'Transitive Bullshit',
  socialImageSubtitle: 'Hello World! 👋',

  // social usernames (optional)
  twitter: 'transitive_bs',
  github: 'transitive-bullshit',
  linkedin: 'fisch2',

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon:
    'https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F797768e4-f24a-4e65-bd4a-b622ae9671dc%252Fprofile-2020-280w-circle.png%3Ftable%3Dblock%26id%3D78fc5a4b-88d7-4b0e-824e-29407e9f1ec1%26cache%3Dv2',
  defaultPageCover:
    'https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F9fc5ecae-2b4b-4e73-b0d4-918c829ba69f%252FIMG_0259-opt.jpg%3Ftable%3Dblock%26id%3D78fc5a4b-88d7-4b0e-824e-29407e9f1ec1%26cache%3Dv2',
  defaultPageCoverPosition: 0.1862,

  // image CDN host to proxy all image requests through (optional)
  // NOTE: this requires you to set up an external image proxy
  imageCDNHost: 'https://ssfy.io',

  // Utteranc.es comments via GitHub issue comments (optional)
  utterancesGitHubRepo: 'transitive-bullshit/transitivebullsh.it',

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
  pageUrlOverrides: null,

  pageUrlAdditions: {
    '/the-social-audio-revolution': 'c4deaf33cc924ad7a5b9f69c6ae04a01'
  }
}
