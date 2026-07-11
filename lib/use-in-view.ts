import * as React from 'react'

/**
 * useInView — observe an element and report when it intersects the
 * viewport. By default the observer disconnects once seen (one-shot);
 * pass `once: false` to keep tracking as the element enters and leaves.
 *
 *   Useful for kicking off entrance animations only when the element
 *   actually scrolls into view, or (continuous mode) pausing looping
 *   animations while it's off-screen.
 */
export function useInView<T extends HTMLElement>(
  opts?: IntersectionObserverInit & { once?: boolean }
) {
  const ref = React.useRef<T>(null)
  const [inView, setInView] = React.useState(false)
  const optsRef = React.useRef(opts)
  optsRef.current = opts

  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    const { once = true, ...observerOpts } = optsRef.current ?? {}
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold: 0.3, ...observerOpts }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, inView] as const
}
