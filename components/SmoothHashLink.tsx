'use client'

import type {
  ComponentPropsWithoutRef,
  MouseEvent as ReactMouseEvent
} from 'react'
import { useCallback } from 'react'

export type SmoothHashLinkProps = Omit<
  ComponentPropsWithoutRef<'a'>,
  'href'
> & {
  href: `#${string}`
}

export function SmoothHashLink({
  href,
  onClick,
  ...props
}: SmoothHashLinkProps) {
  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>) => {
      onClick?.(event)

      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.currentTarget.target === '_blank'
      ) {
        return
      }

      const targetId = decodeURIComponent(href.slice(1))
      const target = document.getElementById(targetId)
      if (!target) return

      event.preventDefault()

      if (window.location.hash !== href) {
        window.history.pushState(window.history.state, '', href)
      }

      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)')
        .matches
        ? 'auto'
        : 'smooth'

      window.requestAnimationFrame(() => {
        if (target.isConnected) {
          target.scrollIntoView({ behavior, block: 'start' })
        }
      })
    },
    [href, onClick]
  )

  return <a href={href} onClick={handleClick} {...props} />
}
