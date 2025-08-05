import 'katex/dist/katex.min.css'
import 'prismjs/themes/prism-coy.css'
import 'react-notion-x/src/styles.css'
import 'styles/global.css'
import 'styles/notion.css'
import 'styles/prism-theme.css'

import * as Fathom from 'fathom-client'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { posthog } from 'posthog-js'
import * as React from 'react'

import {
  fathomConfig,
  fathomId,
  posthogConfig,
  posthogId
} from '@/lib/config'
import Layout from '../components/Layout'

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
    }

    if (fathomId) {
      Fathom.load(fathomId, fathomConfig)
    }

    if (posthogId) {
      posthog.init(posthogId, posthogConfig)
    }

    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [router.events])

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
