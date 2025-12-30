import Link from 'next/link'
import * as React from 'react'

type Props = React.PropsWithChildren<{
  href: string
  className?: string
  target?: string
  rel?: string
  [key: string]: any
}>

export function NextLink({ href, children, ...rest }: Props) {
  return (
    <Link href={href} legacyBehavior passHref>
      <a {...rest}>{children}</a>
    </Link>
  )
}
