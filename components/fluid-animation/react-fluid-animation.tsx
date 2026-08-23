import raf from 'raf'
import * as React from 'react'

import FluidAnimation, { defaultConfig } from './fluid-animation'

type ReactFluidAnimationProps = React.HTMLAttributes<HTMLDivElement> & {
  animationRef?: (animation: FluidAnimation | null) => void
  config?: any
  onActiveChange?: (active: boolean) => void
}

export function ReactFluidAnimation({
  config = defaultConfig,
  style,
  animationRef,
  onActiveChange,
  ...rest
}: ReactFluidAnimationProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const instanceRef = React.useRef<FluidAnimation | null>(null)
  const notifyAnimationRef = React.useEffectEvent(
    (animation: FluidAnimation | null) => animationRef?.(animation)
  )
  const notifyActiveChange = React.useEffectEvent((active: boolean) =>
    onActiveChange?.(active)
  )

  const onMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      event.preventDefault()
      instanceRef.current?.onMouseDown()
    },
    []
  )

  const onMouseMove = React.useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      event.preventDefault()
      instanceRef.current?.onMouseMove(event.nativeEvent)
    },
    []
  )

  const onMouseUp = React.useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      event.preventDefault()
      instanceRef.current?.onMouseUp()
    },
    []
  )

  const onTouchStart = React.useCallback(
    (event: React.TouchEvent<HTMLCanvasElement>) => {
      event.preventDefault()
      instanceRef.current?.onTouchStart(event.nativeEvent)
    },
    []
  )

  const onTouchMove = React.useCallback(
    (event: React.TouchEvent<HTMLCanvasElement>) => {
      event.preventDefault()
      instanceRef.current?.onTouchMove(event.nativeEvent)
    },
    []
  )

  const onTouchEnd = React.useCallback(
    (event: React.TouchEvent<HTMLCanvasElement>) => {
      event.preventDefault()
      instanceRef.current?.onTouchEnd(event.nativeEvent)
    },
    []
  )

  React.useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const initialBounds = container.getBoundingClientRect()
    let layoutWidth = initialBounds.width
    let layoutHeight = initialBounds.height
    let canvasSizeInitialized = layoutWidth > 0 && layoutHeight > 0

    if (canvasSizeInitialized) {
      canvas.width = Math.max(1, Math.trunc(layoutWidth))
      canvas.height = Math.max(1, Math.trunc(layoutHeight))
    }

    const animation = new FluidAnimation({ canvas, config })
    instanceRef.current = animation
    notifyAnimationRef(animation)

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frameId: number | null = null
    let isDisposed = false
    let isIntersecting = true
    let isDocumentVisible = document.visibilityState !== 'hidden'
    let prefersReducedMotion = motionQuery.matches
    let isActive = false
    let reportedActivity: boolean | undefined
    let needsStaticFrame = true

    const hasLayoutSize = () => layoutWidth > 0 && layoutHeight > 0

    const syncCanvasSize = () => {
      if (!hasLayoutSize()) return false

      const width = Math.max(1, Math.trunc(layoutWidth))
      const height = Math.max(1, Math.trunc(layoutHeight))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        animation.resize()
        needsStaticFrame = true
      }

      canvasSizeInitialized = true
      return true
    }

    const stop = () => {
      if (frameId === null) return

      raf.cancel(frameId)
      frameId = null
    }

    const frame = () => {
      frameId = null
      if (!isActive || isDisposed) return

      animation.update()
      needsStaticFrame = false
      frameId = raf(frame)
    }

    const start = () => {
      if (frameId !== null || isDisposed) return

      frameId = raf(frame)
    }

    const reportActivity = (active: boolean) => {
      if (reportedActivity === active) return

      reportedActivity = active
      notifyActiveChange(active)
    }

    const syncActivity = () => {
      const canDisplay = isIntersecting && isDocumentVisible && hasLayoutSize()
      const canAnimate = canDisplay && !prefersReducedMotion

      if (canAnimate || (!canvasSizeInitialized && canDisplay)) {
        syncCanvasSize()
      }

      isActive = canAnimate && canvasSizeInitialized
      reportActivity(isActive)

      if (isActive) {
        start()
      } else {
        stop()
      }

      if (
        canDisplay &&
        prefersReducedMotion &&
        canvasSizeInitialized &&
        needsStaticFrame
      ) {
        animation.update()
        needsStaticFrame = false
      }
    }

    const handleMotionPreference = () => {
      prefersReducedMotion = motionQuery.matches
      syncActivity()
    }

    const handleVisibility = () => {
      isDocumentVisible = document.visibilityState !== 'hidden'
      syncActivity()
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (entry) {
        layoutWidth = entry.contentRect.width
        layoutHeight = entry.contentRect.height
      }

      syncActivity()
    })
    resizeObserver.observe(container)

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isIntersecting = entry?.isIntersecting ?? true
      syncActivity()
    })
    intersectionObserver.observe(container)

    motionQuery.addEventListener('change', handleMotionPreference)
    document.addEventListener('visibilitychange', handleVisibility)
    syncActivity()

    return () => {
      isDisposed = true
      isActive = false
      stop()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      motionQuery.removeEventListener('change', handleMotionPreference)
      document.removeEventListener('visibilitychange', handleVisibility)
      reportActivity(false)
      notifyAnimationRef(null)
      if (instanceRef.current === animation) instanceRef.current = null
      animation.dispose()
    }
  }, [config])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style
      }}
      {...rest}
      ref={containerRef}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  )
}
