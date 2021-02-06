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
  const renderInteractionFrameRef = React.useRef<() => void>(() => undefined)
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
      renderInteractionFrameRef.current()
    },
    []
  )

  const onMouseMove = React.useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      event.preventDefault()
      instanceRef.current?.onMouseMove(event.nativeEvent)
      renderInteractionFrameRef.current()
    },
    []
  )

  const onMouseUp = React.useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      event.preventDefault()
      instanceRef.current?.onMouseUp()
      renderInteractionFrameRef.current()
    },
    []
  )

  const onTouchStart = React.useCallback(
    (event: React.TouchEvent<HTMLCanvasElement>) => {
      instanceRef.current?.onTouchStart(event.nativeEvent)
      renderInteractionFrameRef.current()
    },
    []
  )

  const onTouchMove = React.useCallback(
    (event: React.TouchEvent<HTMLCanvasElement>) => {
      instanceRef.current?.onTouchMove(event.nativeEvent)
      renderInteractionFrameRef.current()
    },
    []
  )

  const onTouchEnd = React.useCallback(
    (event: React.TouchEvent<HTMLCanvasElement>) => {
      instanceRef.current?.onTouchEnd(event.nativeEvent)
      renderInteractionFrameRef.current()
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

    let frameId: number | null = null
    let isDisposed = false
    let isDocumentVisible = document.visibilityState !== 'hidden'
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
      const canDisplay = isDocumentVisible && hasLayoutSize()
      const canAnimate = canDisplay

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

      if (canDisplay && canvasSizeInitialized && needsStaticFrame) {
        animation.update()
        needsStaticFrame = false
      }
    }

    renderInteractionFrameRef.current = () => {
      if (isDisposed || isActive || !isDocumentVisible || !hasLayoutSize()) {
        return
      }

      syncCanvasSize()
      animation.update()
      needsStaticFrame = false
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

    document.addEventListener('visibilitychange', handleVisibility)
    syncActivity()

    return () => {
      isDisposed = true
      isActive = false
      stop()
      renderInteractionFrameRef.current = () => undefined
      resizeObserver.disconnect()
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
        aria-hidden='true'
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          width: '100%',
          height: '100%',
          touchAction: 'pan-y'
        }}
      />
    </div>
  )
}
