import Head from 'next/head'
import * as React from 'react'
import * as types from 'lib/types'
import useDarkMode from 'use-dark-mode'

// TODO: remove duplication between PageHead and NotionPage Head

export const PageHead: React.FC<types.PageProps> = ({ site }) => {
  const darkMode = useDarkMode(false, { classNameDark: 'dark-mode' })
  let themeColor
  if (darkMode.value) {
    themeColor = <meta name='theme-color' content='#06061a' />
  } else {
    themeColor = <meta name='theme-color' content='#fefefe' />
  }

  return (
    <Head>
      <meta charSet='utf-8' />
      <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1, shrink-to-fit=no'
      />
      {site?.description && (
        <>
          <meta name='description' content={site.description} />
          <meta property='og:description' content={site.description} />
        </>
      )}
      {themeColor}
    </Head>
  )
}
