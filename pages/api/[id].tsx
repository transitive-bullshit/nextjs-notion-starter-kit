import { GetStaticProps } from 'next'
import React from 'react'

import cors from 'micro-cors'

const corsHandler = cors()

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Fetch data for the given ID from an API or database
  const data = {
    id: params.id,
    title: 'Example Page',
    content: 'Hello, world!'
  }

  // Return the data as props for the page
  return { props: { data }, revalidate: 10 }
}

const Page = ({ data }) => {
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

export default corsHandler(Page)
