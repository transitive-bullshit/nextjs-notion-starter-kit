import { getSiteMaps } from '../../lib/get-site-maps'
export default async function handler(req, res) {
  const siteMap = await getSiteMaps()
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  // console.log(siteMap[0].canonicalPageMap)
  res.end(JSON.stringify({ ...siteMap[0].canonicalPageMap }))
}
