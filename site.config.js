module.exports = {
  // where it all starts -- the site's root Notion page (required)
  rootNotionPageId: '616010038b314232972ce9f23ccecc97',

  // It's will be used as the root page when running `yarn dev`. (optional)
  // If you are suffering from the slow loading or compiling speed, set this to a smaller page.
  // Just leave `null` if you don't want to use it.
  rootNotionTestPageId: '6f55bc87f5ea429cb9711b67ac00ea90',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'FKYnJYQ',
  domain: 'blog.fkynjyq.com',
  author: 'Feng Kaiyu',

  // open graph metadata (optional)
  description: 'Code for Good.',
  socialImageTitle: 'Feng Kaiyu',
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

  // Giscus comments via Github Discusstion (optional, has a priority over Utterances)
  //
  // To generate the following configs, visit https://giscus.app/.
  giscusGithubConfig: {
    repo: 'fky2015/nexon',
    repoId: 'MDEwOlJlcG9zaXRvcnkzNzkxNDQ0NTQ=',
    category: 'Comments',
    categoryId: 'DIC_kwDOFplJBs4COB_h',
    mapping: 'title',
    reactionsEnabled: '1',
    theme: 'light',
    term: null,
  },

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
  pageUrlOverrides: null,

  // Optional: Normally, the page contain it's metadata 
  // like `CreatedTime`, `LastEditedTime`.
  // These metadata cannot be changed by the user.
  // If you want to override this with a page property (so that 
  // you can custom it's value), specify it's name here.
  //
  // This should align with the property name in Notion.
  // And the data type should be `Date` or `String`.
  // Any invalid data type will be ignored and fallback to default metadata.
  //
  // These metadata will be used when generating RSS, Sitemap, etc.
  OverrideCreatedTime: "Created",
  OverrideLastEditedTime: null,
}
