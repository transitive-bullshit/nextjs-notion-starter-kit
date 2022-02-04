import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'
import { IconContext } from 'react-icons'
import { googleAnalyticsID } from 'lib/config'

export default class MyDocument extends Document {
  render() {
    return (
      <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
        <Html lang='en'>
          <Head>
            <link rel='shortcut icon' href='/favicon.png' />

            <link
              rel='apple-touch-icon'
              sizes='180x180'
              href='/apple-touch-icon.png'
            />
            <link
              rel='icon'
              type='image/png'
              sizes='96x96'
              href='/favicon-96x96.png'
            />
            <link
              rel='icon'
              type='image/png'
              sizes='32x32'
              href='/favicon-32x32.png'
            />
            <link
              rel='icon'
              type='image/png'
              sizes='16x16'
              href='/favicon-16x16.png'
            />

            <link rel='manifest' href='/manifest.json' />
          </Head>

          <body>
            <script src='noflash.js' />

            // Google Analytics
            {
              googleAnalyticsID && (
                <>
                  <Script id="google-analytics" strategy="afterInteractive">
                    {`
          window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
          ga('create', '${googleAnalyticsID}', 'auto');
          ga('send', 'pageview');
        `}
                  </Script>
                  <Script
                    src="https://www.google-analytics.com/analytics.js"
                    strategy="afterInteractive"
                  />
                </>
              )

            }

            <Main />

            <NextScript />
          </body>
        </Html>
      </IconContext.Provider>
    )
  }
}
