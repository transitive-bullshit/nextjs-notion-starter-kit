import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: '48f556de3ec544c2b95b376bf36589f1',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'Kostiantyn Beznos',
  domain: 'Kostiantyn Beznos',
  author: 'Kostiantyn Beznos',

  // open graph metadata (optional)
  description: 'Kostiantyn Beznos Portfolio',

  // social usernames (optional)
  //twitter: '#',
  //github: '#',
  linkedin: 'kostiantyn-beznos',
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
  // navigationStyle: 'default'
  navigationStyle: 'custom',
  navigationLinks: [
    {
      title: 'My Works',
      pageId: '48f556de3ec544c2b95b376bf36589f1'
    },
    {
      title: 'Resume',
      pageId: 'b8f1f2a2ada6468c9c22bbabca5f67b5'
    },
    {
      title: 'Contact',
      pageId: '7ea98d9c635c4d23ae3e251dbd22111d'
    }
  ]
})
