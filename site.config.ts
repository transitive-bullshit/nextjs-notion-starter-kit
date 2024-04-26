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
  description: '',

  // social usernames (optional)
  twitter: 'KujiraTiku',
  // github: 'transitive-bullshit',
  // linkedin: 'fisch2',
   mastodon: 'https://fedibird.com/@kujiTake', // optional mastodon profile URL, provides link verification
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
  // important pages. To use `navigationLinks`, set `navigationStyle` to `custom`.
  // navigationStyle: 'default'
  navigationStyle: 'custom',
  navigationLinks: [
     {
       title: 'HOME',
       pageId: '858447c91db0434282b31b8d08d8df83'
     },
     {
      title: 'ABOUT',
      pageId: 'About-bd3e799e3ec14c28848511e4b5450d2a'
    },
     {
       title: 'BLOG',
       pageId: '6ff6114a871849b785453bc706574282'
     }
   ]
})
