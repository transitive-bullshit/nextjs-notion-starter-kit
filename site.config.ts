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

<<<<<<< HEAD
  // open graph metadata (optional)
  description: 'A faith-driven studio creating tabletop worlds, stories, and resources shaped by Scripture and imagination. Discover our games, follow our progress, and join us on the journey.',
=======
  // open graph metadata
  description:
    'A faith-driven studio creating tabletop worlds, stories, and resources shaped by Scripture and imagination. Discover our games, follow our progress, and join us on the journey.',
>>>>>>> testing

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

  // navigation style
  navigationStyle: 'default'
  // navigationStyle: 'custom',
  // navigationLinks: [
  //   { title: 'About', pageId: 'f1199d37579b41cbabfc0b5174f4256a' },
  //   { title: 'Contact', pageId: '6a29ebcb935a4f0689fe661ab5f3b8d1' }
  // ]
})
