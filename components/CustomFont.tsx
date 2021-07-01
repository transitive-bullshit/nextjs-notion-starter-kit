import Head from 'next/head'
import * as React from 'react'
import * as types from '../lib/types'



export const CustomFont: React.FC<{ site: types.Site }> = ({ site }) => {
  // if (!site.fontFamily) {
  //   return null
  // }

  // https://developers.google.com/fonts/docs/css2
  // const fontFamilies = [site.fontFamily]
  // const googleFontFamilies = fontFamilies
  //   .map((font) => font.replace(/ /g, '+'))
  //   .map((font) => `family=${font}:ital,wght@0,200..700;1,200..700`)
  //   .join('&')
  // const googleFontsLink = `https://fonts.googleapis.com/css?${googleFontFamilies}&display=swap`
  // const cssFontFamilies = fontFamilies.map((font) => `"${font}"`).join(', ')

  return (
    <>
      <Head>

        <style>{`
          .notion-text,.notion-quote,.notion-list {
            font-family: 'source-han-serif-sc', -apple-system, BlinkMacSystemFont,serif;
        }
          .notion-title, b, .notion-page-title-text,.notion-callout-text {
            font-family:  "source-han-sans-simplified-c",sans-serif;
            font-weight:500;
          }
        `}</style>
      </Head>
    </>
  )
}
