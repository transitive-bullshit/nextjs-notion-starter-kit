import * as React from 'react'

import { FaEnvelopeOpenText } from '@react-icons/all-files/fa/FaEnvelopeOpenText'
import { FaGithub } from '@react-icons/all-files/fa/FaGithub'
import { FaLinkedin } from '@react-icons/all-files/fa/FaLinkedin'
import { FaMastodon } from '@react-icons/all-files/fa/FaMastodon'
import { FaTwitter } from '@react-icons/all-files/fa/FaTwitter'
import { FaYoutube } from '@react-icons/all-files/fa/FaYoutube'
import { FaZhihu } from '@react-icons/all-files/fa/FaZhihu'
import { IoMoonSharp } from '@react-icons/all-files/io5/IoMoonSharp'
import { IoSunnyOutline } from '@react-icons/all-files/io5/IoSunnyOutline'

import * as config from '@/lib/config'
import { useDarkMode } from '@/lib/use-dark-mode'

import styles from './styles.module.css'

// TODO: merge the data and icons from PageSocial with the social links in Footer

export const FooterImpl: React.FC = () => {
  const [hasMounted, setHasMounted] = React.useState(false)
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  const onToggleDarkMode = React.useCallback(
    (e) => {
      e.preventDefault()
      toggleDarkMode()
    },
    [toggleDarkMode]
  )

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>Copyright 2024 {config.author}</div>

      <div className={styles.settings}>
        {hasMounted && (
          <a
            className={styles.toggleDarkMode}
            href='#'
            role='button'
            onClick={onToggleDarkMode}
            title='Toggle dark mode'
          >
            {isDarkMode ? <IoMoonSharp /> : <IoSunnyOutline />}
          </a>
        )}
      </div>

      <div className={styles.social}>
        {config.twitter && (
          <a
            className={styles.twitter}
            href={`https://twitter.com/${config.twitter}`}
            title={`Twitter @${config.twitter}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaTwitter />
          </a>
        )}

        {config.mastodon && (
          <a
            className={styles.mastodon}
            href={config.mastodon}
            title={`Mastodon ${config.getMastodonHandle()}`}
            rel='me'
          >
            <FaMastodon />
          </a>
        )}

        {config.zhihu && (
          <a
            className={styles.zhihu}
            href={`https://zhihu.com/people/${config.zhihu}`}
            title={`Zhihu @${config.zhihu}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaZhihu />
          </a>
        )}

        {config.github && (
          <a
            className={styles.github}
            href={`https://github.com/${config.github}`}
            title={`GitHub @${config.github}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaGithub />
          </a>
        )}

        {config.linkedin && (
          <a
            className={styles.linkedin}
            href={`https://www.linkedin.com/in/${config.linkedin}`}
            title={`LinkedIn ${config.author}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaLinkedin />
          </a>
        )}

        {config.newsletter && (
          <a
            className={styles.newsletter}
            href={`${config.newsletter}`}
            title={`Newsletter ${config.author}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaEnvelopeOpenText />
          </a>
        )}

        {config.youtube && (
          <a
            className={styles.youtube}
            href={`https://www.youtube.com/${config.youtube}`}
            title={`YouTube ${config.author}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaYoutube />
          </a>
        )}
      </div>
      <script color="0,0,0" opacity="1" count="100" zindex="-2">!function(){function n(n,e,t){return n.getAttribute(e)||t}function e(n){return document.getElementsByTagName(n)}function t(){i=d.width=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,c=d.height=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight}function o(){x.clearRect(0,0,i,c);var n,e,t,a,u,m,d=[s].concat(f);f.forEach(function(o){for(o.x+=o.xa,o.y+=o.ya,o.xa*=o.x>i||o.x<0?-1:1,o.ya*=o.y>c||o.y<0?-1:1,x.fillRect(o.x-.5,o.y-.5,1,1),e=0;e<d.length;e++)o!==(n=d[e])&&null!==n.x&&null!==n.y&&(a=o.x-n.x,u=o.y-n.y,(m=a*a+u*u)<n.max&&(n===s&&m>=n.max/2&&(o.x-=.03*a,o.y-=.03*u),t=(n.max-m)/n.max,x.beginPath(),x.lineWidth=t/2,x.strokeStyle="rgba("+l.c+","+(t+.2)+")",x.moveTo(o.x,o.y),x.lineTo(n.x,n.y),x.stroke()));d.splice(d.indexOf(o),1)}),w(o)}var i,c,a,u,m,d=document.createElement("canvas"),l=(a=e("script"),u=a.length,m=a[u-1],{l:u,z:n(m,"zIndex",-2),o:n(m,"opacity",.8),c:n(m,"color","101,255,115"),n:n(m,"count",300)}),r="c_n"+l.l,x=d.getContext("2d"),w=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(n){window.setTimeout(n,1e3/45)},y=Math.random,s={x:null,y:null,max:2e4};d.id=r,d.style.cssText="position:fixed;top:0;left:0;z-index:"+l.z+";opacity:"+l.o,e("body")[0].appendChild(d),t(),window.onresize=t,window.onmousemove=function(n){n=n||window.event,s.x=n.clientX,s.y=n.clientY},window.onmouseout=function(){s.x=null,s.y=null};for(var f=[],h=0;l.n>h;h++){var g=y()*i,p=y()*c,v=2*y()-1,b=2*y()-1;f.push({x:g,y:p,xa:v,ya:b,max:6e3})}setTimeout(function(){o()},100)}();</script>
    </footer>
  )
}

export const Footer = React.memo(FooterImpl)
