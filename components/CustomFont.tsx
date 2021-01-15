import Head from 'next/head'
import * as React from 'react'
import * as types from '../lib/types'

export const CustomFont: React.FC<{ site: types.Site }> = ({ site }) => {
  if (!site.fontFamily) {
    return null
  }

  // https://developers.google.com/fonts/docs/css2
  const fontFamilies = [site.fontFamily]
  const googleFontFamilies = fontFamilies
    .map((font) => font.replace(/ /g, '+'))
    .map((font) => `family=${font}:ital,wght@0,200..700;1,200..700`)
    .join('&')
  const googleFontsLink = `https://fonts.googleapis.com/css?${googleFontFamilies}&display=swap`
  const cssFontFamilies = fontFamilies.map((font) => `"${font}"`).join(', ')

  return (
    <>
      <Head>
        <link rel='stylesheet' href={googleFontsLink} />

        <style>{`
          .notion.notion-app {
            font-family: ${cssFontFamilies}, -apple-system, BlinkMacSystemFont,
              'Segoe UI', Helvetica, 'Apple Color Emoji', Arial, sans-serif,
              'Segoe UI Emoji', 'Segoe UI Symbol';
          }
        `}</style>
      </Head>
    </>
  )
}
