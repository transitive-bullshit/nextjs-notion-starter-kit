module.exports = {
  // where it all starts -- the site's root Notion page (required)
  // 一切都从这里开始--网站的根 Notion 页面（必需）
  rootNotionPageId: '78fc5a4b88d74b0e824e29407e9f1ec1',

  // if you want to restrict pages to a single notion workspace (optional)
  // 如果你要将页面限制为单个 Notion 工作区（可选）
  // (this should be a Notion ID; see the docs for how to extract this)
  // （这应该是一个 Notion ID；有关如何提取它，请参阅文档）
  rootNotionSpaceId: null,

  // basic site info (required)
  // 网站基本信息（必需）
  name: 'Transitive Bullshit',
  domain: 'transitivebullsh.it',
  author: 'Travis Fischer',

  // open graph metadata (optional)
  // OG 标签数据（必需）
  description: 'Example site description',
  socialImageTitle: 'Transitive Bullshit',
  socialImageSubtitle: 'Hello World! 👋',

  // social usernames (optional)
  // 社交用户名（可选）
  twitter: 'transitive_bs',
  github: 'transitive-bullshit',
  linkedin: 'fisch2',

  // default notion icon and cover images for site-wide consistency (optional)
  // 默认的 notion 图标和封面用来实现全站的一致性 （可选）
  // page-specific values will override these site-wide defaults
  // 页面的设置将会覆盖这些默认值
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // image CDN host to proxy all image requests through (optional)
  // 加速图像请求的 CDN（可选）
  // NOTE: this requires you to set up an external image proxy
  // 注意： 这需要你设置额外的图像代理
  imageCDNHost: null,

  // Utteranc.es comments via GitHub issue comments (optional)
  // Utteranc.es Github issue 评论模块（可选）
  utterancesGitHubRepo: null,

  // whether or not to enable support for LQIP preview images (optional)
  // 是否启用对 LQIP 图像预览的支持（可选）。
  // NOTE: this requires you to set up Google Firebase and add the environment
  // variables specified in .env.example
  // 注意： 这需要你设置 Google Firebase 并在 .env.example 中添加指定的环境变量
  isPreviewImageSupportEnabled: false,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  // notion 页面 ID 与 URL路径的映射（可选）。
  // 此处定义的任何页面都将覆盖其默认 URL 路径
  // 示例:
  // pageUrlOverrides: {
  //   '/foo': '067dd719a912471ea9a3ac10710e7fdf',
  //   '/bar': '0be6efce9daf42688f65c76b89f8eb27'
  // }
  pageUrlOverrides: null
}
