import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: 'LJTian-Blog-ce8a73f53641460cb4ba5f92596ae14b',
  // https://tianlj.notion.site/

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'LJTian Blog',
  domain: 'ljtian.com',
  author: 'Travis Fischer',

  // open graph metadata (optional)
  description: 'Example Next.js Notion Starter Kit Site',

  // social usernames (optional)
  twitter: 'Riker_Tian',
  github: 'ljtian',
  // linkedin: 'ljtian',
  // mastodon: '#', // optional mastodon profile URL, provides link verification
  // newsletter: '#', // optional newsletter URL
  // youtube: '#', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // whether or not to enable support for LQIP preview images (optional)
  isPreviewImageSupportEnabled: false,

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
  // Explicitly map friendly category routes to their Notion page IDs.
  // This keeps Chinese and short slug URLs stable even when automatic
  // canonical path generation changes.
  pageUrlOverrides: {
    '/关于我': '0ce2fc2b-4be7-4415-9b70-83a53f9da3d9',
    '/关于博客': '8eb21be2-f7e1-47a9-a470-3622664aabd5',
    '/云原生': '552f72a9-d1a4-4a1d-a396-0f5c562bedfa',
    '/helm': '28bac97c-e94c-80a1-8bb1-e8bec94e5400',
    '/ai': '2dfac97c-e94c-80e8-8b8b-c9be540cdfc6',
    '/linux': 'ad5a5e53-f5e6-4a1e-96f6-98f7e39e2ecf',
    '/docker': '824d9e49-27f0-40ae-875f-5804b306d3d5',
    '/gogolang': 'e4c665ea-8363-483f-8e01-8f7def39bbbc',
    '/english': '225ac97c-e94c-80d2-8903-c2414e938046',
    '/other': '22caede5-bdcd-42a6-b167-de9593b04d51',
    '/业余爱好': '2dfac97c-e94c-80f4-9097-e3b5c7bfcc9a'
  },

  // whether to use the default notion navigation style or a custom one with links to
  // important pages. To use `navigationLinks`, set `navigationStyle` to `custom`.
  navigationStyle: 'default'
  // navigationStyle: 'custom',
  // navigationLinks: [
  //   {
  //     title: 'About',
  //     pageId: 'f1199d37579b41cbabfc0b5174f4256a'
  //   },
  //   {
  //     title: 'Contact',
  //     pageId: '6a29ebcb935a4f0689fe661ab5f3b8d1'
  //   }
  // ]
})
