import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import nextConfig from "../next.config";
import crypto from 'crypto';
const cspHashOf = (text) => {
  const hash = crypto.createHash('sha256')
  hash.update(text)
  return `'sha256-${hash.digest('base64')}'`
}
export default class MyDocument extends Document {
  render() {
    const generatedNonce = nextConfig.serverRuntimeConfig.nonceGenerator();

    return (
        <Html lang='en'>
          <Head>
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
            <meta httpEquiv='Content-Security-Policy' content={
              `object-src 'none'; base-uri 'none'; script-src 'self' 'unsafe-inline' 'nonce-${generatedNonce}' ${cspHashOf(
                NextScript.getInlineScriptSource(this.props))} 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=' 'sha256-PjBkwE8xcYZAp+HsnzzOVNqa/Ra+/v1Fnx6f0PW6ic4='; style-src 'self' 'unsafe-inline'`
              } />
            <link rel='manifest' href='/manifest.json' />
            <link rel='stylesheet' href='/styles/styles.css' nonce={generatedNonce}></link>
            <link rel='stylesheet' href='/styles/notion.css' nonce={generatedNonce}></link>
            <link rel='stylesheet' href='/styles/global.css' nonce={generatedNonce}></link>
            

          </Head>

          <body>

            <Main />

            <NextScript/>
          </body>
        </Html>
    )
  }
}
