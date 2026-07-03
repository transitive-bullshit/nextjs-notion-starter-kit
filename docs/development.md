# Development

Local setup, commands, and conventions.

## Requirements

- Node ≥ 20 (see `engines` in [`package.json`](../package.json))
- `pnpm` 10 (see `packageManager` in `package.json` — enforced by Corepack)

## Commands

```bash
pnpm dev                  # next dev (http://localhost:3000)
pnpm notion:index         # refresh the generated slug index and static sitemap
pnpm build                # refresh the index, then run next build
pnpm start                # next start (serve the production build)
pnpm deploy               # vercel deploy
pnpm test                 # lint + prettier + unit tests in parallel
pnpm test:lint            # eslint
pnpm test:prettier        # prettier --check
pnpm test:unit            # vitest run
```

### Dependency-linking helpers

For developing against a local checkout of `react-notion-x`:

```bash
pnpm deps:link            # pnpm link ../react-notion-x/packages/*
pnpm deps:unlink          # reinstall from npm
pnpm deps:upgrade         # pnpm up -L notion-client notion-types notion-utils react-notion-x
```

All three are no-ops in CI (`GITHUB_ACTIONS` guard).

## `.env.local`

Copy [`.env.example`](../.env.example) to `.env.local` for local overrides. Most values are optional; see [configuration.md](configuration.md) for the full list. Typical local setup needs nothing — the site just runs against the configured public Notion workspace.

## Stack

- **Next.js 16** (Pages Router, not App Router — the Notion rendering pipeline is built for `getStaticProps`)
- **React 19**
- **TypeScript 5.9**
- **Tailwind CSS v4** + custom CSS files in [`styles/`](../styles/)
- **`@fisch0920/config`** — shared ESLint + Prettier config
- **pnpm patches** — see [`patches/`](../patches/) for local fixes applied on install

## Code conventions

- **Strict TypeScript.** `tsconfig.json` extends Next.js defaults; no `any` allowed in new code.
- **Prettier** via `@fisch0920/config/prettier` — run on pre-commit via `lint-staged` + `simple-git-hooks`.
- **ESLint flat config** in [`eslint.config.js`](../eslint.config.js).
- **Path aliases:** `@/*` → project root (e.g., `@/lib/config`).
- **Class names:** merge with `cn()` from [`@/lib/utils`](../lib/utils.ts) (clsx + tailwind-merge). Importing `classnames` is banned by ESLint.
- **CSS modules** for component-scoped styles (`*.module.css`), global sheets in [`styles/`](../styles/). See [styling.md](styling.md).

## Git hooks

`simple-git-hooks` runs `npx lint-staged` on pre-commit, which formats and lints staged `.ts`/`.tsx` files. Install the hook on first clone:

```bash
pnpm install
npx simple-git-hooks
```

## Debugging tips

- **Page not resolving?** Check `site.config.ts` → `pageUrlOverrides`, then whether the page is `Public` in Notion (public pages only; see `getSiteMap` filter).
- **Stale images?** The `.amazonaws.com` strip in `getPage` should prevent this. If you see expired signed URLs, check that `lib/notion.ts` ran (vs. a direct `notion.getPage` call).
- **429s in dev?** The runtime client only retries once. If you're hammering a lot of pages (crawling), either restart (to reset the in-memory caches) or temporarily use `buildNotion` which serializes requests.
- **Build taking forever?** The prebuild indexer deliberately serializes Notion fetches with a 1.1s gap. The crawl can take several minutes, but it runs once per build and never during a user request.
- **`NODE_ENV=development` with UUIDs in URLs:** `includeNotionIdInUrls` defaults to `true` in dev so you can round-trip any Notion URL locally. Toggle via `site.config.ts` if that's annoying.

## Testing

Unit tests run on [Vitest](https://vitest.dev). `pnpm test` runs lint, prettier,
and the unit suite in parallel (`run-p test:*`).

```bash
pnpm test:unit            # vitest run (single pass)
pnpm exec vitest          # watch mode while developing
```

Tests live next to the code they cover in `__tests__/` folders (e.g.
[`lib/__tests__/`](../lib/__tests__/)) and are named `*.test.ts`. The suite
currently covers pure `lib/` utilities; config runs in the Node environment
(see [`vitest.config.ts`](../vitest.config.ts)) — switch to `jsdom` there when
adding React component tests.

Visual/integration testing is still manual — push to a Vercel preview and click
around.
