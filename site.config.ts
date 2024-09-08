import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: '2e0b31584dc3480db7b406ac699fd04f',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'Notionbees-Bee Productive',
  domain: 'notionbees.in',
  author: 'Notionbees',

  // open graph metadata (optional)
  description: 'Notionbees-Its a site where people are able to buy notion templates online',

  // social usernames (optional)
  twitter: 'notionbees',
  instagram: 'notionbees',
  // github: 'transitive-bullshit',
  linkedin: 'notionbees',
  // mastodon: '#', // optional mastodon profile URL, provides link verification
  // newsletter: '#', // optional newsletter URL
  youtube: 'channel/UC2d_Ha_qk2E8-VQWIDH1kPQ', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`

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
  
  navigationStyle: 'custom',
  navigationLinks: [
    
    {
       title: 'Templates',
       pageId: 'bcd3c7dd643648e69cafc86373746188'
     },
    {
      title: 'Blogs',
      pageId: 'dd82a28579584fb79ad477d2832b3685'
    }
  ]
})
