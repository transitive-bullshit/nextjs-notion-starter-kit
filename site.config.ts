import { type NavigationLink, siteConfig } from './lib/site-config'
import { type NavigationStyle, type PageUrlOverridesMap } from './lib/types'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId:
    process.env.NOTION_ROOT_PAGE_ID || '7875426197cf461698809def95960ebf',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: process.env.NOTION_ROOT_SPACE_ID || null,

  // basic site info (required)
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Next.js Notion Starter Kit',
  domain:
    process.env.NEXT_PUBLIC_SITE_DOMAIN ||
    'nextjs-notion-starter-kit.transitivebullsh.it',
  author: process.env.NEXT_PUBLIC_SITE_AUTHOR || 'Travis Fischer',

  // open graph metadata (optional)
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'Example Next.js Notion Starter Kit Site',

  // social usernames (optional)
  twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || 'transitive_bs',
  github: process.env.NEXT_PUBLIC_SOCIAL_GITHUB || 'transitive-bullshit',
  linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || 'fisch2',
  // mastodon: '#', // optional mastodon profile URL, provides link verification
  // newsletter: '#', // optional newsletter URL
  youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || '#', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: process.env.DEFAULT_PAGE_ICON || null,
  defaultPageCover: process.env.DEFAULT_PAGE_COVER || null,
  defaultPageCoverPosition:
    Number(process.env.DEFAULT_PAGE_COVER_POSITION) || 0.5,

  // whether or not to enable support for LQIP preview images (optional)
  isPreviewImageSupportEnabled: process.env.PREVIEW_IMAGES_ENABLED === 'true',

  // whether or not redis is enabled for caching generated preview images (optional)
  // NOTE: if you enable redis, you need to set the `REDIS_HOST` and `REDIS_PASSWORD`
  // environment variables. see the readme for more info
  isRedisEnabled: process.env.REDIS_ENABLED === 'true',

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  // pageUrlOverrides: {
  //   '/foo': '067dd719a912471ea9a3ac10710e7fdf',
  //   '/bar': '0be6efce9daf42688f65c76b89f8eb27'
  // }
  pageUrlOverrides: process.env.PAGE_URL_OVERRIDES
    ? (JSON.parse(process.env.PAGE_URL_OVERRIDES) as PageUrlOverridesMap)
    : null,

  // whether to use the default notion navigation style or a custom one with links to
  // important pages. To use `navigationLinks`, set `navigationStyle` to `custom`.
  navigationStyle:
    (process.env.NAVIGATION_STYLE as NavigationStyle) || 'default', // or 'custom'
  navigationLinks: process.env.NAVIGATION_LINKS
    ? (JSON.parse(process.env.NAVIGATION_LINKS) as NavigationLink[])
    : []
  // navigationLinks: [
  //   {
  //     title: 'About',
  //     pageId: 'f1199d37579b41cbabfc0b5174f4256a'
  //   },
  //   {
  //     title: 'Contact',
  //     pageId: '6a29ebcb935a4f0689fe661ab5f3b8d1'
  //   }
  // ]
})
