// used for rendering equations (optional)
import 'katex/dist/katex.min.css'
// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-coy.css'
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'
// global styles shared across the entire site
import 'styles/global.css'
// this might be better for dark mode
// import 'prismjs/themes/prism-okaidia.css'
// global style overrides for notion
import 'styles/notion.css'
// global style overrides for prism theme (optional)
import 'styles/prism-theme.css'

import type { AppProps } from 'next/app'
import * as Fathom from 'fathom-client'
import { useRouter } from 'next/router'
import { posthog } from 'posthog-js'
import * as React from 'react'

import { bootstrap } from '@/lib/bootstrap-client'
import {
  fathomConfig,
  fathomId,
  isServer,
  posthogConfig,
  posthogId,
  umamiScriptUrl,
  umamiWebsiteId
} from '@/lib/config'
import Script from 'next/script'

if (!isServer) {
  bootstrap()
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  React.useEffect(() => {
    function onRouteChangeComplete() {
      if (fathomId) {
        Fathom.trackPageview()
      }

      if (posthogId) {
        posthog.capture('$pageview')
      }

      if (umamiWebsiteId && (window as any).umami) {
        (window as any).umami.track((props: any) => ({
          ...props,
          url: window.location.hostname + window.location.pathname,
        }))
      }
    }

    if (fathomId) {
      Fathom.load(fathomId, fathomConfig)
    }

    if (posthogId) {
      posthog.init(posthogId, posthogConfig)
    }

    if (umamiWebsiteId) {
      // First hit tracking
      const trackUmami = () => {
        if ((window as any).umami) {
          (window as any).umami.track((props: any) => ({
            ...props,
            url: window.location.hostname + window.location.pathname,
          }))
        } else {
          // script hasn't loaded yet, retry
          setTimeout(trackUmami, 300)
        }
      }
      trackUmami()
    }

    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [router.events])

  return (
    <>
      {umamiWebsiteId && (
        <Script
          async
          src={umamiScriptUrl}
          data-website-id={umamiWebsiteId}
          data-auto-track='false'
          strategy='afterInteractive'
        />
      )}
      <Component {...pageProps} />
    </>
  )
}
