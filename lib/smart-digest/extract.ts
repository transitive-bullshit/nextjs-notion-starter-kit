import type {
  DigestConfig,
  Entity,
  ExtractedData,
  FetchedReport
} from './types.js'
import { chatCompletion } from './llm.js'

const EXTRACT_PROMPT = `Analyze the following AI/ML news report and extract structured entities.

For each notable item, extract:
- name: the tool/model/company/framework name
- type: one of "tool", "model", "company", "framework", "concept", "other"
- significance: a brief description of what happened
- isBreaking: true if this is a major release, breaking change, or paradigm shift

Return ONLY a valid JSON array of entities. No markdown fencing, no explanation.

Example:
[{"name":"Claude 4","type":"model","significance":"Anthropic released Claude 4 with 2x context window","isBreaking":true}]`

function validateEntities(data: unknown): Entity[] {
  if (!Array.isArray(data)) return []
  return data.filter(
    (item): item is Entity =>
      item !== null &&
      typeof item === 'object' &&
      'name' in item &&
      typeof (item as Record<string, unknown>).name === 'string' &&
      'type' in item &&
      typeof (item as Record<string, unknown>).type === 'string' &&
      'significance' in item &&
      typeof (item as Record<string, unknown>).significance === 'string' &&
      'isBreaking' in item &&
      typeof (item as Record<string, unknown>).isBreaking === 'boolean'
  )
}

export async function extractEntities(
  config: DigestConfig,
  reports: FetchedReport[]
): Promise<ExtractedData[]> {
  console.log(
    `🔍 Extracting entities from ${reports.length} reports in parallel...`
  )

  const settled = await Promise.allSettled(
    reports.map(async (report): Promise<ExtractedData> => {
      const truncated = report.content.slice(0, 30_000)
      const response = await chatCompletion(
        config,
        [
          { role: 'system', content: EXTRACT_PROMPT },
          { role: 'user', content: truncated }
        ],
        { temperature: 0.3, maxTokens: 8192 }
      )

      const cleaned = response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
      let raw: unknown
      try {
        raw = JSON.parse(cleaned)
      } catch {
        console.warn(
          `  ⚠ ${report.name}: truncated/invalid JSON from LLM, skipping`
        )
        return { entities: [], report }
      }
      const entities = validateEntities(raw)
      console.log(`  ✓ ${report.name}: ${entities.length} entities`)
      return { entities, report }
    })
  )

  const results: ExtractedData[] = []
  for (let i = 0; i < settled.length; i++) {
    const result = settled[i]!
    const report = reports[i]!
    if (result.status === 'fulfilled') {
      results.push(result.value)
    } else {
      const message =
        result.reason instanceof Error
          ? result.reason.message
          : String(result.reason)
      const isLLMOffline =
        message.includes('LLM offline') ||
        message.includes('LLM API error 5') ||
        message.includes('LLM API error 429')

      if (isLLMOffline) {
        console.warn(`  ⚠ LLM unavailable for ${report.name}, skipped`)
      } else {
        console.warn(`  ⚠ ${report.name}: ${message}`)
      }
      results.push({ entities: [], report })
    }
  }

  return results
}
