import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: 'acd4ce733c3b49faa4c2306f51b32b23',
  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'Julia Maheoi',
  domain: 'maheoi.com',
  author: 'Julia Maheoi',

  // open graph metadata (optional)
  description: 'Juju Maheoi: Xamanismo e Oráculo online. Expanda sua consciência, se conectando à natureza e aprendendo a se manter em equilíbrio.',

  // social usernames (optional)
  // twitter: 'transitive_bs',
  // github: 'juliaramosguedes',
  // linkedin: 'fisch2',
  // mastodon: '#', // optional mastodon profile URL, provides link verification
  // newsletter: '#', // optional newsletter URL
  youtube: '@juliamaheoi', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`

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
  // navigationStyle: 'default'
  navigationStyle: 'custom',
  navigationLinks: [
    {
      title: 'Contato',
      pageId: '6bfc4014d0394baf8a6dbc48cf0559a6'
    },
    {
      title: 'Agenda',
      pageId: '28dfdc48dc4641e99ac33a4c9e551b38'
    }
  ]
})
