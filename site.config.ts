import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: '1b3498833139808ebe9afc6028b2a5e6',

  // optionally restrict pages to a single Notion workspace
  rootNotionSpaceId: null,

  // basic site info
  name: 'Open Almond Studios',
  domain: 'www.openalmond.com',
  author: 'Open Almond Studios, LLC',

  // open graph metadata
  description:
    'A faith-driven studio creating tabletop worlds, stories, and resources shaped by Scripture and imagination. Discover our games, follow our progress, and join us on the journey.',

  // social links (optional)
  twitter: 'Open_Almond',
  linkedin: 'open-almond-studios',

  // Newly added socials
  discord: 'https://discord.gg/q3gF29fFX9',
  facebook:
    'https://www.facebook.com/profile.php?id=61558229720571&mibextid=ZbWKwL',
  instagram: 'https://instagram.com/openalmond',

  // optional profiles
  // mastodon: '#',
  // newsletter: '#',

  youtube: '@OpenAlmondStudios',

  // default site-wide notion images (optional)
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // preview image settings
  isPreviewImageSupportEnabled: true,

  // redis cache for preview images
  isRedisEnabled: false,

  // URL overrides for specific Notion pages
  pageUrlOverrides: null,

  // whether to use the default notion navigation style or a custom one with links to
  // important pages. To use `navigationLinks`, set `navigationStyle` to `custom`.
  navigationStyle: 'default',
  navigationLinks: [
    {
      title: 'About OAS',
      pageId: '2af498833139801f8c1fdefef66be1e5'
    },
    {
      title: 'Warriors',
      pageId: '2b1498833139809c9895d8a4d4293fca'
    },
    {
      title: 'Legacy',
      pageId: '2b24988331398032a741d74d7147871c'
    },
    {
      title: 'Playtests',
      pageId: '2af49883313980baaf8dca0bcc4837d1'
    },
    {
      title: 'Blog',
      pageId: '26449883313980758e9df71e17fd52bc'
    },
    {
      title: 'Contact Us',
      pageId: '2af49883313980019f0af9e6866bc254'
    }
  ]
})

