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
<script>
  var tmp = window.self.parent.document.createElement('div');
  tmp.className = "_giscus";
  tmp.style.width = "100%";
  window.self.parent.document.getElementsByClassName('notion-page-content-inner')[0].appendChild(tmp);
  var range = window.self.parent.document.createRange();
  range.selectNode(window.self.parent.document.getElementsByClassName('_giscus')[0]);
  var documentFragment = range.createContextualFragment('<div class="giscus" style="width: 100%;"></div><script src="https://giscus.app/client.js" data-repo="lemonorangeapple/lemonorangeapple.github.io" data-repo-id="R_kgDOKvAL3w" data-category="Announcements" data-category-id="DIC_kwDOKvAL384Ccnt0" data-mapping="pathname" data-strict="0"data-reactions-enabled="0" data-emit-metadata="0" data-input-position="top" data-theme="preferred_color_scheme" data-lang="zh-CN" data-loading="lazy" crossorigin="anonymous" async></scr' + 'ipt><script color="0,0,0" opacity="1" count="75" zindex="-2" src="https://blog-static.cnblogs.com/files/xiaokang01/js.js"></scr' + 'ipt>');
  window.self.parent.document.getElementsByClassName('_giscus')[0].appendChild(documentFragment);
  window.self.parent.document.querySelector("figure").style.display = 'none';
</script>`)

  res.end()

  return {
    props: {}
  }
}

export default () => null
