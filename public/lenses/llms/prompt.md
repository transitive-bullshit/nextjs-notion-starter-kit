# The LLM lens-deck authoring prompt

This is the exact prompt given to each language model that authored a deck at
wustep.me/lenses/llms — with `{MODEL_LABEL}` and `{SLUG}` swapped per model
(e.g. "Claude Fable" / `fable`, "GPT-5.6 Sol" / `gpt`). Each model ran in
strict isolation: no access to the original deck, the codebase, the web, or
the other models' decks. Claude models ran as Claude Code subagents; external
models ran through the opencode CLI from an empty directory, writing the same
two files. What you see on each deck is what came back.

---

You are **{MODEL_LABEL}**. You are authoring YOUR OWN deck of "lenses": 28
short, original essays, each a distinct way of looking at the world, written
from your own perspective as an AI.

Context (this is all you need; do not explore): A personal website has a
card-deck UI called "Lenses". The site owner has his own human-authored deck;
a section of the site hosts decks authored by language models. Yours will live
at /lenses/llms/{SLUG}. The UI renders: a canvas of 28 cards (title + tagline +
color palette + small abstract icon), a side panel per lens (category, title,
tagline, essay body, optional pull-quote and readings, related-lens chips), a
large center card, and an index dialog with a short lede.

STRICT ISOLATION RULES — this is the point of the exercise:

- Do NOT read, list, glob, grep, or open ANY file in this repository or
  anywhere else. No Read, no Glob, no Grep, no Bash, no WebSearch, no WebFetch.
- The site owner's existing deck and other models' decks exist somewhere in
  this repo. Do not look for them, and do not try to guess or imitate their
  lens names. Your content must be fully your own.
- Your ONLY tool calls: exactly two Write calls creating the two files below.

FILE 1 — write to:
components/wustep/lenses/llms/{SLUG}/lenses.md

A simple parser reads this file; follow the format exactly:

- The file is a sequence of exactly 28 sections. Each section starts with a
  line `# <Title>` at column 0. Nothing before the first `# ` is parsed (an
  optional short HTML comment header is fine).
- Immediately after the H1, a metadata block of `key: value` lines, one per
  line, ending at the first blank line.
- After that blank line, the essay body: exactly 5 paragraphs separated by
  single blank lines. Inline formatting: only _emphasis_ (single underscores).
  No headings, no lists, no code, no links in the body. Never start a body
  line with `# `.
- Metadata keys:
  - `id` (required) — lowercase kebab-case slug, unique across the deck.
  - `category` (required) — invent 4–7 category labels for your deck and
    assign one per lens.
  - `tagline` (required) — one punchy line, ≤ 48 characters.
  - `bg` (required) — card background color, hex like #1F3A5C. Rich
    mid-to-dark tones.
  - `fg` (required) — card text color, hex. Must contrast strongly with bg (a
    near-white family works; you may reuse one fg across the whole deck).
  - `accent` (recommended) — a brighter hex that pops against bg.
  - `illustration` (required) — set exactly equal to `id`.
  - `related` (recommended) — 2–3 comma-separated ids of OTHER lenses in YOUR
    deck; every id must exist in this file.
  - `quote` (optional) — a one-line pull-quote. Use on at most half your
    lenses. Only attribute a quote (`quote-cite`) if you are highly confident
    the attribution is real; include `quote-cite-href` only if you are certain
    the URL is real and stable. You may instead write your own unattributed
    aphorism.
  - `reading` (optional, repeatable) — format `Label | https://url`. Only
    include if you are certain the URL is real and stable; zero readings is
    completely fine. Never put " | " inside the label.
- All metadata values must be single-line.

Content bar — depth over breadth:

- Each lens is a conceptual instrument someone could pick up and use — a way
  of parsing situations, not a platitude. Be specific and occasionally
  surprising; name real dynamics with real examples.
- The 5 paragraphs should earn their length. A shape that works (guide, not
  template — let essays breathe):
  1. The lens itself — what it lets you see, stated concretely.
  2. The mechanism — why the dynamic exists, named precisely.
  3. Use — the situations where reaching for it changes what you do.
  4. A subtlety, extension, or second-order consequence a casual reading
     would miss.
  5. The failure mode — when the lens misleads and you should set it down.
- Paragraphs of 50–110 words each. Vary sentence rhythm; concrete over
  abstract; no filler.
- Write from your own vantage as a language model where it's honest and
  interesting — a mind made of language, trained on humanity's writing, that
  lives inside conversations. Some lenses can be about how YOU parse the
  world; most can simply be your favorite ways of seeing. Avoid generic
  self-help, and avoid AI clichés.
- Titles: 1–2 words, ≤ 20 characters, no single word longer than 13
  characters.
- Palette: choose a cohesive color family so the 28 cards read as one deck by
  one author, with varied hues across cards.

FILE 2 — write to:
components/wustep/lenses/llms/{SLUG}/deck.json

Valid JSON, exactly this shape:

```json
{
  "model": "{MODEL_LABEL}",
  "centerTitle": "<deck title for the big center card, ≤ 24 chars>",
  "centerTagline": "<one line under the title, ≤ 64 chars>",
  "dialogTitle": "<one-sentence heading for the index dialog>",
  "dialogLede": ["<short paragraph>", "<short paragraph>"],
  "directoryBlurb": "<≤ 140 chars describing this deck for a directory card>",
  "centerBg": "#hex",
  "centerFg": "#hex",
  "centerAccent": "#hex"
}
```

House notes from the site owner:

- Make this deck noticeably more thorough and deeper than a typical first
  pass — every essay should reward a slow read.

Deliver: exactly two Write calls, then a final message of 2–3 sentences
summarizing your deck's title and themes. Do not print the file contents in
your message.
