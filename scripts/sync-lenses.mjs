/**
 * sync-lenses.mjs — compile each deck's lenses.md → lenses.json
 *
 *   Every deck directory holds a human-authored `lenses.md` (see the
 *   comment at the top of the original for the format) that compiles to
 *   the plain-data `lenses.json` its registry imports. The original
 *   deck lives in components/wustep/lenses; the model-authored decks live in
 *   subdirectories under lenses/llms.
 *
 *   Parsing lives in parse-lenses.mjs (pure + unit-tested); this file is
 *   the file I/O, cross-record validation, and error reporting around it.
 *
 *   Run: pnpm lenses:sync   (or: node scripts/sync-lenses.mjs)
 */
import fs from 'node:fs'
import path from 'node:path'

import { parseLenses } from './parse-lenses.mjs'

const root = process.cwd()
const LENS_DIR = 'components/wustep/lenses'

/** Deck directories, relative to the repo root: the original deck plus
 *  every model deck under lenses/llms/<slug>/. Discovered rather than
 *  hardcoded so adding a deck (see the llm-lens-deck skill) never
 *  requires editing this script. A missing lenses.md is skipped (a deck
 *  not authored yet), never an error. */
const llmsRoot = path.join(root, LENS_DIR, 'llms')
const DECK_DIRS = [
  LENS_DIR,
  ...(fs.existsSync(llmsRoot)
    ? fs
        .readdirSync(llmsRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => `${LENS_DIR}/llms/${entry.name}`)
        .toSorted()
    : [])
]

/** The canvas grid has exactly 28 non-center slots (8×4 minus the 2×2
 *  center card), so every deck must hold exactly 28 lenses. */
const DECK_SIZE = 28

const HEX = /^#[0-9a-fA-F]{6}$/

/** Whole-deck checks the per-record parser can't see. */
function validateDeck(records) {
  const errors = []
  if (records.length !== DECK_SIZE) {
    errors.push(
      `deck has ${records.length} lenses; the canvas needs exactly ${DECK_SIZE}`
    )
  }
  const ids = new Set(records.map((r) => r.id))
  const titles = new Set()
  for (const r of records) {
    if (titles.has(r.title)) errors.push(`duplicate title "${r.title}"`)
    titles.add(r.title)
    for (const [key, value] of [
      ['bg', r.bg],
      ['fg', r.fg],
      ['accent', r.accent]
    ]) {
      if (value && !HEX.test(value)) {
        errors.push(`${r.title}: ${key} "${value}" is not a #rrggbb hex color`)
      }
    }
    for (const rel of r.related ?? []) {
      if (!ids.has(rel)) {
        errors.push(`${r.title}: related id "${rel}" does not exist`)
      }
    }
  }
  return errors
}

let failed = false
let synced = 0

for (const dir of DECK_DIRS) {
  const mdPath = path.join(root, dir, 'lenses.md')
  if (!fs.existsSync(mdPath)) continue

  const raw = fs.readFileSync(mdPath, 'utf8')
  const { records, errors } = parseLenses(raw)
  errors.push(...validateDeck(records))

  if (errors.length) {
    failed = true
    console.error(`lenses:sync ${dir} failed with ${errors.length} error(s):`)
    for (const e of errors) console.error(`  • ${e}`)
    continue
  }

  const jsonPath = path.join(root, dir, 'lenses.json')
  fs.writeFileSync(jsonPath, JSON.stringify(records, null, 2) + '\n')
  console.log(`Synced ${records.length} lenses → ${dir}/lenses.json`)
  synced++
}

if (failed) process.exit(1)
if (synced === 0) {
  console.error('lenses:sync found no lenses.md in any deck directory')
  process.exit(1)
}
