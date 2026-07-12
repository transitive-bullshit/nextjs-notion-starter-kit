import type React from 'react'

import { BombermanCover } from '@/components/wustep/BombermanCover'
import { BookshelfCover } from '@/components/wustep/BookshelfCover'
import { DominoCover } from '@/components/wustep/DominoCover'
import { LensesCover } from '@/components/wustep/LensesCover'
import { LensesIllustrationLabCover } from '@/components/wustep/LensesIllustrationLabCover'
import { MidiVisualizerCover } from '@/components/wustep/MidiVisualizerCover'
import { ShadcnPhysicsCover } from '@/components/wustep/ShadcnPhysicsCover'
import { SplashPanicCover } from '@/components/wustep/SplashPanicCover'
import { SpotItCover } from '@/components/wustep/SpotItCover'
import { StageBenchCover } from '@/components/wustep/StageBenchCover'
import { StarrySequencerCover } from '@/components/wustep/StarrySequencerCover'

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
  article?: string
  source?: string
  /** Companion X post; linked like `article` from cards and the sidebar. */
  x?: string
  gradient?: string
  image?: string
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
        title: 'StageBench',
        url: '/playground/stagebench',
        description:
          'A benchmark for evaluating models by having them generate a replica of the Nord Stage 4.',
        summary: 'Evaluating models through Nord Stage 4 replicas',
        date: 'Jun 2026',
        year: '2026',
        source: 'https://stagebench.vercel.app/',
        x: 'https://x.com/wustep/status/2074529375043858480',
        gradient: 'from-red-600 via-red-950 to-zinc-950',
        CoverComponent: StageBenchCover
      },
      {
        title: 'Lenses',
        url: '/playground/lenses',
        description:
          'A canvas of lenses for seeing the world. Each card is a different frame — Great Man, evolutionary psychology, minimalism, utility, status — and no single one sees everything.',
        summary: 'A canvas of frames for seeing the world',
        date: 'May 2026',
        year: '2026',
        gradient: 'from-purple-500 via-fuchsia-500 to-rose-500',
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
        CoverComponent: ShadcnPhysicsCover
      }
    ]
  },
  {
    title: 'Games',
    items: [
      {
        title: 'Splash Panic!',
        url: '/playground/splashpanic',
        description:
          'A chaotic multiplayer water-balloon battle arena inspired by Crazy Arcade — trap your rivals in bubbles, rescue your teammates, and be the last one standing.',
        summary: 'Multiplayer water-balloon chaos with bubble traps & rescues',
        date: 'Jul 2026',
        year: '2026',
        source: 'https://github.com/wustep/splashpanic',
        gradient: 'from-teal-300 via-sky-400 to-blue-500',
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
        source: 'https://github.com/wustep/spot-it',
        gradient: 'from-amber-400 to-pink-500',
        image: '/playground/covers/spot-it.png',
        CoverComponent: SpotItCover
      },
      {
        title: 'Bomberman',
        url: '/playground/bomberman',
        description:
          'Two-player Bomberman clone with emojis. Fully vibe coded with Cursor & Claude 3.5 Sonnet.',
        summary: 'Two-player Bomberman clone with pets & power-ups',
        date: 'Nov 2024',
        year: '2024',
        article: '/bomberman',
        source: 'https://github.com/wustep/bomberman',
        gradient: 'from-orange-500 to-rose-500',
        image: '/playground/covers/bomberman.png',
        CoverComponent: BombermanCover
      }
    ]
  },
  {
    title: 'Visualizations',
    items: [
      {
        title: 'MIDI Visualizer',
        url: '/playground/midi-visualizer',
        description:
          'A Synthesia-style MIDI visualizer. Connect a MIDI device, drop in a MIDI file, or play with your keyboard.',
        summary: 'Synthesia-inspired music visualizer',
        date: 'Dec 2020',
        year: '2020',
        gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
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
        image: '/playground/covers/tbdbitl.png'
      }
    ]
  }
]

export const playgroundEntries = playgroundSections.flatMap(
  (section) => section.items
)
