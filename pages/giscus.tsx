import type { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (req.method !== 'GET') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({ error: 'method not allowed' }))
    res.end()

    return {
      props: {}
    }
  }

  res.setHeader('Content-Type', 'text/html')
  res.write(`
<script color="0,0,0" opacity="1" count="75" zindex="-2">
  var tmp = window.self.parent.document.createElement('div');
  tmp.className = "_giscus";
  tmp.style.width = "100%";
  window.self.parent.document.getElementsByClassName('notion-page-content-inner')[0].appendChild(tmp);
  var range = window.self.parent.document.createRange();
  range.selectNode(window.self.parent.document.getElementsByClassName('_giscus')[0]);
  var documentFragment = range.createContextualFragment('<div class="giscus" style="width: 100%;"></div><script src="https://giscus.app/client.js" data-repo="lemonorangeapple/lemonorangeapple.github.io" data-repo-id="R_kgDOKvAL3w" data-category="Announcements" data-category-id="DIC_kwDOKvAL384Ccnt0" data-mapping="pathname" data-strict="0"data-reactions-enabled="0" data-emit-metadata="0" data-input-position="top" data-theme="preferred_color_scheme" data-lang="zh-CN" data-loading="lazy" crossorigin="anonymous" async></scr' + 'ipt>');
  window.self.parent.document.getElementsByClassName('_giscus')[0].appendChild(documentFragment);
  window.self.parent.document.querySelector("figure").style.display = 'none';
  !function(){function n(n,e,t){return n.getAttribute(e)||t}function e(n){return document.getElementsByTagName(n)}function t(){i=d.width=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,c=d.height=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight}function o(){x.clearRect(0,0,i,c);var n,e,t,a,u,m,d=[s].concat(f);f.forEach(function(o){for(o.x+=o.xa,o.y+=o.ya,o.xa*=o.x>i||o.x<0?-1:1,o.ya*=o.y>c||o.y<0?-1:1,x.fillRect(o.x-.5,o.y-.5,1,1),e=0;e<d.length;e++)o!==(n=d[e])&&null!==n.x&&null!==n.y&&(a=o.x-n.x,u=o.y-n.y,(m=a*a+u*u)<n.max&&(n===s&&m>=n.max/2&&(o.x-=.03*a,o.y-=.03*u),t=(n.max-m)/n.max,x.beginPath(),x.lineWidth=t/2,x.strokeStyle="rgba("+l.c+","+(t+.2)+")",x.moveTo(o.x,o.y),x.lineTo(n.x,n.y),x.stroke()));d.splice(d.indexOf(o),1)}),w(o)}var i,c,a,u,m,d=document.createElement("canvas"),l=(a=e("script"),u=a.length,m=a[u-1],{l:u,z:n(m,"zIndex",-2),o:n(m,"opacity",.8),c:n(m,"color","101,255,115"),n:n(m,"count",300)}),r="c_n"+l.l,x=d.getContext("2d"),w=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(n){window.setTimeout(n,1e3/45)},y=Math.random,s={x:null,y:null,max:2e4};d.id=r,d.style.cssText="position:fixed;top:0;left:0;z-index:"+l.z+";opacity:"+l.o,e("body")[0].appendChild(d),t(),window.onresize=t,window.onmousemove=function(n){n=n||window.event,s.x=n.clientX,s.y=n.clientY},window.onmouseout=function(){s.x=null,s.y=null};for(var f=[],h=0;l.n>h;h++){var g=y()*i,p=y()*c,v=2*y()-1,b=2*y()-1;f.push({x:g,y:p,xa:v,ya:b,max:6e3})}setTimeout(function(){o()},100)}();
</script>`)

  res.end()

  return {
    props: {}
  }
}

export default () => null
