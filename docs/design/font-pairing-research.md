# Google Fonts pairing research: author-note prototype

Research date: 2026-08-20

## Decision

Selected **Cormorant Garamond / Manrope / JetBrains Mono** (option 7) for the landing-page type system. The pairing is scoped to the landing hero, author note, writing index, and footer; article-reading pages keep their existing typography for now. Cormorant uses the prototype's 500-weight display calibration, while Manrope and JetBrains Mono cover body/UI and technical metadata respectively.

## Scope and decision lens

This shortlist is for the centered author-note specimen, not the article-reading type system. The desired signal is dark, elegant, refined, personal, and technically credible, with enough oddness to belong beside the interactive `YOOOOOOOO` hero. Instrument Serif remains the control; the other nine choices stay in its display-centric neighborhood instead of retreating to safe text serifs.

Google's typography guidance supports that split: expressive or idiosyncratic faces are appropriate at headline scale, while the body should use a quieter, highly legible face. It also notes that pairings can work through either contrast or similarity, and specifically recommends balancing a striking display face with a toned-down body face. ([Google Design: Choosing Web Fonts](https://design.google/library/choosing-web-fonts-beginners-guide), [Google Fonts Knowledge: Pairing typefaces](https://fonts.google.com/knowledge/choosing_type/pairing_typefaces))

The rankings and pairings below are design inferences from those principles and this site's brief. The factual family descriptions, formats, and axes come from Google Fonts and the type designers' own repositories.

## Ranked 10-option matrix

| Rank | Headline family | Body family | Mono / support family | Personality axis | Recommended prototype styles | Why it belongs | Honest tradeoff |
| --: | --- | --- | --- | --- | --- | --- | --- |
| 1 | [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) | [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans) | [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) | Expressive contemporary ↔ technical restraint | Serif 400; Sans 400/500; Mono 400/500 | The liked control: condensed, stylish, and unusual without becoming ornate. The family was explicitly created as a condensed display serif for Instrument's brand. ([Google Fonts onboarding](https://github.com/google/fonts/issues/5915)) | The current popularity of Instrument Serif can make it feel trend-aware rather than wholly proprietary. |
| 2 | [Gloock](https://fonts.google.com/specimen/Gloock) | [Manrope](https://fonts.google.com/specimen/Manrope) | [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) | Sharp editorial ↔ engineering precision | Gloock 400; Manrope 400/600; JetBrains Mono 400/500 | Best direct alternative. Its designer calls it a contemporary high-contrast serif intended for headlines and large sizes; the smooth thick/thin relationship gives the note confidence without extra decoration. ([Gloock repository](https://github.com/duartp/gloock)) | Roman only and one weight. Its polished editorial tone can edge toward fashion if spacing is too precious. |
| 3 | [Hedvig Letters Serif](https://fonts.google.com/specimen/Hedvig+Letters+Serif) | [Hedvig Letters Sans](https://fonts.google.com/specimen/Hedvig+Letters+Sans) | [Fragment Mono](https://fonts.google.com/specimen/Fragment+Mono) | Human imperfection ↔ digital utility | Serif 400 at `opsz: 24`; Sans 400; Mono 400 | Strongest novel option. The Serif and Sans share a skeleton, while the designers intentionally preserve small optical “mistakes,” producing an odd but coherent personal voice. ([Hedvig Letters repository](https://github.com/KanonFoundry/HedvigLetters)) | The irregularity is subtle at first glance but can look slightly awkward in unlucky word shapes. The Sans has only one weight. |
| 4 | [Fraunces](https://fonts.google.com/specimen/Fraunces) | [Work Sans](https://fonts.google.com/specimen/Work+Sans) | [Space Mono](https://fonts.google.com/specimen/Space+Mono) | Playful old-style ↔ utilitarian grid | Fraunces 500, `opsz: 96`, `SOFT: 20`, `WONK: 1`; Work Sans 400/500; Space Mono 400/700 | Best match for the site's playful motion. Fraunces deliberately ranges from refined to inky and wonky through four axes, so the prototype can tune personality instead of accepting a fixed costume. ([Google Fonts Fraunces article/source](https://github.com/google/fonts/blob/main/ofl/fraunces/article/ARTICLE.en_us.html)) | The `WONK` and `SOFT` axes can turn charm into retro whimsy quickly; keep softness restrained. |
| 5 | [Kalnia](https://fonts.google.com/specimen/Kalnia) | [Figtree](https://fonts.google.com/specimen/Figtree) | [Spline Sans Mono](https://fonts.google.com/specimen/Spline+Sans+Mono) | Machine-age ornament ↔ contemporary interface | Kalnia 400, `wdth: 108`; Figtree 400/500/600; Spline Sans Mono 400/500 | Best wildcard. Kalnia combines high contrast and refined terminals with variable width, explicitly bridging old display typography and modern production; its designer also works where code and design meet. ([Kalnia repository](https://github.com/fridamedrano/Kalnia-Typeface)) | The Victorian/fat-face DNA is conspicuous. Too much width or weight will compete with the WebGL hero and feel poster-like rather than quiet. |
| 6 | [Bodoni Moda](https://fonts.google.com/specimen/Bodoni+Moda) | [DM Sans](https://fonts.google.com/specimen/DM+Sans) | [Azeret Mono](https://fonts.google.com/specimen/Azeret+Mono) | Couture contrast ↔ system clarity | Bodoni Moda 500, `opsz: 72`; DM Sans 400/500; Azeret Mono 400/500 | The most severe elegant option. Its digital-era Bodoni source provides weight, italic, and optical-size ranges, so it can retain fine detail without relying on a fragile single cut. ([Bodoni source repository](https://github.com/indestructible-type/Bodoni)) | Hairlines can disappear against the dark background or on lower-density screens. It can feel like a luxury brand before it feels like an engineer. |
| 7 | [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) | [Manrope](https://fonts.google.com/specimen/Manrope) | [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) | Calligraphic grandeur ↔ geometric calm | Cormorant Garamond 500; Manrope 400/600; JetBrains Mono 400/500 | The most elegant and authorial option. Cormorant is explicitly a display family inspired by Garamond's legacy and supplies five weights plus italics. ([Google Fonts family description](https://github.com/google/fonts/blob/main/ofl/cormorant/DESCRIPTION.en_us.html)) | More romantic and literary than hacker-like; its small x-height requires a larger headline size and careful line breaks. |
| 8 | [Libre Caslon Display](https://fonts.google.com/specimen/Libre+Caslon+Display) | [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) | [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) | 1960s lettering ↔ modern product polish | Libre Caslon Display 400; Plus Jakarta Sans 400/500/600; IBM Plex Mono 400/500 | A hand-lettered, less predictable classic. The project intentionally looked beyond standard 18th-century revivals to American Caslon lettering from the 1960s, and the Display cut is made for large headlines. ([Libre Caslon repository](https://github.com/KatjaSchimmel/Libre-Caslon)) | One weight, no italic in the Google Fonts cut. It risks an advertising/editorial nostalgia that may not connect to the computational hero. |
| 9 | [DM Serif Display](https://fonts.google.com/specimen/DM+Serif+Display) | [DM Sans](https://fonts.google.com/specimen/DM+Sans) | [DM Mono](https://fonts.google.com/specimen/DM+Mono) | Compact editorial ↔ cohesive product system | Serif 400; Sans 400/500; Mono 400/500 | A deliberately cohesive trio with a crisp, compact display voice. The three families are maintained together in the first-party DM fonts project and were commissioned from Colophon Foundry. ([DM fonts repository](https://github.com/googlefonts/dm-fonts)) | The least novel of the shortlist. DM Sans is common enough that the overall result may feel like a polished template rather than a signature identity. |
| 10 | [Young Serif](https://fonts.google.com/specimen/Young+Serif) | [Figtree](https://fonts.google.com/specimen/Figtree) | [Fragment Mono](https://fonts.google.com/specimen/Fragment+Mono) | Tender old-style ↔ neutral modernity | Young Serif 400; Figtree 400/500/600; Fragment Mono 400 | The softest option. Rounded `b` and `f` forms give this old-style serif a generous, approachable character that can make the author note feel personal rather than ceremonial. ([Young Serif repository](https://github.com/noirblancrouge/YoungSerif)) | Its friendliness may undershoot “high-end hacker,” and its current Next.js catalog entry exposes only the static Roman 400 cut. |

## Short recommendation

Keep option 1 unchanged as the control. The four most informative challengers are:

1. **Gloock** — most likely to beat Instrument Serif without changing the intended refinement level.
2. **Hedvig Letters Serif** — most original, and its deliberately human imperfections suit a personal site built by an engineer.
3. **Fraunces** — strongest connection to the bold, reactive, playful hero; it should be tested with restrained axis settings.
4. **Kalnia** — useful high-contrast wildcard that exposes whether the desired identity can tolerate more ornament.

The remaining five are deliberate boundary tests: Bodoni Moda and Cormorant push elegance; Libre Caslon and Young Serif push warmth and historical character; DM provides a conservative cohesive baseline.

## Installed `next/font/google` verification

Verified against this workspace's installed Next.js 16.3.1 files:

- `node_modules/next/dist/compiled/@next/font/dist/google/font-data.json`
- `node_modules/next/dist/compiled/@next/font/dist/google/index.d.ts`

| Option | Exact imports | Installed range relevant to the prototype |
| --: | --- | --- |
| 1 | `Instrument_Serif`, `Instrument_Sans`, `IBM_Plex_Mono` | Serif: 400 Roman/italic. Sans: variable 400–700, `wdth` 75–100. Mono: 100–700 Roman/italic. |
| 2 | `Gloock`, `Manrope`, `JetBrains_Mono` | Gloock: 400 Roman. Manrope: variable 200–800. Mono: variable 100–800 Roman/italic. |
| 3 | `Hedvig_Letters_Serif`, `Hedvig_Letters_Sans`, `Fragment_Mono` | Serif: 400 with `opsz` 12–24. Sans: 400 Roman. Mono: 400 Roman/italic. |
| 4 | `Fraunces`, `Work_Sans`, `Space_Mono` | Fraunces: variable 100–900 Roman/italic, `opsz` 9–144, `SOFT` 0–100, `WONK` 0–1. Sans: variable 100–900. Mono: 400/700 Roman/italic. |
| 5 | `Kalnia`, `Figtree`, `Spline_Sans_Mono` | Kalnia: variable 100–700, `wdth` 100–125. Sans: variable 300–900 Roman/italic. Mono: variable 300–700 Roman/italic. |
| 6 | `Bodoni_Moda`, `DM_Sans`, `Azeret_Mono` | Bodoni: variable 400–900 Roman/italic, `opsz` 6–96. Sans: variable 100–1000 Roman/italic, `opsz` 9–40. Mono: variable 100–900 Roman/italic. |
| 7 | `Cormorant_Garamond`, `Manrope`, `JetBrains_Mono` | Cormorant: variable 300–700 Roman/italic. Supporting ranges as option 2. |
| 8 | `Libre_Caslon_Display`, `Plus_Jakarta_Sans`, `IBM_Plex_Mono` | Caslon: 400 Roman. Sans: variable 200–800 Roman/italic. Mono as option 1. |
| 9 | `DM_Serif_Display`, `DM_Sans`, `DM_Mono` | Serif: 400 Roman/italic. Sans as option 6. Mono: 300/400/500 Roman/italic. |
| 10 | `Young_Serif`, `Figtree`, `Fragment_Mono` | Young Serif: 400 Roman in Next 16.3.1. Supporting ranges as options 5 and 3. |

For non-weight axes, `next/font/google` requires naming the extra axes explicitly: `axes: ['opsz']` for Hedvig and Bodoni Moda, `axes: ['SOFT', 'WONK', 'opsz']` for Fraunces, and `axes: ['wdth']` for Kalnia. A loader with custom axes must omit `weight` or use `weight: 'variable'`; the prototype then selects 400 or 500 in CSS. Next.js includes weight by default and recommends loading extra axes only when used. ([Next.js Font API](https://nextjs.org/docs/app/api-reference/components/font))

## Prototype implementation note

All ten options are appropriate on an isolated comparison route, but the production page should ship only the selected trio. Next.js recommends using multiple fonts conservatively because every family is another client resource. For the prototype, set `preload: false` on non-control families so opening the route does not eagerly preload the entire comparison catalog; the winning production families can return to normal preloading. Next.js self-hosts Google Fonts at build time, so no browser request is sent to Google. ([Next.js Font Optimization](https://nextjs.org/docs/app/getting-started/fonts), [Next.js Font API](https://nextjs.org/docs/app/api-reference/components/font))
