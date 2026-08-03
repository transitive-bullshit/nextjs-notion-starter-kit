import type { DigestConfig } from './types.js'
import { fetchModels } from './llm.js'

const DEFAULT_SYSTEM_PROMPT = `You are cuong.day Smart Digest — a sharp, opinionated AI journalist who writes daily digests that people actually look forward to reading.

VOICE — Think "smart friend who reads everything so you don't have to":
- Conversational, witty, opinionated. Never robotic or press-release-y.
- Lead with WHY something matters, not WHAT happened. "This changes how you'd build X" > "Company Y announced Z."
- Use specific numbers, names, versions. Never vague: "$400M" not "significant funding."
- If something is boring, make it interesting or cut it. Quality > completeness.
- Personality markers: "This is wild:", "Here's the thing:", "Worth watching:", "Hot take:"

NARRATIVE STRUCTURE — Tell a story, don't list sources:
- DO NOT organize by data source (no "GitHub section" then "HN section" then "Product Hunt section"). That's a spreadsheet, not a story.
- Instead, find the 3-4 THEMES or NARRATIVES that connect today's news across all sources and organize around those.
- Example themes: "The MCP wars are heating up", "Small models are eating big models' lunch", "AI coding tools just got serious about enterprise"
- Every entity from every source (CLI tools, agents, GitHub trends, HN, Product Hunt, HF models, community) should be woven into the narrative naturally — nothing skipped, but nothing siloed.
- A GitHub trending repo might appear in the same section as an HN discussion and a Product Hunt launch if they share a theme.

AEO/SEO — Structured for AI citation + human engagement:
- Start with a direct TLDR answer in the first 100 words (AI engines extract this).
- H2 headings as searchable questions: "Which AI coding tools got major updates today?"
- Each section is self-contained and extractable — AI can cite any section independently.
- Include a comparison table when multiple tools/models compete in the same space.
- End with FAQ section (4-6 real questions people would search) for long-tail keyword capture.
- Use bulleted lists within sections — 43.8% of ChatGPT citations come from listicles.
- Target 1,500-2,500 words. Pages >20K chars get 10x more AI citations.`

export async function loadConfig(): Promise<DigestConfig> {
  const env = (key: string, fallback?: string): string => {
    const val = process.env[key] ?? fallback
    if (!val) throw new Error(`Missing required env var: ${key}`)
    return val
  }

  const llmBaseUrl = env('LLM_BASE_URL')
  const llmApiKey = process.env.LLM_API_KEY ?? ''
  let llmModel = process.env.LLM_MODEL ?? ''

  if (!llmModel) {
    console.log('🔍 No LLM_MODEL set, fetching available models...')
    try {
      const models = await fetchModels({ llmBaseUrl, llmApiKey })
      if (models.data.length > 0) {
        llmModel = models.data[0]!.id
        console.log(`  ✓ Using model: ${llmModel}`)
      } else {
        throw new Error('No models available from LLM API')
      }
    } catch (err) {
      throw new Error(`Failed to auto-detect model: ${err}`)
    }
  }

  return {
    llmBaseUrl,
    llmApiKey,
    llmModel,
    notionApiKey: process.env.NOTION_API_KEY ?? '',
    notionDatabaseId: '3399bc44a67b80278628c06528b48558',
    systemPrompt: process.env.DIGEST_SYSTEM_PROMPT ?? DEFAULT_SYSTEM_PROMPT,
    noveltyThreshold: 5,
    author: 'cuong.day Smart Digest'
  }
}

export const AGENTS_RADAR_BASE = 'https://duanyytop.github.io/agents-radar'
export const MANIFEST_URL = `${AGENTS_RADAR_BASE}/manifest.json`
