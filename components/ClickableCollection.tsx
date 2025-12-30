import { useRouter } from 'next/router'
import * as React from 'react'

import { isHiddenTag, tagToSlug } from '@/lib/tags'

const TAG_SELECTOR = '.notion-property-multi_select .notion-property-select'

export function ClickableCollection(props: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter()
  const rootRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const rootEl = rootRef.current
    if (!rootEl) return

    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement | null
      if (!target) return

      const pill = target.closest<HTMLElement>(TAG_SELECTOR)
      if (!pill || !rootEl.contains(pill)) {
        return
      }

      const tag = pill.textContent?.trim()
      if (!tag || isHiddenTag(tag)) {
        return
      }

      const slug = tagToSlug(tag)
      if (!slug) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      void router.push(`/tag/${slug}`)
    }

    rootEl.addEventListener('click', handleClick, true)

    return () => {
      rootEl.removeEventListener('click', handleClick, true)
    }
  }, [router])

  return <div ref={rootRef} {...props} />
}
