import React from 'react'
import { domain } from 'lib/config'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { NotionPage } from 'components'

export const getStaticProps = async () => {
  try {
    const props = await resolveNotionPage(domain)

    return { props, revalidate: 10 }
  } catch (err) {
    console.error('page error', domain, err)

    return {
      props: {
        error: {
          statusCode: err.statusCode || 500,
          message: err.message
        }
      }
    }
  }
}
export default function NotionDomainPage(props) {
  return <NotionPage {...props} />
}
