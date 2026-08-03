import type { FetchedReport } from './types.js'
import { AGENTS_RADAR_BASE, MANIFEST_URL } from './config.js'

interface ManifestDateEntry {
  date: string
  reports: string[]
}

interface Manifest {
  dates: ManifestDateEntry[]
  generated: string
}

export async function fetchManifest(): Promise<Manifest> {
  const res = await fetch(MANIFEST_URL)
  if (!res.ok) {
    throw new Error(`Failed to fetch manifest: ${res.status}`)
  }
  return res.json() as Promise<Manifest>
}

export async function fetchReports(date?: string): Promise<FetchedReport[]> {
  const manifest = await fetchManifest()
  const sortedDates = manifest.dates.map((d) => d.date).sort()

  const targetDate = date ?? sortedDates.at(-1)!
  const entry = manifest.dates.find((d) => d.date === targetDate)

  if (!entry) {
    console.log(`No reports found for date: ${targetDate}`)
    return []
  }

  const englishReports = entry.reports.filter((name) => name.endsWith('-en'))

  console.log(
    `📡 Fetching ${englishReports.length} English reports for ${targetDate}...`
  )

  const reports: FetchedReport[] = []

  for (const name of englishReports) {
    const url = `${AGENTS_RADAR_BASE}/digests/${targetDate}/${name}.md`
    try {
      const res = await fetch(url)
      if (!res.ok) {
        console.warn(`  ⚠ Failed to fetch ${name}: ${res.status}`)
        continue
      }
      const content = await res.text()
      reports.push({ name, date: targetDate, content })
      console.log(`  ✓ ${name} (${(content.length / 1024).toFixed(1)}KB)`)
    } catch (err) {
      console.warn(`  ⚠ Error fetching ${name}:`, err)
    }
  }

  return reports
}
