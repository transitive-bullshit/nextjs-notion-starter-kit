module.exports = {
  // 一切从这里开始——站点的根 Notion 页面（必需）
  rootNotionPageId: '666ffb1cba6b44f282bb88c17b35d7c1',

  // 如果要将页面限制为单个Notion工作区（可选）
  // （这应该是一个概念 ID；请参阅文档了解如何提取它）
  rootNotionSpaceId: "d2795493-807f-49f4-b577-22c42b882a79",

  // 基本站点信息（必填）
  name: '云中辞',
  domain: 'cinas.cn',
  author: '云中辞',
  beian: '浙ICP备2021036882号',

  // 站点元数据（可选）
  description: '云中谁寄锦书来',
  socialImageTitle: '云中辞',
  socialImageSubtitle: '雁字回时 月满西楼',

  // 社交用户名（可选）
  // twitter: 'transitive_bs',
  // github: 'transitive-bullshit',
  // linkedin: 'fisch2',
  
  // 默认Notion 图标和 封面图像 （可选）
  // 特定页面的值将覆盖这些站点的默认值
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // 图片 CDN 主机通过代理所有图片请求（可选）
  // 注意：这需要您设置外部图像代理
  imageCDNHost: null,

  // 通过 GitHub 的 issue 发布评论，使用 Utteranc.es 实现这个功能（可选）
  utterancesGitHubRepo: 'yunzhongci/notion',

  // 是否开启对 LQIP 预览图片的支持（可选）
  // 注意：这需要您设置 Google Firebase 并添加环境
  // .env.example 中指定的变量
  isPreviewImageSupportEnabled: false,

  // Notion 页面 ID 到 URL 路径的映射（可选）
  // 此处定义的任何页面都将覆盖其默认 URL 路径
  // 例子：
  //
  // pageUrlOverrides: {
  //   '/foo': '067dd719a912471ea9a3ac10710e7fdf',
  //   '/bar': '0be6efce9daf42688f65c76b89f8eb27'
  // }
  pageUrlOverrides: {
    '/about': '4ad902385c35468e9d5a1aa5dcec7f96',
    '/note': 'b807350e2ebe4a81810eba83e575a11c',
  }
}
