import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: 'ba15d6f728ae4214bfcf2e050a867998',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: '8605e3b3-6f4b-4047-a192-afb982b25309',

  // basic site info (required)
  name: 'Rainey Space',
  domain: 'rainey.space',
  author: 'Rainey',

  // open graph metadata (optional)
  description: 'Keep Alive & Do Better.',

  // social usernames (optional)
  twitter: 'XueRainey',
  github: 'RaineySpace',
  linkedin: '',
  jike: 'FBF0F46B-5CA8-4568-A98C-3D50EF570462',
  // newsletter: '#', // optional newsletter URL
  // youtube: '#', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // whether or not to enable support for LQIP preview images (optional)
  isPreviewImageSupportEnabled: true,

  // whether or not redis is enabled for caching generated preview images (optional)
  // NOTE: if you enable redis, you need to set the `REDIS_HOST` and `REDIS_PASSWORD`
  // environment variables. see the readme for more info
  isRedisEnabled: true,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  pageUrlOverrides: {
    '/record': 'ff06c4aca7b14913b1bda1879a171196',
    '/about': 'cadd73f1fa8e4f328993524fd9f58270',
    '/food': '214244e551d0492d8bc6572968ebfb6d',
    '/movie': '23cb8c9c07f04aff920ec00300cf1466',
    '/game': 'c7490a4d5b5a400cb1c1f500c05b05a0',
    '/drama': '0e998c8235234bc8b5973df1f22b3e23',
    '/book': 'b94cbd1bc98f41e79da21df8423ed349',
    '/photography': 'c12ec4982f7546f7a0c2a9057f31eda8',
  },

  // whether to use the default notion navigation style or a custom one with links to
  // important pages
  navigationStyle: 'custom',
  navigationLinks: [
    {
      title: '记录',
      pageId: 'ff06c4aca7b14913b1bda1879a171196'
    },
    {
      title: '关于',
      pageId: 'cadd73f1fa8e4f328993524fd9f58270'
    },
  ]
})
