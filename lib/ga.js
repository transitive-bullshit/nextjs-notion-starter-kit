// log the pageview with their URL
export const pageview = (url) => {
    window.gtag('config', 'UA-147733158-1', {
      page_path: url,
    })
  }
  
  // log specific events happening.
  export const event = ({ action, params }) => {
    window.gtag('event', action, params)
  }

  export const bsz = () => {
    bszCaller.fetch("//busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback", function(a) {
    bszTag.texts(a),
    bszTag.shows()})
}