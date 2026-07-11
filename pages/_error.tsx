import type { NextPageContext } from 'next'

import { ErrorPage } from '@/components/ErrorPage'

function CustomErrorPage({ statusCode }: { statusCode?: number }) {
  return <ErrorPage statusCode={statusCode} />
}

// Without this, `statusCode` is undefined on real 500s and client-side
// crashes, and the page renders a literal "Error undefined".
CustomErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 500
  return { statusCode }
}

export default CustomErrorPage
