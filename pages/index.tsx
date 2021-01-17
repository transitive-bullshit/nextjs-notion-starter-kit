import React from 'react'
import { siteDomain } from 'lib/config'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { NotionPage } from 'components'

export const getStaticProps = async (context) => {
  try {
    const props = await resolveNotionPage(siteDomain)

    return { props, revalidate: 10 }
  } catch (err) {
    console.error('page error', siteDomain, err)

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
