import { GetServerSideProps } from 'next'
import { host } from 'lib/config'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (req.method !== 'GET') {
    res.statusCode = 405
    res.setHeader("Content-Type", "application/json")
    res.write(JSON.stringify({ error: "method not allowed" }))
    res.end()
    return {
      props: {}
    }
  }

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
  )
  res.setHeader('Content-Type', 'text/plain')
  res.write(`User-agent: *
  Sitemap: ${host}/sitemap.xml
  `)
  res.end()
  return {
    props: {}
  }
}

const RobotsTxt: React.FC = () => null

export default RobotsTxt
