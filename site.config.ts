import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: '78fc5a4b88d74b0e824e29407e9f1ec1',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: 'ac6e6eac439c464aa45986582424945e',

  // basic site info (required)
  name: 'Archiv3ds',
  domain: 'archiv3ds.vercel.app',
  author: 'Alp Yaltı',

  // open graph metadata (optional)
  description: 'Archiv3ds is the best platform for 3D Designers, Digital Artists, and Game Developers. Join us to discover new artists and share your work.',

  // social usernames (optional)
  twitter: 'archiv3ds',
  github: 'transitive-bullshit',
  linkedin: 'fisch2',
  // newsletter: '#', // optional newsletter URL
  // youtube: '#', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: 'https://transitivebullsh.it/page-icon.png',
  defaultPageCover: 'https://transitivebullsh.it/page-cover.jpg',
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
  // pageUrlOverrides: {
  //   '/foo': '067dd719a912471ea9a3ac10710e7fdf',
  //   '/bar': '0be6efce9daf42688f65c76b89f8eb27'
  // }
  pageUrlOverrides: null,

  pageUrlAdditions: {
    '/the-social-audio-revolution': 'c4deaf33cc924ad7a5b9f69c6ae04a01'
  },

  // whether to use the default notion navigation style or a custom one with links to
  // important pages
  navigationStyle: 'custom',
  navigationLinks: [
    {
      title: 'About',
      pageId: '599b332da54a4f35b03d94f302d9d76a'
    },
    {
      title: 'Contact',
      pageId: '599b332da54a4f35b03d94f302d9d76a'
    }
  ]
})
