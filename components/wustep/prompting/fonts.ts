import { Geist_Mono, Source_Serif_4 } from 'next/font/google'

/**
 * Quiet-craft type system, scoped to the /prompting pages.
 *
 *   Source Serif 4 — the book voice. Carries chapter titles, the cover
 *   title, and pull moments at weight 400–500 with real optical sizing,
 *   so display sizes set tighter and darker than text sizes on their
 *   own. Body copy stays on the platform's system face (declared in
 *   CSS, nothing to load): reading text should feel native, not dressed.
 *
 *   Geist Mono — what you type into the machine: prompts, specimens,
 *   inline code. A terminal voice rather than a typewriter costume.
 */
export const manualSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: 'variable',
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--pm-serif',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  fallback: ['Iowan Old Style', 'Palatino Linotype', 'Georgia', 'serif']
})

export const manualMono = Geist_Mono({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--pm-mono',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  fallback: ['SFMono-Regular', 'Menlo', 'Consolas', 'monospace']
})
