# Configuration

The site pulls settings from two places:

1. [`site.config.ts`](../site.config.ts) — hand-authored defaults (page IDs, domain, social handles, feature flags).
2. Environment variables — secrets and deploy-specific values.

Both are normalized and re-exported as typed values from [`lib/config.ts`](../lib/config.ts). Import from `lib/config.ts`, never from `site.config.ts` directly — the latter returns raw values without validation or type narrowing.

## `site.config.ts` reference

### Required

| Field | Notes |
|---|---|
| `rootNotionPageId` | The Notion page served at `/`. Also the starting point for `getSiteMap()`. |
| `name` | Display name. |
| `domain` | Production domain (`wustep.me`). Used for canonical URLs, OG tags, etc. |
| `author` | Author name used in OG meta and RSS feed. |

### Recommended

| Field | Notes |
|---|---|
| `rootNotionSpaceId` | Restricts all pages to one Notion workspace. Enforced by [`lib/acl.ts`](../lib/acl.ts). |
| `description` | Used in OG tags and RSS description. |
| `postsCollectionId` / `postsCollectionViewId` | Required for `/feed` to work. The view ID determines which posts are included and their order. |

### Homepage Posts switcher

A custom extension. The homepage has a "Posts" toggle that swaps between Gallery and List views.

| Field | Notes |
|---|---|
| `homePostsCalloutBlockId` | Block above which the switcher UI is rendered. |
| `homePostsHeadingBlockId` | Heading block that gets the switcher attached. |
| `homeGalleryBlockIds` | Blocks shown in Gallery mode. |
| `homeListBlockIds` | Blocks shown in List mode. |

See the `usePostsViewMode` hook for how the state is persisted.

### URL mapping

| Field | Notes |
|---|---|
| `pageUrlOverrides` | Canonical clean URLs (bidirectional). See [routing.md](routing.md). |
| `pageUrlAdditions` | One-way aliases for inbound redirects. |
| `includeNotionIdInUrls` | Default: `true` in dev, `false` in prod. |

### Navigation

| Field | Notes |
|---|---|
| `navigationStyle` | `'default'` (Notion's breadcrumbs) or `'custom'`. |
| `navigationLinks` | Custom nav entries (used when `navigationStyle === 'custom'`). |

### Feature flags

| Field | Default | Notes |
|---|---|---|
| `isPreviewImageSupportEnabled` | `false` | LQIP placeholders for all page images. See [images.md](images.md). |
| `isSearchEnabled` | `true` | Currently `false` in this repo — search was disabled in 2024-11. |
| `isRedisEnabled` | `false` | Enables Keyv+Redis for URI and preview image caches. |

### Visual defaults

| Field | Notes |
|---|---|
| `defaultPageIcon` | Fallback icon if a page has none. |
| `defaultPageCover` | Fallback cover image. |
| `defaultPageCoverPosition` | Vertical focal point (0–1) for covers. |

### Social / integrations

`x`, `github`, `linkedin`, `mastodon`, `youtube`, `newsletter`, `zhihu`, `giscus` — all optional. Giscus is configured as an object with repo/category/mapping fields; see the commented example in `site.config.ts`.

## Environment variables

Set in `.env.local` for development, Vercel project settings for production. All are optional unless noted.

### Redis (only if `isRedisEnabled: true`)

| Var | Notes |
|---|---|
| `REDIS_HOST` | Required. |
| `REDIS_PASSWORD` | Required. |
| `REDIS_USER` | Defaults to `default`. |
| `REDIS_URL` | Overrides the auto-built URL if set. |
| `REDIS_NAMESPACE` | Key prefix. Defaults to `preview-images`. |
| `REDIS_ENABLED` | Alternative to the site-config flag. |

### Analytics

Analytics is [Vercel Analytics](https://vercel.com/analytics) only — enabled by
the `@vercel/analytics` component in `_app.tsx`, no env var required. Owner-mode
traffic is excluded. (Fathom, PostHog, and Google Analytics were removed.)

### Owner mode

| Var | Notes |
|---|---|
| `OWNER_MODE_SECRET` | A value of at least 8 characters used to activate `/owner`. Keep it server-only; a random value from `openssl rand -base64 32` is recommended. |

Set `OWNER_MODE_SECRET` for Development, Preview, and Production in Vercel if owner mode should work in every environment. After changing the value, redeploy the site and activate each browser once at `/owner`.

Owner mode issues a signed, `HttpOnly`, same-site cookie for one year. A local access marker reveals the hover-only agent toggle after successful activation, while a separate active marker controls presentation and suppresses Vercel Analytics, Fathom, PostHog, and Google Analytics. The header toggle can pause or resume owner mode without forgetting the browser; “Forget this browser” at `/owner` clears both the cookie and local access.

### Notion auth (optional hardening)

As of early August 2026, the Cloudflare in front of `www.notion.so` rejects any `api/v3` request with no `User-Agent` header with a `403` — Node's `ofetch`/`undici` (which `notion-client` uses) sends none by default. `lib/notion-api.ts` sets a default browser `User-Agent` on both Notion clients to fix this; no env var needed. See [react-notion-x#710](https://github.com/NotionX/react-notion-x/issues/710).

Separately, Notion has been known to treat fully-anonymous datacenter/CI traffic differently from a real logged-in session, even on genuinely public pages. If 403s persist after the `User-Agent` fix, authenticate as a real session:

| Var | Notes |
|---|---|
| `NOTION_TOKEN_V2` | The `token_v2` cookie from a logged-in notion.so session (DevTools → Application → Cookies → `www.notion.so`). Treat as a secret. |
| `NOTION_ACTIVE_USER` | The `notion_user_id` cookie from the same session. Optional, pairs with `NOTION_TOKEN_V2`. |

Set both for Development, Preview, and Production in Vercel. The cookie is tied to a browser session and can expire or be invalidated by a password change — if 403s come back, re-extract a fresh value.

### Misc

| Var | Notes |
|---|---|
| `PORT` | Dev server port. Defaults to `3000`. |
| `NOTION_API_BASE_URL` | Override the unofficial Notion API host. Rarely needed. |
| `VERCEL_URL` | Auto-set by Vercel; used to build `apiHost` in preview deploys. |

## Deriving values

A few exports in `lib/config.ts` are computed from the above, not authored:

- `environment` — `process.env.NODE_ENV` or `'development'`.
- `isDev` — `true` when `NODE_ENV === 'development'`.
- `isServer` — `typeof window === 'undefined'`.
- `host` — `http://localhost:PORT` in dev, `https://<domain>` in prod.
- `apiHost` — uses `VERCEL_URL` on preview deploys so API calls don't go to the production domain.
- `site` — the subset of config passed around as `PageProps.site`.
- `api.*` — absolute paths to API routes.
- `inversePageUrlOverrides` — `pageId → URI` map for outbound link generation.

## Validation

`site.config.ts` is validated at import time:

- `rootNotionPageId` must parse to a UUID; otherwise the import throws.
- Every `pageUrlOverrides` / `pageUrlAdditions` URI must start with `/`.
- Every mapped value must be a valid Notion page ID.

If you add a new top-level URL mapping and the build fails early, check the error message from `cleanPageUrlMap` — it tells you which entry is bad.

Environment variables are validated on the server at startup too:

- `getEnv()` throws if a **required** var (one with no default) is missing.
- [`lib/validate-env.ts`](../lib/validate-env.ts) checks the **shape** of provided values — `OWNER_MODE_SECRET` length, `NOTION_API_BASE_URL` / `REDIS_URL` must be valid URLs, `PORT` must be numeric — and reports all problems in one error. Only vars that are set are checked, so a minimal setup never fails.
