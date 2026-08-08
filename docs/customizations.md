# Customizations

This repo forks [nextjs-notion-starter-kit](https://github.com/transitive-bullshit/nextjs-notion-starter-kit) and adds a set of bespoke features. All local additions live under [`components/wustep/`](../components/wustep/) or as dedicated pages / lib files, making them easy to find and port.

## Posts view switcher

The homepage has a "Posts" heading with a toggle between **Gallery** and **List** views. The non-active view's blocks are hidden via CSS.

- Config: `homePostsCalloutBlockId`, `homePostsHeadingBlockId`, `homeGalleryBlockIds`, `homeListBlockIds` in [`site.config.ts`](../site.config.ts).
- UI component: [`components/wustep/PostsHeadingToggle.tsx`](../components/wustep/PostsHeadingToggle.tsx).
- State persistence: [`lib/use-posts-view-mode.ts`](../lib/use-posts-view-mode.ts) — `localStorage` key `posts-view-mode`, default `list`.
- The toggle is injected next to the configured heading block; the callout block above it is styled specially.

## Applause button (footer)

A per-page applause button in the footer using [applause-button.com](https://applause-button.com)'s free API.

- Component: [`components/wustep/ApplauseButton.tsx`](../components/wustep/ApplauseButton.tsx).
- Styles: [`styles/applause.css`](../styles/applause.css).
- Picks a random notion-palette color per page for visual variety.
- Counts are namespaced by the page's canonical URL.

## Custom footer

[`components/wustep/WustepFooter.tsx`](../components/wustep/WustepFooter.tsx) replaces the default footer with the applause button plus social links. Rendered from `NotionPage` instead of the upstream `Footer`.

## Giscus comments

GitHub Discussions-backed comments, opt-in via the `giscus` config field.

- Component: [`components/wustep/Comments.tsx`](../components/wustep/Comments.tsx).
- Loads giscus' client script dynamically; re-runs on dark-mode toggle so the embed's theme updates.
- Theme files served from [`public/giscus/`](../public/giscus/).
- Currently disabled (the `giscus` block in `site.config.ts` is commented out).

## Button blocks

A Notion-level extension: any highlighted block that's a link renders as a button. Implemented in the custom `blockMap` / styling passed to `react-notion-x`. See the NotionPage renderer and [`styles/wustep.css`](../styles/wustep.css) for the styling.

## "Disable Collection Links" property

A Notion page property that hides the collection view title on specific posts. Read in the NotionPage renderer and applied via CSS.

## Posts collection / RSS feed

[`pages/feed.tsx`](../pages/feed.tsx) builds an RSS feed directly from a Notion collection+view rather than from the site map, so post order follows the view's sort. Requires `postsCollectionId` and `postsCollectionViewId` in `site.config.ts`.

## Playground

A standalone section at `/playground` for interactive experiments — demos that don't fit the Notion-driven blog model.

- Index: [`pages/playground/index.tsx`](../pages/playground/index.tsx) reads [`playground/registry.tsx`](../playground/registry.tsx) for the list.
- Each entry has its own page under [`pages/playground/<slug>.tsx`](../pages/playground/).
- Custom cover components: [`components/wustep/BookshelfCover.tsx`](../components/wustep/BookshelfCover.tsx), [`components/wustep/DominoCover.tsx`](../components/wustep/DominoCover.tsx).
- Layout + nav: [`components/wustep/PlaygroundLayout.tsx`](../components/wustep/PlaygroundLayout.tsx), [`components/wustep/PlaygroundSidebar.tsx`](../components/wustep/PlaygroundSidebar.tsx).
- Entries with `ownerOnly: true` are shown only while owner mode is active.

Playground pages are outside the Notion routing pipeline — they're ordinary Next.js pages. `getSiteMap` does not cover them; they ship via the default Next.js file-based routing.

`ownerOnly` controls discovery in the Playground index and sidebar; it is not an
authorization boundary. Protect sensitive APIs with `isOwnerRequest` from
`lib/owner-mode-server.ts`, and add an equivalent server-side check to any page
whose direct URL must be private.

## Custom homepage

[`pages/index.tsx`](../pages/index.tsx) renders [`components/AboutPage`](../components/AboutPage.tsx) instead of the Notion root page. The Notion root page is still reachable via its configured override URL (`/updates` in this repo).

## Patches

[`patches/notion-client@7.10.0.patch`](../patches/notion-client@7.10.0.patch) applies two fixes on top of the pinned version. Applied automatically by pnpm on install.

1. `recordMap.collection_view[viewId]?.value` would break on certain payload shapes — replaced with the safer `getBlockValue` helper.
2. The default `apiBaseUrl` moves from `https://www.notion.so/api/v3` to `https://app.notion.com/api/v3`. Both fixes ship in [`notion-client@7.10.1`](https://github.com/NotionX/react-notion-x/releases) upstream, which was tagged on GitHub but not yet published to npm as of this patch — see the commit history on the `notion-client` package for when that lands, then drop this patch and re-run `pnpm deps:upgrade`.

## Signed-URL fix

The `.amazonaws.com` strip in [`lib/notion.ts`](../lib/notion.ts). Covered in detail in [images.md](images.md#signed-url-expiration-fix).

## Social image generator

Full custom OG image layout with author avatar, cover, title, and date. Edge runtime. See [images.md](images.md#social--og-images).

## Shadcn/Radix UI kit

[`components/ui/`](../components/ui/) holds a small set of shadcn-generated primitives (dialog, tooltip, switch, etc.) for use in playground demos and custom UI. Not used by the core Notion renderer.
