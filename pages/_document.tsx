import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import nextConfig from "../next.config";
import {NextStrictCSP} from 'next-strict-csp';
const HeadCSP = NextStrictCSP;

export default class MyDocument extends Document {
  render() {
    console.log(nextConfig)
    const generatedNonce = nextConfig.serverRuntimeConfig.nonceGenerator();
    console.log(generatedNonce);
    return (
        <Html lang='en'>
          <Head nonce={generatedNonce}>
            <link rel='shortcut icon' href='/favicon.png' />

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
            <meta httpEquiv='Content-Security-Policy' content={`object-src none; script-src 'self' nonce-${generatedNonce}; style-src 'self' 'nonce-${generatedNonce}'`} />
            <link rel='manifest' href='/manifest.json' />
            <link rel='stylesheet' href='/styles/styles.css' nonce={generatedNonce}></link>
            <link rel='stylesheet' href='/styles/notion.css' nonce={generatedNonce}></link>
            <link rel='stylesheet' href='/styles/global.css' nonce={generatedNonce}></link>
            

          </Head>

          <body>

            <Main />

            <NextScript  nonce={generatedNonce}/>
          </body>
        </Html>
    )
  }
}
