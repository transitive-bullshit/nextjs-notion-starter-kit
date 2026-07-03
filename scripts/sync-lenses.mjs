/**
 * sync-lenses.mjs — compile lenses.md → lenses.json
 *
 *   `lenses.md` is the human source of truth (see the comment at the
 *   top of that file for the format). This script parses it into the
 *   plain-data `lenses.json` that `registry.tsx` imports.
 *
 *   Parsing lives in parse-lenses.mjs (pure + unit-tested); this file is
 *   just the file I/O + error reporting around it.
 *
 *   Run: pnpm lenses:sync   (or: node scripts/sync-lenses.mjs)
 */
import fs from 'node:fs'
import path from 'node:path'

import { parseLenses } from './parse-lenses.mjs'

const root = process.cwd()
const LENS_DIR = path.join(root, 'components/wustep/lenses')
const mdPath = path.join(LENS_DIR, 'lenses.md')
const jsonPath = path.join(LENS_DIR, 'lenses.json')

const raw = fs.readFileSync(mdPath, 'utf8')
const { records, errors } = parseLenses(raw)

if (errors.length) {
  console.error(`lenses:sync failed with ${errors.length} error(s):`)
  for (const e of errors) console.error(`  • ${e}`)
  process.exit(1)
}

fs.writeFileSync(jsonPath, JSON.stringify(records, null, 2) + '\n')
console.log(
  `Synced ${records.length} lenses → ${path.relative(root, jsonPath)}`
)
