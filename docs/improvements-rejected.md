# Rejected improvement ideas

<!-- Consulted AFTER fresh generation so it can't bias new ideas. Don't re-propose these. -->

- **Extract shared page-ID resolution logic** — dedupe resolution ordering across resolve-notion-page.ts and [pageId].tsx _(rejected 2026-07-02)_
- **Audit lens card text contrast against WCAG AA** — nudge failing card fg/bg colors to hit 4.5:1 for small text _(rejected 2026-07-02)_
- **Make the "play animations" button reachable on touch devices** — persistently show the hover-revealed replay button on (hover: none) _(rejected 2026-07-02)_
- **Add a loading/skeleton state for the Lenses canvas entrance** — placeholder grid behind the fade for slow networks _(rejected 2026-07-02)_
- **Give animated illustrations a clean resting frame under reduced-motion** — snap paused animations to a deliberate keyframe _(rejected 2026-07-02)_
- **Give the keyboard cursor its own state, distinct from selection** — distinct .cardCursor treatment + aria-current + adaptive selection ring on the Lenses canvas _(rejected 2026-07-03)_
- **Honor prefers-reduced-motion in the Prompting demos** — gate TreeDemo tour + ColleagueDemo transitions on reduced motion _(rejected 2026-07-03)_
- **Add a chapter-position indicator to the Prompting guide** — "Chapter N of M" / progress rule in the running head _(rejected 2026-07-03)_
- **Confirm the keyboard-scroll target landed** — pulse the target card outline after scrollIntoView and center-inline on mobile _(rejected 2026-07-03)_
- **Add a "copy link" affordance to the lens panel** — copy /lenses/<id> button with confirmation toast in panel controls _(rejected 2026-07-03)_
