import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: '858447c91db0434282b31b8d08d8df83',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'KujiraTiku',
  domain: 'nextjs-notion-starter-kit.transitivebullsh.it',
  author: 'KujiraTiku',

  // open graph metadata (optional)
  description: '清熱鯨騰草',

  // social usernames (optional)
  myCat:'https://seto-life.vercel.app/',
  twitter: 'KujiraTiku',
  // github: 'transitive-bullshit',
  // linkedin: 'fisch2',
  mastodon: 'https://fedibird.com/@TikuTalk', // optional mastodon profile URL, provides link verification
  // newsletter: '#', // optional newsletter URL
  // youtube: '#', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`
  pixiv: '2781527',

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
  isRedisEnabled: false,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  // pageUrlOverrides: {
  //   '/foo': '067dd719a912471ea9a3ac10710e7fdf',
  //   '/bar': '0be6efce9daf42688f65c76b89f8eb27'
  // }
  pageUrlOverrides: null,

  // whether to use the default notion navigation style or a custom one with links to
  // important pages. To use `navigationLinks`, set `navigationStyle` to `custom`.
  // navigationStyle: 'default'
  navigationStyle: 'custom',
  navigationLinks: [
    {
      title: 'Home',
      pageId: '858447c91db0434282b31b8d08d8df83'
    },
    {
      title: 'About',
      pageId: 'About-8ff57d87b0654b0b8c38b5e05947d5d7'
    },
    {
      title: 'Blog',
      pageId: 'Blog-6d3fa135bc944d3d93d5c71007f874c9'
    },
    {
      title: 'Gallery',
      pageId: 'Gallery-8135fc5f12fb4115970586bd53484963'
    }
  ]
})