import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: '20a60a013f0d807c88ccc593e7bec449',

  // if you want to restrict pages to a single notion workspace (optional)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'Armando Correa',
  domain: 'armando.vercel.app',
  author: 'Armando Correa',

  // open graph metadata (optional)
  description: 'A portfolio site showcasing my engineering work from undergrad and grad school.',

  // social usernames (optional) – you can add more if you'd like
  twitter: '', // let me know your handle if you want it shown
  github: 'slightarmando',
  linkedin: '', // same here — what’s your LinkedIn username?

  // default notion icon and cover images for site-wide consistency (optional)
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // LQIP preview images (low-quality image placeholders)
  isPreviewImageSupportEnabled: false,

  // Redis not used
  isRedisEnabled: false,

  // custom URL mappings (optional)
  pageUrlOverrides: null,

  // navigation style
  navigationStyle: 'default'
})
