// global styles shared across the entire site
import * as React from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import * as Fathom from 'fathom-client';
// used for rendering equations (optional)
import 'katex/dist/katex.min.css';
import posthog from 'posthog-js';
// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-coy.css';
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css';
import 'styles/global.css';
// this might be better for dark mode
// import 'prismjs/themes/prism-okaidia.css';
// global style overrides for notion
import 'styles/notion.css';
// global style overrides for prism theme (optional)
import 'styles/prism-theme.css';

import { Urbanist, Tektur } from '@next/font/google'; // Import fonts

import { bootstrap } from '@/lib/bootstrap-client';
import {
  fathomConfig,
  fathomId,
  isServer,
  posthogConfig,
  posthogId,
} from '@/lib/config';

// Import and configure fonts
const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-urbanist', // Add a CSS variable for Urbanist
});

const tektur = Tektur({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-tektur', // Add a CSS variable for Tektur
});

if (!isServer) {
  bootstrap();
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  React.useEffect(() => {
    function onRouteChangeComplete() {
      if (fathomId) {
        Fathom.trackPageview();
      }

      if (posthogId) {
        posthog.capture('$pageview');
      }
    }

    if (fathomId) {
      Fathom.load(fathomId, fathomConfig);
    }

    if (posthogId) {
      posthog.init(posthogId, posthogConfig);
    }

    router.events.on('routeChangeComplete', onRouteChangeComplete);

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete);
    };
  }, [router.events]);

  return (
    <main className={`${urbanist.variable} ${tektur.variable}`}>
      <Component {...pageProps} />
    </main>
  );
}
