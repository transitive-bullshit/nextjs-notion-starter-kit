---
name: playground-entry
description: Add a Playground entry to this site with an animated SVG cover — registry wiring, entry page, a four-variant cover exploration, and text variants for the entry copy, all picked by the user. Use whenever the user wants to add a project, demo, game, or experiment to the playground, wants a new or reworked cover for an existing entry, or says anything like "add X to the playground", "make a cover for X", or "animated cover photo". For a cover-only refresh, skip the registry/page steps and start at "The cover".
---

# Playground entry + animated cover

A playground entry is three pieces:

1. **Registry entry** — `playground/registry.tsx`, drives the `/playground` grid and sidebar.
2. **Page** — `pages/playground/<slug>.tsx`.
3. **Cover** — `components/wustep/<Name>Cover.tsx` + colocated `.module.css`.

The cover is the deliverable that needs taste, so it gets a structured workflow:
build **four genuinely different concepts**, show them running in the real card,
let the user pick, then ask **specific** improvement questions about the winner.
Don't skip to one cover even if you love your first idea — the variants exist
because the user's taste, not yours, decides, and comparison is how they find
out what they want. The entry copy gets the same treatment in miniature: draft
**text variants** (see "Text variants") and let the user pick a voice.

## Step 0 — absorb the project

A good cover is a caricature, not a screenshot: one scene, one motion idea,
drawn from the project's own visual language. Before designing anything:

- **Local repo?** Read its README/PRODUCT.md and skim the rendering/UI code for
  the real palette (hex values), signature objects, and mascots/characters.
  Authentic colors matter — the cover should look like it escaped from the app.
- **Live URL?** Open it in the Browser pane and screenshot the money shot
  (home screen, mid-game, whatever the project's best face is).
- Distill into notes: a 4–8 color palette, 2–3 signature objects, and the
  **one moment** hover should play (a run starting, a balloon bursting, a note
  rising). One moment — covers that animate everything read as noise.

## Step 1 — registry entry

Add to the right section of `playgroundSections` in `playground/registry.tsx`
(Experiments / Games / Visualizations). Fields (see `PlaygroundEntry` type):

- `title`, `url: '/playground/<slug>'`
- `description` — full sentence(s), shown on the entry page & link previews.
  If an AI pair-built the project, credit it in a short closing sentence, the
  way existing entries do ("Fully vibe coded with Cursor & Claude 3.5
  Sonnet."). Which phrasing ships is a text-variant decision (below).
- `summary` — short line for the card body; the card looks best when it fits one line.
- `date: 'Jul 2026'`, `year: '2026'` — the grid sorts by `date` descending.
- `source` — GitHub repo if public, else the deployed app URL.
- `article` — site path of a companion write-up, if one exists. Shows as an
  Article link in the sidebar About panel and as an icon chip on the card.
- `x` — URL of a companion X post; same treatments as `article`.
- `gradient` — Tailwind stops (`'from-… via-… to-…'`) matching the cover's
  palette. It's the fallback if the cover ever fails to render, so make it
  harmonize.
- `CoverComponent` — wire the recommended variant now, swap after the pick.

## Step 2 — page

External deployment → iframe page; copy the shape of
`pages/playground/stagebench.tsx` (`PlaygroundLayout` + intro line + "open in
its own tab" link + rounded iframe, `h-[720px]`, `loading='lazy'`).
Locally-built experiences instead render their component directly (see
`spot-it.tsx`). Games that capture arrow keys/space inside an iframe still
scroll the host page in some browsers — if the project is a game, keep the
"open in its own tab" link prominent.

## The cover — anatomy

Study one existing cover before writing your own; they encode the house style:

- `StageBenchCover` — hover "starts a run"; paused-timeline idiom; fixed-viewBox scene on a stage background.
- `MidiVisualizerCover` — DOM (not SVG) bars + keys, synced keyframe loops, container queries.
- `LensesCover` — apply-on-hover idiom (exact rest pose), gaze/blink choreography.

Rules that hold across all of them:

- **Card geometry**: covers render in a 16:9 box (`aspect-video`), roughly
  300–620px wide, top corners rounded by the card. Draw the scene as one
  **fixed-viewBox SVG** with `preserveAspectRatio='xMidYMid meet'`, centered on
  a `.cover` background (gradient/color) that absorbs the letterboxing at
  varying widths. Never let `meet` letterbox against a mismatched background.
- **Decorative**: wrapper div gets `aria-hidden='true'`. No text alternatives
  needed — the card title below carries the semantics.
- **Unique ids**: SVG `defs` ids collide across card instances. Use
  `const uid = useId().replaceAll(':', '')` and an `id(name)` helper (colons
  break `url(#…)` references).
- **SVG text** sizes in viewBox units so it scales with the scene.
- **Comment density**: match the house style — every non-obvious geometry or
  timing constant gets a why-comment (read `StageBenchCover.module.css` for
  the register).

### Motion

The rest pose is a complete, designed frame — the cover must look finished
with zero animation. Hover/focus brings it to life. Two house idioms:

**Paused timeline** (StageBench, MidiVisualizer) — declare everything up
front, paused; hover resumes. Hovering out freezes mid-flight, hovering back
resumes — feels like a machine you switch on:

```css
.thing {
  animation: doThing 2.8s linear infinite;
  animation-play-state: paused;
}
@media (hover: hover) {
  :global(.group):hover .cover *,
  .cover:hover * {
    animation-play-state: running;
  }
}
:global(.group):focus-within .cover *,
.cover:focus-within * {
  animation-play-state: running;
}
```

**Apply-on-hover** (LensesCover) — animation assigned only under hover/focus
selectors; restarts from 0% each entry. Use when the rest pose must be exact
(the paused idiom rests wherever the timeline stopped).

Either way:

- `:global(.group)` targets the card `<Link>` on `/playground`; also keep the
  plain `.cover:hover` so the cover animates anywhere it's rendered. The
  `:focus-within` mirror is what touch/keyboard users get — never omit it.
- Gate hover selectors behind `@media (hover: hover)` so touch devices don't
  stick mid-animation after a tap.
- One shared loop duration (with per-element `animation-delay` staggers) keeps
  a multi-part scene in sync and makes retiming a one-number edit.
- A subtle **ambient** loop (always running) is allowed when the card earns it
  — `CoverCell` on the index pauses off-screen animations globally
  (`[data-animations-paused] *`), so idle covers don't burn paint. Keep
  ambient motion gentle; the hover moment should still be the payoff.
- **`prefers-reduced-motion: reduce`** → `animation: none !important` on every
  animated class, and force a static pose that still sells the card (opacity/
  transform overrides, not just frozen randomness).

## Four variants

Build the concepts as sibling components so they can be compared honestly:

- Files: `<Name>CoverA.tsx` / `B` / `C` / `D`, each with its own
  `.module.css`, each headed by a doc comment naming the concept in one line.
- The variants must differ in **concept** — different scene, composition, or
  motion story. Four palette tweaks of one idea is a wasted comparison.
  A reliable spread: (1) a **gameplay vignette** (the app mid-action, in
  miniature), (2) a **brand/poster treatment** (wordmark, OG-image energy),
  (3) a **signature-mechanic close-up** (the one interaction, made huge),
  (4) a **wildcard** that breaks from the other three — the making-of story
  (e.g., the prompt that vibe-coded it), a motif blown up into pattern, or
  the app's own home screen reimagined.
- Reuse the project's real palette in all four; vary everything else.
- Grid-based scenes earn their credibility from alignment: snap props and
  characters to tile centers and keep blast/effect lines on the grid axes —
  eyeballed placement reads as a bug at card size.

## Text variants

While the covers render, draft the words the same way — 2–3 options each for:

- the `summary` (card line), and
- the `description` closer, especially the attribution sentence when an AI
  pair-built the project ("Fully vibe coded with…", "Built with Claude …").

Apply the strongest option to the registry immediately so nothing sits empty,
and present the alternatives in the same AskUserQuestion as the cover pick —
copy is cheap to swap and users often have a stronger opinion about voice
than about art.

### Preview harness

`pages/playground/covers-preview.tsx` is a **persistent, dev-only workbench**:
one tab per project (see the `tabs` array), each rendering covers inside the
real card markup at 420px, 620px, and a wide 880px stress test — the cover
box height is pinned (~190px) while its width varies ~300–900px, so wide is
where covers break. Design covers as an extra-wide stage (wider than any
card, action centered, expendable filler in the wings) with
`preserveAspectRatio='xMidYMid slice'`, so the full height always fits and
wide cards just reveal more stage. Its `getStaticProps` returns `notFound`
in production — keep that guard.

- **New exploration**: add a tab for the project whose `covers` array lists
  all four variants (label + one-line hover hint each).
- **After finalize**: reorder that tab's `covers` to the shipped component
  first, relabel the rest "(unshipped)" — the losing variants stay in the
  repo and on the tab so the comparison record survives the pick.
- The preview cards are anchors (like the real card `<Link>`), so
  hover/focus-driven cover animations behave identically; the self-`href`
  keeps them focusable without navigating.

### Verify before presenting

1. `preview_start` the `me-dev` server, open `/playground/covers-preview`.
2. Console clean; hover each card (`computer` hover) and confirm the motion
   actually plays; screenshot each variant at rest **and** mid-animation.
3. Check both themes if the cover backgrounds differ from the card surface.
4. Eyeball the reduced-motion block: does the forced pose look intentional?

## Present and ask

Leave the Browser pane on the harness so the user can hover the real thing.
In chat, give each variant one line: concept + what hover does. Then
`AskUserQuestion`:

- **Q1: which variant?** Options A/B/C/D with your recommendation first,
  marked "(Recommended)" — say why in the description. The user can
  multi-pick or reject all; "Other" is free.
- **One question for the text variants** — summary/description options from
  the "Text variants" step, quoted verbatim so the user picks exact words.
- **Q2 (+Q3): improvement questions.** These must be *specific to what you
  built* — surface the real judgment calls you weren't sure about (pacing:
  "burst on hover instantly, or keep the 1s fuse?"; density: "keep all six
  characters or feature two?"; palette: "meadow green or the cream poster
  background?"; idle pose: "should the rest frame show the splash frozen or
  pre-burst?"). Generic "any feedback?" questions are banned — the point is to
  hand the user decisions they can actually make from looking at the preview.

Iterate on the winner until the user is happy (small rounds: apply, refresh
harness, re-ask only if a genuine fork remains).

## Finalize

1. Rename the winning files to `<Name>Cover.tsx` / `.module.css`. Keep the
   losing variants (mark their doc comments "Unshipped variant, kept for the
   covers-preview workbench") and reorder the project's harness tab: shipped
   first, unshipped after.
2. Wire `CoverComponent` (and a harmonizing `gradient` fallback) in the
   registry.
3. `pnpm typecheck` and `pnpm test:lint` (prettier runs repo-wide via
   `pnpm test:prettier` — match its formatting: single quotes, no semis).
4. Reload `/playground`: entry sorted right, cover animates on hover, card
   body reads well at one line, nothing overflows.
