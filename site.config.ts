import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: 'ae7d520aa99e493ea080d1307e6fe07e',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'Teacher Madona Blog',
  domain: 'nextjs-notion-starter-kit.transitivebullsh.it',
  author: 'Thy madona',

  // open graph metadata (optional)
  description: 'The blog about my teaching',

  // social usernames (optional)
  twitter: 'thymadonakh',
  github: 'thymadonakh',
  linkedin: 'thymadonakh',
  // mastodon: '#', // optional mastodon profile URL, provides link verification
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
  // important pages
  // navigationStyle: 'default',
  navigationStyle: 'custom',
  navigationLinks: [
    {
      title: 'Videos',
      pageId: 'e339dcfb6e9b4fa1b7be5ae380c2c3c4?v=f6ea695bbb904274afb4d5ab82f0d279'
    },
    {
      title: 'Projects',
      pageId: 'c8b60f702ae442dcb7f5a005d602e1a4'
    },
    {
      title: 'Blogs',
      pageId: '17d6149af5674d07a2b500949cee7c38'
    }
  ]
})
