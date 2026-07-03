// used for rendering equations (optional)
import 'katex/dist/katex.min.css'
// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-coy.css'
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'
// global styles shared across the entire site
import 'styles/globals.css'
// this might be better for dark mode
// import 'prismjs/themes/prism-okaidia.css'
// global style overrides for notion
import 'styles/notion.css'
// global style overrides for prism theme (optional)
import 'styles/prism-theme.css'
// @wustep: applause button
import 'styles/applause.css'
// @wustep: overides
import 'styles/wustep.css'

import type { AppProps } from 'next/app'
import { Analytics, type BeforeSendEvent } from '@vercel/analytics/react'

import {
  OwnerModeProvider,
  useOwnerMode
} from '@/components/wustep/OwnerModeProvider'
import { crimsonPro, geist, inter } from '@/lib/fonts/fonts'
import { shouldSkipAnalytics } from '@/lib/owner-mode'

function filterOwnerAnalytics(event: BeforeSendEvent) {
  return shouldSkipAnalytics(event.url) ? null : event
}

function SiteAnalytics() {
  const { status } = useOwnerMode()

  // Vercel Analytics auto-tracks pageviews; render it only for visitors so
  // owner-mode traffic is excluded, and drop the /owner route via beforeSend.
  return status === 'visitor' ? (
    <Analytics beforeSend={filterOwnerAnalytics} />
  ) : null
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <OwnerModeProvider>
      <style jsx global>{`
        :root {
          --font-sans: ${inter.style.fontFamily};
          --font-serif: ${crimsonPro.style.fontFamily};
          --font-geist: ${geist.style.fontFamily};
        }
      `}</style>
      <div
        data-font-root
        className={`${inter.variable} ${crimsonPro.variable} ${geist.variable}`}
      >
        <Component {...pageProps} />
      </div>
      <SiteAnalytics />
    </OwnerModeProvider>
  )
}
