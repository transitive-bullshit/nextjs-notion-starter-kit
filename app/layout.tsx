// used for rendering equations (optional)
// import 'katex/dist/katex.min.css'
// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-coy.css'
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/styles.css'
// global styles shared across the entire site
import '@/styles/global.css'
// global style overrides for notion
import '@/styles/notion.css'
// global style overrides for prism theme (optional)
import '@/styles/prism-theme.css'

import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, JetBrains_Mono, Manrope } from 'next/font/google'
import type { ReactNode } from 'react'

import * as config from '@/lib/config'
import { SkipLink } from '@/components/SkipLink'

import { Providers } from './providers'

const sans = Manrope({
  preload: false,
  subsets: ['latin'],
  variable: '--font-sans'
})

const serif = Cormorant_Garamond({
  preload: false,
  subsets: ['latin'],
  variable: '--font-serif',
  weight: '500'
})

const mono = JetBrains_Mono({
  preload: false,
  subsets: ['latin'],
  variable: '--font-mono'
})

export const metadata: Metadata = {
  metadataBase: new URL(config.host),
  title: config.name,
  description: config.description,
  manifest: '/manifest.json',
  icons: {
    shortcut: '/favicon.ico',
    icon: [
      {
        url: '/favicon-32x32.png',
        type: 'image/png',
        sizes: '32x32'
      }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black'
  },
  alternates: {
    types: {
      'application/rss+xml': [
        {
          url: '/feed',
          title: config.name
        }
      ]
    }
  },
  openGraph: {
    type: 'website',
    siteName: config.name,
    title: config.name,
    description: config.description
  },
  twitter: {
    card: 'summary',
    creator: config.twitter ? `@${config.twitter}` : undefined,
    title: config.name,
    description: config.description
  },
  other: {
    'mobile-web-app-capable': 'yes'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#080908'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={config.language} suppressHydrationWarning>
      <body className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
        <SkipLink />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
