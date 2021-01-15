import 'styles/global.css'
import 'react-notion/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'rc-dropdown/assets/index.css'
import 'katex/dist/katex.min.css'

import React from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { bootstrap } from 'lib/bootstrap-client'
import { fathomId, fathomConfig } from 'lib/config'
import * as Fathom from 'fathom-client'

if (typeof window !== 'undefined') {
  bootstrap()
}

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    if (fathomId) {
      Fathom.load(fathomId, fathomConfig)

      function onRouteChangeComplete() {
        Fathom.trackPageview()
      }

      router.events.on('routeChangeComplete', onRouteChangeComplete)

      return () => {
        router.events.off('routeChangeComplete', onRouteChangeComplete)
      }
    }
  }, [])

  return <Component {...pageProps} />
}
