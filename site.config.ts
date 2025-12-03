import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: '1d1dd21a4999807dae4bed5066a845d9',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'Explore - Pietro De Finis',
  domain: 'explore.pietrodefinis.com',
  author: 'Pietro De Finis',

  // open graph metadata (optional)
  description: 'Esploratore, scienziato, innovatore e storyteller. Vieni a scoprire il mio mondo',

  // social usernames (optional)
  //github: 'pit-def',
  linkedin: 'pietro-de-finis',
  instagram: 'pit.def',
  facebook: 'pit.definis',
  website: 'https://pietrodefinis.com',
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
  /* pageUrlOverrides: {
     '/esplorazioni': '297dd21a499980d38730fe4eed6c4fdf',
     '/progetti': '258dd21a499980b9a59bcd26c5f52a8e',
     '/storie': '25add21a499980adb8b3e6bc430bcb16',
     '/contenuti': '25add21a49998089b9d0c68767824318'
   },*/
  pageUrlOverrides: null,

  // whether to use the default notion navigation style or a custom one with links to
  // important pages. To use `navigationLinks`, set `navigationStyle` to `custom`.
  //navigationStyle: 'default'
   navigationStyle: 'custom',
   navigationLinks: [
    {
       title: 'Esplora',
       pageId: '297dd21a4999806480f3f1c72b707d19'
     } 
    /* {
       title: 'Eplorazioni',
       pageId: '25add21a49998056839ceff880208b0b'
     },
     {
       title: 'Progetti',
       pageId: '258dd21a499980b9a59bcd26c5f52a8e'
     },
     {
       title: 'Storie',
       pageId: '25add21a499980adb8b3e6bc430bcb16'
     },
     {
       title: 'Contenuti',
       pageId: '25add21a49998089b9d0c68767824318'
     },
     {
       title: 'Contattami',
       pageId: '20ddd21a4999800fa9c6dc3d5421fd7e'
     }*/
   ]
})
