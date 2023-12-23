import React, { FC } from 'react'
import Link from 'next/link'

type NextLinkProps = {
  href: string
  className?: string
  children: React.ReactNode
}

const PageLink: FC<NextLinkProps> = ({ href, className, children }) => {
  return (
    <Link href={href} passHref>
      <a className={className}>
        {children}
      </a>
    </Link>
  )
}

export default PageLink
