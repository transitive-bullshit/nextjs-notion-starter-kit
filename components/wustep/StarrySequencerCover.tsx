'use client'

import * as React from 'react'

/**
 * StarrySequencerCover
 *
 *   The cover is a still poster at rest and animates while hovered (pointer
 *   devices), focused (keyboard), or — on touch, where a tap on the card just
 *   navigates — while it holds the playground grid's spotlight.
 *   Animated WebP can't be paused via the DOM, so we swap the <img> src:
 *   poster ⇄ animated WebP. Re-assigning the animated src restarts it from
 *   the first frame, so each play runs the loop fresh. Honors reduced motion
 *   by staying on the poster.
 */

const POSTER = '/playground/covers/starry-sequencer-poster.webp'
const ANIMATED = '/playground/covers/starry-sequencer.webp'

export function StarrySequencerCover() {
  const imgRef = React.useRef<HTMLImageElement>(null)

  React.useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)')
    const hoverTarget = img.closest('.group') ?? img

    const play = () => {
      if (reduceMotion.matches) return
      img.src = ANIMATED
    }
    const stop = () => {
      img.src = POSTER
    }

    // Hover drives playback on pointer devices...
    const cell = img.closest<HTMLElement>('[data-cover-cell]')
    let attributes: MutationObserver | undefined
    if (canHover.matches) {
      hoverTarget.addEventListener('pointerenter', play)
      hoverTarget.addEventListener('pointerleave', stop)
    } else if (cell) {
      // ...and on touch the playground grid spotlights one cover at a time
      // (data-cover-awake — pages/playground/index.tsx). The CSS covers read
      // that attribute directly; an animated WebP can't be driven from CSS,
      // so watch it instead and stay in step with the rest of the grid.
      const sync = () => ('coverAwake' in cell.dataset ? play() : stop())
      attributes = new MutationObserver(sync)
      attributes.observe(cell, {
        attributes: true,
        attributeFilter: ['data-cover-awake']
      })
      sync()
    }
    // Focus drives it everywhere, for keyboard.
    hoverTarget.addEventListener('focusin', play)
    hoverTarget.addEventListener('focusout', stop)

    return () => {
      attributes?.disconnect()
      hoverTarget.removeEventListener('pointerenter', play)
      hoverTarget.removeEventListener('pointerleave', stop)
      hoverTarget.removeEventListener('focusin', play)
      hoverTarget.removeEventListener('focusout', stop)
    }
  }, [])

  return (
    <img
      ref={imgRef}
      src={POSTER}
      alt='Starry Night Sequencer cover'
      loading='lazy'
      className='h-full w-full object-cover transition-transform duration-[250ms] ease-out'
    />
  )
}
