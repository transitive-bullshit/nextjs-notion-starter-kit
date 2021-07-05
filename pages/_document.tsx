import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { IconContext } from 'react-icons'

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

            <Main />

            <NextScript />
            <script async src="https://www.googletagmanager.com/gtag/js?id=UA-147733158-1"></script>
            <script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
            <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-147733158-1', {
              page_path: window.location.pathname,
            });
          `}}
          />

    <script
    dangerouslySetInnerHTML={{
              __html: `
          (function(d) {
            var config = {
              kitId: 'bhl5hda',
              scriptTimeout: 3000,
              async: true
            },
            h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
          })(document); `}}
        />
         <script
            dangerouslySetInnerHTML={{
              __html: `
              function resizeCover(){
                var imgs = document.querySelectorAll("div.notion-collection-card-cover>img[src*='https://images.unsplash.com']");
                imgs.forEach(function(item) {
                    item.src=item.src+"&fit=clip&w=640";
                })
                var imgs = document.querySelectorAll("img.notion-page-cover[src*='https://images.unsplash.com']");
                imgs.forEach(function(item) {
                    item.src=item.src +"&fit=clip&w=1200";
                })
            }
              resizeCover();
              console.log("image resizing on page load.");`
            }}
          />
          </body>
        </Html>
      </IconContext.Provider>
    )
  }
}
