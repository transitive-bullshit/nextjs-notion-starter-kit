# Plan: Google Translate Language Switcher Integration

## Overview

Add a custom Google Translate-powered language switcher to `blog.cuong.day` that allows users to click and switch between English and Vietnamese (expandable to more languages). Uses the proven [Valor Software approach](https://github.com/buchslava/nextjs-gtrans-demo) adapted to the existing `nextjs-notion-starter-kit` codebase.

## Principles

- **Zero risk** — purely additive, no existing files rewritten
- **Minimal edits** — only 3 new files + 2 minor edits to existing files
- **Match existing patterns** — follow the codebase's CSS modules, TypeScript, classnames conventions
- **Hidden Google bar** — custom UI only, no ugly default widget

---

## Phase 1: Translation Scripts (5 min)

**Goal:** Add Google Translate engine scripts to `public/`

### 1.1 Create `public/assets/scripts/lang-config.js`

Language configuration — easy to extend later:

```js
window.__GOOGLE_TRANSLATION_CONFIG__ = {
  languages: [
    { title: "English", name: "en" },
    { title: "Tiếng Việt", name: "vi" },
  ],
  defaultLanguage: "en",
};
```

### 1.2 Create `public/assets/scripts/translation.js`

Google Translate initialization callback:

```js
function TranslateInit() {
  if (!window.__GOOGLE_TRANSLATION_CONFIG__) {
    return;
  }
  new google.translate.TranslateElement({
    pageLanguage: window.__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage,
  });
}
```

**Files created:**
- `public/assets/scripts/lang-config.js`
- `public/assets/scripts/translation.js`

---

## Phase 2: LanguageSwitcher Component (15 min)

**Goal:** Create a custom switcher component that matches the existing header UI

### 2.1 Create `components/LanguageSwitcher.tsx`

Key design decisions:
- Use `nookies` for cookie management (or inline `document.cookie` to avoid adding a dep)
- Use `classnames` (already in deps) for conditional styling
- Use CSS modules (existing pattern: `styles.module.css`)
- Mark the switcher as `notranslate` to prevent Google from translating the language labels
- Style to match the existing `ToggleThemeButton` pattern (uses `breadcrumb button` classes)
- Use flag emojis or simple text labels (🇺🇸 / 🇻🇳) for visual clarity

Component behavior:
1. On mount: read `googtrans` cookie to determine current language
2. On click: set `googtrans` cookie to `/auto/{lang}` and reload page
3. Display: show current language highlighted, others as clickable links

### 2.2 Add styles to `components/styles.module.css`

Add minimal CSS for the language switcher (following existing pattern of `.navLink`):

```css
.langSwitcher {
  display: flex;
  align-items: center;
  gap: 4px;
}

.langButton {
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.langButton:hover {
  opacity: 1;
}

.langButtonActive {
  opacity: 1;
  font-weight: 600;
}
```

**Files created:**
- `components/LanguageSwitcher.tsx`

**Files modified:**
- `components/styles.module.css` (append lang switcher styles)

---

## Phase 3: Integration into Header + Global CSS (10 min)

### 3.1 Edit `pages/_document.tsx`

Add the 3 translation scripts to `<Head>` using `next/script`:

```tsx
import Script from 'next/script'

// Inside <Head>:
<Script src="/assets/scripts/lang-config.js" strategy="beforeInteractive" />
<Script src="/assets/scripts/translation.js" strategy="beforeInteractive" />
<Script src="//translate.google.com/translate_a/element.js?cb=TranslateInit" strategy="afterInteractive" />
```

### 3.2 Edit `components/NotionPageHeader.tsx`

Add `<LanguageSwitcher />` next to `<ToggleThemeButton />` in the header:

```tsx
import { LanguageSwitcher } from './LanguageSwitcher'

// In the render, after ToggleThemeButton:
<LanguageSwitcher />
<ToggleThemeButton />
```

### 3.3 Edit `styles/global.css`

Hide the ugly default Google Translate bar:

```css
/* Hide Google Translate default bar */
.goog-te-banner-frame,
.skiptranslate,
#goog-gt-tt {
  display: none !important;
}

body {
  top: 0 !important;
}
```

**Files modified:**
- `pages/_document.tsx` (add 3 Script tags)
- `components/NotionPageHeader.tsx` (add LanguageSwitcher import + usage)
- `styles/global.css` (append Google Translate hiding CSS)

---

## Phase 4: Testing & Verification (10 min)

### 4.1 Local dev test

```bash
cd 30_PRODUCTS/Personal/blog.cuong.day
pnpm dev
```

Verify:
- [ ] Language switcher appears in header next to dark mode toggle
- [ ] Clicking "Tiếng Việt" translates the page content
- [ ] Clicking "English" reverts to original
- [ ] Google Translate default bar is hidden
- [ ] Language choice persists on page navigation (cookie-based)
- [ ] Dark mode toggle still works
- [ ] No layout shift or flash of untranslated content
- [ ] Mobile responsive — switcher doesn't overflow on small screens
- [ ] `notranslate` class prevents switcher labels from being translated

### 4.2 Build test

```bash
pnpm build
```

Verify no build errors and no SSR issues with the translation scripts.

---

## File Change Summary

| File | Action | Risk |
|------|--------|------|
| `public/assets/scripts/lang-config.js` | **Create** | 🟢 None |
| `public/assets/scripts/translation.js` | **Create** | 🟢 None |
| `components/LanguageSwitcher.tsx` | **Create** | 🟢 None |
| `components/styles.module.css` | **Append** | 🟢 Low — CSS modules are scoped |
| `pages/_document.tsx` | **Edit** — add Script imports | 🟡 Low — additive only |
| `components/NotionPageHeader.tsx` | **Edit** — add switcher | 🟡 Low — additive only |
| `styles/global.css` | **Append** | 🟢 Low — hiding rules only |

**Total new files:** 3
**Total modified files:** 4
**Dependencies added:** 0 (using `document.cookie` directly)
**Estimated time:** ~40 min total

---

## UX Design Notes

- Switcher position: **right side of header**, between nav links and dark mode toggle
- Visual style: match the existing `breadcrumb button` styling
- Flag display: use text labels "EN | VI" or emoji flags "🇺🇸 | 🇻🇳" — keeping it minimal
- Active state: bold/highlighted current language, dimmed for inactive
- Separator: use `|` or `/` between languages
- `notranslate` class on the container to prevent recursive translation

## Known Limitations

1. **Translation quality** — Google Translate, not perfect for Vietnamese nuance
2. **Page reload** — switching language reloads the page (Google Translate cookie mechanism)
3. **No SEO benefit** — translated content is client-side, not indexable by search engines
4. **Flash on reload** — brief moment of English before translation applies

## Future Enhancements (Optional)

- Add more languages (just edit `lang-config.js`)
- Custom dropdown with flags instead of inline buttons
- DeepL API integration for higher quality (requires API key)
- Server-side translation caching for SEO
