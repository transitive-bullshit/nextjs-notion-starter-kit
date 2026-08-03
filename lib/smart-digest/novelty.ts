import type { Entity, ExtractedData, ScoredEntity } from './types.js'

/**
 * Deduplicate entities across all extractions by normalized name.
 * Prefers isBreaking entries over non-breaking ones.
 * Returns all unique entities scored as novel (score 9).
 */
export function deduplicateEntities(
  extractions: ExtractedData[]
): ScoredEntity[] {
  const allEntities = extractions.flatMap((e) => e.entities)

  const deduped = new Map<string, Entity>()
  for (const entity of allEntities) {
    const key = entity.name.toLowerCase().trim()
    const existing = deduped.get(key)
    if (!existing || (entity.isBreaking && !existing.isBreaking)) {
      deduped.set(key, entity)
    }
  }

  return [...deduped.values()]
    .map(
      (e): ScoredEntity => ({
        ...e,
        score: e.isBreaking ? 10 : 9,
        reason: e.isBreaking ? 'breaking change' : 'new entity'
      })
    )
    .sort((a, b) => b.score - a.score)
}
