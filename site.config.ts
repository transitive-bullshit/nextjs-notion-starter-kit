import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  // 确认已在 Notion 中将此页面 Publish to web
  rootNotionPageId: '1b675f78cd2080b7b561e66e880d31c0',

  // if you want to restrict pages to a single notion workspace (optional)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'IvanCheung',
  domain: 'my-website-nextjs-notion-starter-kit.vercel.app',
  author: 'IvanCheung',

  // open graph metadata (optional)
  description: 'IvanCheung - My Notion Site',

  // social usernames (optional)
  // twitter: 'transitive_bs',
  instagram: '1ziat_bbbam',
  //// github: 'cheungzt',
  linkedin: 'ivan-cheung-b7613b310',
  xiaohongshu: '599fa7df6a6a697c002627bc',

  // default notion icon and cover images for site-wide consistency (optional)
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // 是否开启预览图生成 
  // ⚡️ 重要：如果你没有配置 Redis 环境变量，请务必设为 false，否则 Vercel 构建极易报错
  isPreviewImageSupportEnabled: false,

  // whether or not redis is enabled for caching generated preview images (optional)
  isRedisEnabled: false,

  // map of notion page IDs to URL paths (optional)
  pageUrlOverrides: null,

  // whether to use the default notion navigation style or a custom one
  // 如果你想使用自定义导航栏，请保持 'custom'
  navigationStyle: 'custom',
  navigationLinks: [
    {
      title: 'About me',
      pageId: '1b675f78cd20812c9999e72e36d6c15b'
    },
    {
      title: 'Contact',
      pageId: '1b675f78cd2081cbb7c7f0ec13339a5f'
    }
  ]
})
