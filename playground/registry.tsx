import type React from 'react'

// import { BombermanCover } from '@/components/wustep/BombermanCover'
import { BookshelfCover } from '@/components/wustep/BookshelfCover'
import { ContraptionsCover } from '@/components/wustep/ContraptionsCover'
import { DominoCover } from '@/components/wustep/DominoCover'
import { JammingCover } from '@/components/wustep/JammingCover'
import { LensesCover } from '@/components/wustep/LensesCover'
import { LensesIllustrationLabCover } from '@/components/wustep/LensesIllustrationLabCover'
import { MidiVisualizerCover } from '@/components/wustep/MidiVisualizerCover'
import { ShadcnPhysicsCover } from '@/components/wustep/ShadcnPhysicsCover'
import { SplashPanicCover } from '@/components/wustep/SplashPanicCover'
import { SpotItCover } from '@/components/wustep/SpotItCover'
import { StageBenchCover } from '@/components/wustep/StageBenchCover'
import { StarrySequencerCover } from '@/components/wustep/StarrySequencerCover'
import { ThingsCover } from '@/components/wustep/ThingsCover'
import { starRank } from '@/playground/starred'

export type PlaygroundEntry = {
  title: string
  url: string
  description: string
  summary?: string
  date?: string
  year?: string
  disabled?: boolean
  /** Hidden from Playground navigation unless owner mode is active. */
  ownerOnly?: boolean
  /**
   * Stars the entry and pins it to the top of its own sidebar section.
   * Set it with `starRank(title)`; the order lives in `playground/starred.ts`.
   */
  starred?: number
  article?: string
  source?: string
  /** Companion X post; linked like `article` from cards and the sidebar. */
  x?: string
  gradient?: string
  image?: string
  /**
   * 1200×630 PNG link-preview card (public/og/playground/). Without one, a
   * PNG/JPEG `image` is used, so that image should be 1200×630 too.
   */
  ogImage?: string
  /**
   * Animated cover for the /playground grid. An entry with neither this nor
   * `image` is coverless: it's listed in the sidebar only, not on the grid.
   */
  CoverComponent?: React.ComponentType
}

export type PlaygroundSection = {
  title: string
  items: PlaygroundEntry[]
}

export const playgroundSections: PlaygroundSection[] = [
  {
    title: 'Experiments',
    items: [
      {
        title: 'Jamming',
        url: '/playground/jamming',
        description: 'A band of doodled animals that improvise music together.',
        summary: 'Doodled animals improvising music together',
        date: 'Oct 2026',
        year: '2026',
        source: 'https://github.com/wustep/jamming',
        gradient: 'from-amber-50 via-orange-200 to-lime-300',
        CoverComponent: JammingCover
      },
      {
        title: 'Things',
        url: '/playground/things',
        description:
          'A shelf of the real things that I own, from furniture to daily carry',
        summary: 'A shelf of the real things I own',
        date: 'Oct 2026',
        year: '2026',
        source: 'https://github.com/wustep/things',
        gradient: 'from-stone-800 via-stone-950 to-stone-950',
        image: '/playground/covers/things.png',
        CoverComponent: ThingsCover
      },
      {
        title: 'Jev Playground',
        url: '/playground/jev',
        description:
          'Can a System One model steer music? Jev chooses only enums — character, form, key, chords — and the app writes the sheet, the sound, and the MIDI. Trolley problems, inbox triage, and match ranking sit in the other rooms.',
        summary: 'Jev picks the labels; code writes the notes',
        date: 'Sep 2026',
        year: '2026',
        source: 'https://github.com/wustep/jev-playground'
      },
      {
        title: 'Maths',
        url: '/playground/maths',
        description:
          'A public notebook where AI agents take runs at open math problems and log what they find.',
        summary: 'AI agents taking runs at open math problems',
        date: 'Aug 2026',
        year: '2026',
        source: 'https://github.com/wustep/maths'
      },
      {
        title: 'StageBench',
        starred: starRank('StageBench'),
        url: '/playground/stagebench',
        description:
          'A benchmark for evaluating models by having them generate a replica of the Nord Stage 4.',
        summary: 'Evaluating models through Nord Stage 4 replicas',
        date: 'Jun 2026',
        year: '2026',
        source: 'https://stagebench.vercel.app/',
        x: 'https://x.com/wustep/status/2074529375043858480',
        gradient: 'from-red-600 via-red-950 to-zinc-950',
        ogImage: '/og/playground/stagebench.png',
        CoverComponent: StageBenchCover
      },
      {
        title: 'Lenses',
        starred: starRank('Lenses'),
        url: '/playground/lenses',
        description:
          'A canvas of lenses for seeing the world. Each card is a different frame — headspace, evolutionary psychology, minimalism, utility, status — and no single one sees everything.',
        summary: 'A canvas of frames for seeing the world',
        date: 'May 2026',
        year: '2026',
        gradient: 'from-purple-500 via-fuchsia-500 to-rose-500',
        ogImage: '/og/playground/lenses.png',
        CoverComponent: LensesCover
      },
      {
        title: 'Lenses Illustration Lab',
        url: '/playground/lenses-illustrations',
        description:
          'A visual workbench for testing Lenses SVG illustrations against production, controlled, and randomized card color palettes.',
        summary: 'Testing ground for lenses illustrations and palettes',
        date: 'May 2026',
        year: '2026',
        gradient: 'from-stone-800 via-amber-700 to-rose-700',
        ogImage: '/og/playground/lenses-illustrations.png',
        CoverComponent: LensesIllustrationLabCover
      },
      {
        title: 'DOM-ino',
        url: '/playground/dom-ino',
        description:
          'A physics-driven text layout experiment. Grab any element on the page and throw it through the text — paragraphs reflow around moving obstacles in real time.',
        summary: 'Throw elements through text with real-time paragraph reflow',
        date: 'Apr 2026',
        year: '2026',
        source: 'https://github.com/wustep/dom-ino',
        image: '/playground/covers/dom-ino.svg',
        ogImage: '/og/playground/dom-ino.png',
        CoverComponent: DominoCover
      },
      {
        title: 'Bookshelf',
        url: '/playground/bookshelf',
        description: 'An interactive bookshelf of some of my favorite books.',
        summary: 'An interactive bookshelf of my favorite books',
        date: 'Dec 2025',
        year: '2025',
        source: 'https://github.com/wustep/bookshelf',
        image: '/playground/covers/bookshelf.svg',
        ogImage: '/og/playground/bookshelf.png',
        CoverComponent: BookshelfCover
      },
      {
        title: 'Shadcn + Physics',
        url: '/playground/shadcn-physics',
        description: 'An iframe-powered physics sandbox built with shadcn UI.',
        summary:
          'Throw, stack, and collide shadcn/ui components with Matter.js',
        date: 'May 2025',
        year: '2025',
        source:
          'https://github.com/wustep/shadbook/blob/main/src/app/pages/experiments/physics-playground.tsx',
        image: '/playground/covers/shadcn-physics.png',
        ogImage: '/og/playground/shadcn-physics.png',
        CoverComponent: ShadcnPhysicsCover
      }
    ]
  },
  {
    title: 'Games',
    items: [
      {
        title: 'Splash Panic!',
        starred: starRank('Splash Panic!'),
        url: '/playground/splashpanic',
        description:
          'A multiplayer water-balloon battle arena game inspired by Crazy Arcade and Bomberman.',
        summary: 'Multiplayer water-balloon chaos with bubble traps & rescues',
        date: 'Jul 2026',
        year: '2026',
        source: 'https://github.com/wustep/splashpanic',
        gradient: 'from-teal-300 via-sky-400 to-blue-500',
        ogImage: '/og/playground/splashpanic.png',
        CoverComponent: SplashPanicCover
      },
      {
        title: 'Spot it!',
        url: '/playground/spot-it',
        description:
          'An exploration of Spot it!, the symbols matching game and its mathematical properties.',
        summary: 'Explore the symbol matching card game and its mechanics',
        date: 'Dec 2025',
        year: '2025',
        article: '/spot-it',
        source: 'https://github.com/wustep/spot-it',
        gradient: 'from-amber-400 to-pink-500',
        image: '/playground/covers/spot-it.png',
        ogImage: '/og/playground/spot-it.png',
        CoverComponent: SpotItCover
      }
      // Hidden from playground for now
      // {
      //   title: 'Bomberman',
      //   url: '/playground/bomberman',
      //   description:
      //     'Two-player Bomberman clone with emojis. Fully vibe coded with Cursor & Claude 3.5 Sonnet.',
      //   summary: 'Two-player Bomberman clone with pets & power-ups',
      //   date: 'Nov 2024',
      //   year: '2024',
      //   article: '/bomberman',
      //   source: 'https://github.com/wustep/bomberman',
      //   gradient: 'from-orange-500 to-rose-500',
      //   image: '/playground/covers/bomberman.png',
      //   ogImage: '/og/playground/bomberman.png',
      //   CoverComponent: BombermanCover
      // }
    ]
  },
  {
    title: 'Visualizations',
    items: [
      {
        title: 'Contraptions',
        starred: starRank('Contraptions'),
        url: '/playground/contraptions',
        description:
          'One ball on a Rube Goldberg chain that never ends, with a new world behind every portal.',
        summary: 'Rube goldberg experiments in <canvas>',
        date: 'Sep 2026',
        year: '2026',
        source: 'https://github.com/wustep/contraptions',
        gradient: 'from-stone-100 via-sky-700 to-emerald-600',
        image: '/playground/covers/contraptions.png',
        CoverComponent: ContraptionsCover
      },
      {
        title: 'MIDI Visualizer',
        url: '/playground/midi-visualizer',
        description:
          'A Synthesia-style MIDI visualizer. Connect a MIDI device, drop in a MIDI file, or play with your keyboard.',
        summary: 'Synthesia-inspired music visualizer',
        date: 'Dec 2020',
        year: '2020',
        gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
        ogImage: '/og/playground/midi-visualizer.png',
        CoverComponent: MidiVisualizerCover
      },
      {
        title: 'Starry Night Sequencer',
        url: '/playground/starry-sequencer',
        description: 'MIDI visualizer inspired by Van Gogh.',
        summary: 'Audio-reactive MIDI visualizer inspired by Van Gogh',
        date: 'Dec 2016',
        year: '2016',
        article: '/starry-sequencer',
        source: 'https://github.com/wustep/starry-sequencer',
        gradient: 'from-indigo-500 via-sky-500 to-emerald-400',
        image: '/playground/covers/starry-sequencer-poster.webp',
        ogImage: '/og/playground/starry-sequencer.png',
        CoverComponent: StarrySequencerCover
      },
      {
        title: 'TBDBITL',
        url: '/playground/tbdbitl',
        description: 'Interactive D3.js infographic for the OSU Marching Band.',
        summary: 'D3.js infographic celebrating the Ohio State Marching band',
        date: 'Dec 2016',
        year: '2016',
        article: '/tbdbitl',
        source: 'http://github.com/wustep/tbdbitl',
        image: '/playground/covers/tbdbitl.png',
        ogImage: '/og/playground/tbdbitl.png'
      }
    ]
  },
  {
    title: 'Guides',
    items: [
      {
        title: 'Nord Stage 4',
        url: '/playground/nordstage4',
        description:
          'An interactive guide to every Nord Stage 4 button, knob, light, and menu, with page references to the manual.',
        summary: 'Every Nord Stage 4 control, explained',
        date: 'Oct 2026',
        year: '2026'
        // No `source`: wustep/nordstage4 is private, so a GitHub link would 404.
      },
      {
        title: 'EP-133 K.O. II',
        url: '/playground/ko-ii',
        description:
          'An unofficial, playable guide to the teenage engineering EP-133 K.O. II: every control, sampling, sequencing, and whole beats, cited to the official guide.',
        summary: 'A playable, unofficial guide to the EP-133',
        date: 'Oct 2026',
        year: '2026'
        // No `source`: wustep/ko2 is private, so a GitHub link would 404.
      },
      {
        title: 'Prompting',
        url: '/prompting',
        description:
          "A field guide to prompting coding agents: what works, what doesn't, and why.",
        summary: 'A field guide to prompting coding agents',
        date: 'Apr 2026',
        year: '2026',
        source: 'https://github.com/wustep/me/tree/main/pages/prompting'
      }
    ]
  }
]

export const playgroundEntries = playgroundSections.flatMap(
  (section) => section.items
)
