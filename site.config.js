module.exports = {
  // where it all starts -- the site's root Notion page (required)
  // 一切开始的地方--网站的根Notion页面（必需）。
  rootNotionPageId: '78fc5a4b88d74b0e824e29407e9f1ec1',

  // if you want to restrict pages to a single notion workspace (optional)
  // 如果你想把页面限制在一个单一的概念工作区（可选）。
  // (this should be a Notion ID; see the docs for how to extract this)
  // （这应该是一个Notion ID；关于如何提取这个ID，请参见文档）。
  rootNotionSpaceId: null,

  // basic site info (required)
  // 基本的页面信息（必需）
  name: 'Transitive Bullshit',
  domain: 'transitivebullsh.it',
  author: 'Travis Fischer',

  // open graph metadata (optional)
  // 公开的图像元数据（可选）
  description: 'Example site description',
  socialImageTitle: 'Transitive Bullshit',
  socialImageSubtitle: 'Hello World! 👋',

  // social usernames (optional)
  // 社交链接（可选）
  twitter: 'transitive_bs',
  github: 'transitive-bullshit',
  linkedin: 'fisch2',

  // default notion icon and cover images for site-wide consistency (optional)
  // 默认的notion图标和封面用来实现全站的一致性 （可选）
  // page-specific values will override these site-wide defaults
  // 页面的设置将会覆盖这些默认值
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // image CDN host to proxy all image requests through (optional)
  // 加速图像请求的图像CDN（可选）
  // NOTE: this requires you to set up an external image proxy
  // NOTE： 这需要你设置额外的图像代理
  imageCDNHost: null,

  // Utteranc.es comments via GitHub issue comments (optional)
  // Utteranc.es Github 评论模块（可选）
  utterancesGitHubRepo: null,

  // whether or not to enable support for LQIP preview images (optional)
  // 是否启用对LQIP预览图像的支持（可选）。
  // NOTE: this requires you to set up Google Firebase and add the environment
  // NOTE： 这需要你设置Google Firebase并添加到环境变量
  // variables specified in .env.example
  // 在.env.example中指定的变量
  isPreviewImageSupportEnabled: false,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  // pageUrlOverrides: {
  //   '/foo': '067dd719a912471ea9a3ac10710e7fdf',
  //   '/bar': '0be6efce9daf42688f65c76b89f8eb27'
  // }

  // 观念页面ID与URL路径的映射（可选）。
  // 这里定义的任何页面都将覆盖其默认的URL路径
  // 示例。
  //
  // pageUrlOverrides: {
  // '/foo': '067dd719a912471ea9a3ac10710e7fdf',
  // '/bar': '0be6efce9daf42688f65c76b89f8eb27' 。
  // }
  pageUrlOverrides: null
}
