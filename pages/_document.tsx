import * as React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang='mn'>
        <Head>
          <meta charSet='utf-8' />
          <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
          <link rel='shortcut icon' href='/favicon.ico' />
          <link rel='icon' type='image/png' sizes='32x32' href='favicon.png' />

          <meta name='description' content='My school coming soon...' />
          <meta name='og:title' content='My school' />
          <meta name='og:url' content='https://anhgerel.ml' />
          <meta name='og:description' content='My school coming soon...' />
          <meta name='og:image' content='/favicon.ico' />
          <link rel='shortcut icon' href='/favicon.ico' />

          <meta name='theme-color' content='#0369a1' />

          <meta name='msapplication-TileColor' content='#0369a1' />
          <meta name='msapplication-config' content='/browserconfig.xml' />

          <link rel='manifest' href='/manifest.json' />
          <link rel='shortcut icon' href='/favicon.ico' />

          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/icons/apple-touch-icon.png'
          />
          <link
            rel='mask-icon'
            href='/icons/safari-pinned-tab.svg'
            color='#0369a1'
          />

          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/icons/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='/icons/favicon-16x16.png'
          />

          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=G-DHTH501J9H`}
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
						window.dataLayer = window.dataLayer || [];
						function gtag(){window.dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', G-DHTH501J9H);
						if(/MSIE \\d|Trident.*rv:/.test(navigator.userAgent)) {
							window.location = 'microsoft-edge:' + window.location;
							setTimeout(function() {
								window.location = 'https://go.microsoft.com/fwlink/?linkid=2135547';
							}, 1);
						}
						`
            }}
          />
          <noscript>This website requires JavaScript to be enabled.</noscript>
        </Head>

        <body>
          <Main />

          <NextScript />
        </body>
      </Html>
    )
  }
}
