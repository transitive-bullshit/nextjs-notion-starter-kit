import { getSiteMaps } from '../../lib/get-site-maps'
import { getPage } from '../../lib/notion'
import { rootNotionPageId } from '../../lib/config'
// import { getAllPagesInSpace } from 'notion-utils'
import { mapNotionImageUrl } from '../../lib/map-image-url'
export default async function handler(req, res) {
  const siteMap = await getSiteMaps()
  const page = await getPage(rootNotionPageId)
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  const result = siteMap[0].canonicalPageMap
  const blogPost = []
  Object.keys(result).map((key, i) => {
    if (i !== 0) {
      const pageId = result[key]
      const block = page.block[pageId]?.value
      console.log(block)
      blogPost.push({
        title: block.properties?.title[0][0],
        imgUrl: mapNotionImageUrl(block?.format?.page_cover, block),
        icon: block?.format?.page_icon
      })
    }
  })
  res.end(
    JSON.stringify({
      data: blogPost
    })
  )
}
