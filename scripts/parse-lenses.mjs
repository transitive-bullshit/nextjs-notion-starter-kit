/**
 * parse-lenses.mjs — pure parser for lenses.md → records.
 *
 *   Extracted from sync-lenses.mjs so it can be unit-tested without file or
 *   process side effects. See the comment at the top of lenses.md for the
 *   format. Zero dependencies on purpose.
 */

export const REQUIRED = [
  'id',
  'category',
  'title',
  'tagline',
  'bg',
  'fg',
  'illustration',
  'body'
]

/**
 * Parse the raw lenses.md contents into `{ records, errors }`.
 * `records` is always in a stable key order; `errors` lists every problem
 * (missing required field, malformed reading, duplicate id).
 */
export function parseLenses(raw) {
  // Each lens is a section opened by an H1. Everything before the first
  // H1 (the doc-comment header) is dropped.
  const sections = raw.split(/^# /m).slice(1)

  const records = []
  const errors = []

  for (const section of sections) {
    const lines = section.split('\n')
    const title = lines[0].trim()

    // Skip blank lines between the H1 and the metadata block.
    let i = 1
    while (i < lines.length && lines[i].trim() === '') i++

    // Metadata runs until the first blank line.
    const meta = {}
    const readings = []
    for (; i < lines.length; i++) {
      const line = lines[i]
      if (line.trim() === '') break
      const ci = line.indexOf(':')
      if (ci === -1) continue
      const key = line.slice(0, ci).trim()
      const value = line.slice(ci + 1).trim()
      if (key === 'reading') {
        const sep = value.lastIndexOf(' | ')
        if (sep === -1) {
          errors.push(
            `${title}: reading must be "Label | https://url" → "${value}"`
          )
          continue
        }
        readings.push({
          label: value.slice(0, sep).trim(),
          href: value.slice(sep + 3).trim()
        })
      } else {
        meta[key] = value
      }
    }

    const body = lines
      .slice(i + 1)
      .join('\n')
      .trim()

    // Assemble in a stable key order.
    const rec = {
      id: meta.id,
      category: meta.category,
      title,
      tagline: meta.tagline,
      bg: meta.bg,
      fg: meta.fg
    }
    if (meta.accent) rec.accent = meta.accent
    rec.illustration = meta.illustration
    if (meta.related) {
      rec.related = meta.related
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    }
    if (readings.length) rec.readings = readings
    if (meta.quote) {
      rec.quote = { text: meta.quote }
      if (meta['quote-cite']) rec.quote.cite = meta['quote-cite']
      if (meta['quote-cite-href']) rec.quote.citeHref = meta['quote-cite-href']
    }
    rec.body = body

    for (const key of REQUIRED) {
      if (!rec[key]) errors.push(`${title || '(untitled)'}: missing "${key}"`)
    }
    records.push(rec)
  }

  // Duplicate-id guard.
  const seen = new Set()
  for (const r of records) {
    if (r.id && seen.has(r.id)) errors.push(`duplicate id "${r.id}"`)
    seen.add(r.id)
  }

  return { records, errors }
}
