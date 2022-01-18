module.exports = {
  // where it all starts -- the site's root Notion page (required)
  rootNotionPageId: '666ffb1cba6b44f282bb88c17b35d7c1',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: d2795493-807f-49f4-b577-22c42b882a79,

  // basic site info (required)
  name: '云中辞',
  domain: 'cinas.cn',
  author: '云中辞',
  beian: '浙ICP备2021036882号',

  // open graph metadata (optional)
  description: '云中谁寄锦书来',
  socialImageTitle: '云中辞',
  socialImageSubtitle: '雁字回时 月满西楼',

  // social usernames (optional)
  // twitter: 'transitive_bs',
  // github: 'transitive-bullshit',
  // linkedin: 'fisch2',

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // image CDN host to proxy all image requests through (optional)
  // NOTE: this requires you to set up an external image proxy
  imageCDNHost: null,

  // Utteranc.es comments via GitHub issue comments (optional)
  utterancesGitHubRepo: 'yunzhongci/notion',

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
    '/about': '4ad902385c35468e9d5a1aa5dcec7f96',   
  }
}
