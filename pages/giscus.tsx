import type { GetServerSideProps } from 'next'

import { host } from '@/lib/config'

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

  // cache for up to one day
  res.setHeader('Cache-Control', 'public, max-age=86400, immutable')
  res.setHeader('Content-Type', 'text/plain')
  res.write(`<div class="giscus" style="margin: 1rem; width: calc(100% - 2rem);"></div>
<script>
  window.self.parent.append('<script src="https://giscus.app/client.js" data-repo="lemonorangeapple/lemonorangeapple.github.io" data-repo-id="R_kgDOKvAL3w" data-category="Announcements" data-category-id="DIC_kwDOKvAL384Ccnt0" data-mapping="pathname" data-strict="0"data-reactions-enabled="0" data-emit-metadata="0" data-input-position="top" data-theme="preferred_color_scheme" data-lang="zh-CN" data-loading="lazy" crossorigin="anonymous" async></scr' + 'ipt>');
</script>`)

  res.end()

  return {
    props: {}
  }
}

export default () => null
