import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: '1b3498833139808ebe9afc6028b2a5e6',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'Open Almond Studios',
  domain: 'www.openalmond.com',
  author: 'Open Almond Studios, LLC',

  // open graph metadata (optional)
  description: 'A faith-driven studio creating tabletop worlds, stories, and resources shaped by Scripture and imagination. Discover our games, follow our progress, and join us on the journey.',

  // social usernames (optional)
  twitter: 'Open_Almond',
  // github: '#',
  linkedin: 'open-almond-studios',
  // mastodon: '#', // optional mastodon profile URL, provides link verification
  // newsletter: '#', // optional newsletter URL
  youtube: '@OpenAlmondStudios', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`

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
      // Root “home” page – already known
      title: 'Home',
      pageId: '1b3498833139808ebe9afc6028b2a5e6'
    },
    {
      // Main blog index: "The Almond Branch Blog"
      // Replace this ID with the Notion ID for your Almond Branch Blog page
      title: 'Almond Branch Blog',
      pageId: '26449883313980758e9df71e17fd52bc'
    },
    {
      // Warriors of the Covenant hub or SRD page
      // Use the Notion page that your /srd or Warriors overview URL maps to
      title: 'Warriors of the Covenant',
      pageId: '2b1498833139809c9895d8a4d4293fca'
    },
    {
      // Legacy of the Remnant overview page
      title: 'Legacy of the Remnant',
      pageId: '2b24988331398032a741d74d7147871c'
    },
    {
      // “Become a Playtester” / Join Our Playtest
      title: 'Playtest',
      pageId: '2af49883313980baaf8dca0bcc4837d1'
    },
    {
      // “Connect a Ministry” page
      title: 'Connect a Ministry',
      pageId: '2b049883313980d49cabd5745b13d03f'
    },
    {
      // Privacy / Legal page
      title: 'Privacy Policy',
      pageId: '2b14988331398033bcbdfcdc2bb6d6db'
    }
  ]
})