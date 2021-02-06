'use client'

import { useEffect } from 'react'

const bottomAttribute = 'data-toc-at-bottom'
const bottomEpsilon = 4

export function TableOfContentsBottomState({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    const root = document.documentElement
    if (!enabled) {
      root.removeAttribute(bottomAttribute)
      return
    }

    let frameId: number | undefined
    const update = () => {
      frameId = undefined

      const documentHeight = Math.max(
        root.scrollHeight,
        document.body.scrollHeight
      )
      const isScrollable = documentHeight > window.innerHeight + bottomEpsilon
      const isAtBottom =
        isScrollable &&
        Math.ceil(window.scrollY + window.innerHeight) >=
          documentHeight - bottomEpsilon

      root.toggleAttribute(bottomAttribute, isAtBottom)
    }
    const scheduleUpdate = () => {
      if (frameId !== undefined) return
      frameId = window.requestAnimationFrame(update)
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })

    const resizeObserver = new ResizeObserver(scheduleUpdate)
    resizeObserver.observe(document.body)
    scheduleUpdate()

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      resizeObserver.disconnect()
      if (frameId !== undefined) window.cancelAnimationFrame(frameId)
      root.removeAttribute(bottomAttribute)
    }
  }, [enabled])

  return null
}
