import React from 'react'

import { host } from 'lib/config'

export default class Robots extends React.Component {
  static async getInitialProps({ res }) {
    res.setHeader('Content-Type', 'text/plain')
    res.write(`User-agent: *
Allow: /
Sitemap: ${host}/sitemap.xml
`)
    res.end()
  }
}
