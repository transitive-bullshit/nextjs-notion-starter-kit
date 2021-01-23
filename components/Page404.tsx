import Head from 'next/head'
import * as React from 'react'
import * as types from 'lib/types'
import { PageHead } from './PageHead'
import Link from 'next/link'
import { Box, Container, Heading, Image } from '@chakra-ui/react'

export const Page404: React.FC<types.PageProps> = ({ site, pageId, error }) => {
  const title = site?.name || 'Notion Page Not Found'

  return (
    <>
      <PageHead site={site} />

      <Head>
        <meta property='og:site_name' content={title} />
        <meta property='og:title' content={title} />

        <title>{title}</title>
      </Head>

      <Container>
        <Box mt={10} textAlign='center'>
          <Heading>404 Not Found</Heading>
          <Image src='/404.png' alt='404 Not Found' maxW='100%' width='640px' />
          <Link href='/'>Back to home</Link>
        </Box>
      </Container>
    </>
  )
}
