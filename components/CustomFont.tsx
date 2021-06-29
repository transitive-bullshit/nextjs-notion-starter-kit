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
      <script>{`
          (function(d) {
            var config = {
              kitId: 'bhl5hda',
              scriptTimeout: 3000,
              async: true
            },
            h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
          })(document); `}
        </script>

        <style>{`
          .notion-text {
            font-family: 'source-han-serif-sc', -apple-system, BlinkMacSystemFont,serif;
        }
          .notion-title, b, .notion-page-title-text {
            font-family:  "source-han-sans-simplified-c",sans-serif;
          }
        `}</style>
      </Head>
    </>
  )
}
