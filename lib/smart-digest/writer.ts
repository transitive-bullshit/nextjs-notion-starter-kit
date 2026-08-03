import type { DigestConfig, DigestPost, ScoredEntity } from './types.js'
import { chatCompletion } from './llm.js'

const WRITER_PROMPT = `Output a JSON object with this exact structure:
{
  "title": "punchy title, max 60 chars, reference the #1 story or theme",
  "description": "1-2 sentence meta description, max 155 chars, searchable",
  "tags": ["ai","digest","tag3","tag4","tag5"],
  "blocks": [ ...array of content blocks... ]
}

BLOCK TYPES (use SHORT keys to save tokens):

{"t":"h2","text":"Heading","color":"blue","toggle":true}
{"t":"h3","text":"Subheading"}
{"t":"callout","emoji":"🔥","color":"red_background","text":"**Bold** and text"}
  Colors: blue_background, yellow_background, red_background, green_background, purple_background, gray_background, orange_background
{"t":"p","text":"Paragraph with **bold** and *italic*"}
{"t":"quote","text":"Editorial quote"}
{"t":"bullet","items":["Item 1","**Bold item** detail","Item 3"]}
{"t":"numbered","items":["Step 1","Step 2"]}
{"t":"table","headers":["Col1","Col2"],"rows":[["a","b"]]}
{"t":"bookmark","url":"https://...","caption":"Caption"}
{"t":"divider"}
{"t":"todo","items":[{"text":"Watch this","checked":false}]}
{"t":"code","text":"code","language":"bash"}

HOW TO STRUCTURE THE DIGEST — narrative, not spreadsheet:

1. HOOK — Start with a TLDR callout + context paragraph:
   {"t":"callout","emoji":"⚡","color":"yellow_background","text":"**TLDR**: [2-3 sentences. What's the ONE big story? What pattern connects today's news?]"}
   {"t":"p","text":"[3-4 sentences setting the scene. Connect the dots across sources. Why should a developer care about today specifically?]"}

2. BIG STORY — The #1 story gets its own section with depth:
   {"t":"h2","text":"[Compelling question about the biggest story]"}
   Use paragraphs, callouts, and bullets to tell the full story. 200-400 words.
   This is where you go deep — context, implications, what to watch.

3. THEME SECTIONS (2-3 sections) — Group the remaining entities by THEME, not by source:
   DO NOT create a "GitHub Trends" section, a "Product Hunt" section, an "HN" section, etc.
   INSTEAD, find what connects items across sources and group them:
   
   Example: If Claude Code shipped an update (from CLI source), a GitHub repo for MCP tools is trending, and HN is debating agent protocols — that's ONE section: "The Agent Tooling Stack Is Evolving Fast"
   
   Example: If 3 new small models dropped on HuggingFace, a Product Hunt launch focuses on local inference, and a GitHub repo for model optimization is trending — that's ONE section: "Small Models, Big Impact"
   
   Each theme section:
   {"t":"h2","text":"[Searchable question as heading]","toggle":true}
   Mix callouts (for key items), bullets (for quick lists), and paragraphs (for context).
   Weave in items from multiple sources naturally.

4. QUICK BITES — Remaining items that don't fit a theme get a rapid-fire section:
   {"t":"h2","text":"⚡ Quick Bites"}
   {"t":"bullet","items":["**[Name]** — [one-liner]. [why it matters].", ...]}
   This catches everything else so nothing is skipped.

5. COMPARISON TABLE — When multiple tools/models compete:
   {"t":"h2","text":"📊 [Descriptive table title]"}
   {"t":"table","headers":["Tool","What's New","Why It Matters"],"rows":[...]}

6. DIVIDER:
   {"t":"divider"}

7. FAQ — 4-6 real questions someone would type into ChatGPT:
   {"t":"h2","text":"❓ FAQ: Today's AI News Explained"}
   {"t":"bullet","items":[
     "**Q: [Real searchable question]?** — [Direct 2-3 sentence answer with specific facts.]",
     ...
   ]}

8. EDITORIAL CLOSE:
   {"t":"quote","text":"🔮 **Editor's Take**: [2-3 sentence provocative opinion. Take a stance. Be memorable.]"}

CONTENT RULES:
- EVERY entity from the input must appear somewhere — nothing skipped. But don't silo by source.
- Target 1,500-2,000 words. Be thorough but never padded. Every sentence earns its place.
- Each callout: 2-4 sentences. Lead with the key fact, then "why it matters."
- Use **markdown bold** (double asterisks), NOT HTML tags like <b>. Use *italic* (single asterisks), NOT <i>.
- Use regular hyphens "-" for separators, NOT em-dashes "—" (they render incorrectly).
- Bold **names**, **numbers**, **versions** — not entire sentences.
- If entity appeared before in history, reference continuity naturally.
- Use varied emoji + colors to create visual rhythm. Don't make every callout blue.
- FAQ answers must directly answer the question — no hedging.

Return ONLY the JSON object. No markdown fencing, no explanation.`

export async function generatePost(
  config: DigestConfig,
  entities: ScoredEntity[],
  date: string
): Promise<DigestPost> {
  const entitySummary = entities
    .map(
      (e) =>
        `[${e.score}] ${e.name} (${e.type}): ${e.significance} — ${e.reason}`
    )
    .join('\n')

  const userContent = [
    `Date: ${date}`,
    '',
    'Entities:',
    entitySummary,
    '',
    WRITER_PROMPT
  ].join('\n')

  const response = await chatCompletion(
    config,
    [
      { role: 'system', content: config.systemPrompt },
      { role: 'user', content: userContent }
    ],
    {
      temperature: 0.3,
      maxTokens: 16384,
      jsonMode: true,
      disableThinking: true
    }
  )

  const cleaned = response
    .replace(/^```json\s*\n?/, '')
    .replace(/\n?```\s*$/, '')
    .trim()

  let parsed: {
    title?: string
    description?: string
    tags?: string[]
    blocks?: unknown[]
  }

  try {
    parsed = JSON.parse(cleaned) as typeof parsed
  } catch {
    console.warn('⚠ Failed to parse writer JSON, using fallback')
    parsed = {}
  }

  const title = parsed.title ?? `AI Digest — ${date}`
  const description = parsed.description ?? 'Daily AI/ML news digest'
  const tags = parsed.tags ?? ['ai', 'digest']
  const blocks = parsed.blocks ?? []

  return {
    title,
    slug: `daily-digest-${date}`,
    description,
    content: JSON.stringify(blocks),
    tags,
    date
  }
}
