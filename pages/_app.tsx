// used for rendering equations (optional)
import 'katex/dist/katex.min.css'
// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-coy.css'
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/styles.css'
// global styles shared across the entire site
import '@/styles/global.css'
// this might be better for dark mode
// import 'prismjs/themes/prism-okaidia.css'
// global style overrides for notion
import '@/styles/notion.css'
// global style overrides for prism theme (optional)
import '@/styles/prism-theme.css'

import type { AppProps } from 'next/app'
import * as Fathom from 'fathom-client'
import { useRouter } from 'next/router'
import { ThemeProvider } from 'next-themes'
import type PostHog from 'posthog-js-lite'
import * as React from 'react'

import { bootstrap } from '@/lib/bootstrap-client'
import {
  fathomConfig,
  fathomId,
  isServer,
  posthogConfig,
  posthogId
} from '@/lib/config'

const themeClassNames = { dark: 'dark-mode', light: 'light-mode' }

if (!isServer) {
  bootstrap()
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  React.useEffect(() => {
    let posthog: PostHog | undefined
    let isDisposed = false

    function onRouteChangeComplete() {
      if (fathomId) {
        Fathom.trackPageview()
      }

      posthog?.capture('$pageview')
    }

    if (fathomId) {
      Fathom.load(fathomId, fathomConfig)
    }

    const posthogApiKey = posthogId

    if (posthogApiKey) {
      void import('posthog-js-lite').then(({ default: PostHog }) => {
        if (isDisposed) {
          return
        }

        posthog = new PostHog(posthogApiKey, posthogConfig)
        posthog.capture('$pageview')
      })
    }

    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      isDisposed = true
      router.events.off('routeChangeComplete', onRouteChangeComplete)
      void posthog?._shutdown()
    }
  }, [router.events])

  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      disableTransitionOnChange
      enableSystem
      value={themeClassNames}
    >
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
