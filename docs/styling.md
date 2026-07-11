# Styling

The styling story is deliberately two-track: the Notion-rendered content uses plain CSS sheets from the upstream starter kit, while the playground and newer custom UI uses Tailwind v4 + shadcn. Migration between the two is incremental.

## CSS file map

| File | Purpose |
|---|---|
| [`styles/globals.css`](../styles/globals.css) | Tailwind v4 import, shadcn tokens, baseline typography. Loaded globally. |
| [`styles/notion.css`](../styles/notion.css) | Upstream overrides for `react-notion-x` — padding, code blocks, image framing, etc. |
| [`styles/wustep.css`](../styles/wustep.css) | The bulk of this site's custom Notion styling — colors, dark-mode tokens, button-block styling, posts switcher, callouts, footer. |
| [`styles/prism-theme.css`](../styles/prism-theme.css) | Syntax highlighting theme for code blocks. |
| [`styles/applause.css`](../styles/applause.css) | Styles for the applause button. |

All five are imported from `pages/_app.tsx` or via `_document.tsx`.

## Tailwind v4

Configured by [`postcss.config.js`](../postcss.config.js) using `@tailwindcss/postcss`. No `tailwind.config.js` — v4 uses CSS-native `@custom-variant` / `@theme` directives inside `globals.css`.

- Dark mode: `@custom-variant dark (&:is(.dark-mode *))` — keyed off the same `dark-mode` body class the Notion track uses, so `dark:` utilities and the `.dark-mode` token overrides flip together.
- The shadcn token system (`--background`, `--foreground`, etc.) sits in `:root` in `globals.css`.

## The two token systems (namespaced)

The two tracks used to define the *same* variable names (`--primary`, `--background`, …) at `:root`, and wustep.css — imported last — silently won the cascade for every shadcn utility. The wustep track is now namespaced so the systems can't collide. Who owns which token:

| Namespace | Owner | Examples | Consumers |
|---|---|---|---|
| `--w-*` | `styles/wustep.css` | `--w-primary`, `--w-secondary`, `--w-accent`, `--w-background`, `--w-surface`, `--w-divider` | Notion pages, Page404/ErrorPage, MidiVisualizer, `/design` pages' custom CSS |
| shadcn names | `styles/globals.css` | `--background`, `--foreground`, `--primary`, `--muted-foreground`, `--sidebar*` | Tailwind utilities + [`components/ui/`](../components/ui/) |
| `--dw-*` | `styles/globals.css` | `--dw-accent`, `--dw-field-h`, `--dw-radius-*` | `/design` workbench shell + tools |
| `--about-*` | `components/AboutPage.module.css` | `--about-text`, `--about-accent` | About page (theme workbench overrides them in preview) |
| shared | `styles/wustep.css` (`--space-*`, `--radius-sm/md/lg`, `--font-*`) and `styles/globals.css` (`--z-*`, `--ease-*`) | | both tracks |

New components should still pick a track and stick with it; never redefine another namespace's token.

## Dark mode

Driven by [`lib/use-dark-mode.ts`](../lib/use-dark-mode.ts) (a thin wrapper around `@fisch0920/use-dark-mode`). Toggles a `dark-mode` class on `<body>`. `styles/wustep.css` has `.dark-mode { --primary: ...; ... }` blocks that swap the token values.

The shadcn side uses the `dark` class variant — separate mechanism.

## CSS modules

Per-component scoped styles live alongside their component:

- [`components/AboutPage.module.css`](../components/AboutPage.module.css)
- [`components/PageSocial.module.css`](../components/PageSocial.module.css)
- [`components/Page404.module.css`](../components/Page404.module.css)
- [`components/styles.module.css`](../components/styles.module.css) — shared across the Notion page shell.
- [`components/wustep/BookshelfCover.module.css`](../components/wustep/BookshelfCover.module.css)

Any new UI component should follow this pattern rather than adding to the global sheets, unless it's overriding `react-notion-x` output specifically.

## Fonts

Loaded via `next/font/google` in [`pages/_app.tsx`](../pages/_app.tsx). The OG image generator separately bundles Inter SemiBold as a binary blob in [`lib/fonts/`](../lib/fonts/) because Edge runtime can't read network fonts at request time.

## Notion-specific styling notes

A few patterns used throughout `styles/wustep.css`:

- Target block types via `.notion-callout.notion-<color>_background` for callout colors.
- Target button blocks (highlighted link blocks) via the classes `react-notion-x` emits plus extra markers added in the custom `blockMap`.
- Collection titles can be hidden on a per-page basis via the `Disable Collection Links` property; the styling is applied via a conditional class on the page root.

## When to use which

- Styling a Notion block or the page shell → `styles/wustep.css`.
- Styling a custom component (AboutPage, playground pages, etc.) → a CSS module colocated with the component.
- Styling a shadcn-based UI primitive → Tailwind classes + the token system in `globals.css`.
