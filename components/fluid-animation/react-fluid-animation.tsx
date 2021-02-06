import raf from 'raf'
import React from 'react'
import { useMeasure } from 'react-use'

import FluidAnimation, { defaultConfig } from './fluid-animation'

export function ReactFluidAnimation({
  config = defaultConfig,
  style,
  animationRef,
  ...rest
}: {
  config?: any
  animationRef?: any
  style?: any
  className?: string
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const tickRef = React.useRef<number | null>(null)
  const [animation, setAnimation] = React.useState<FluidAnimation | null>(null)
  const [measureRef, { width, height }] = useMeasure()

  const onMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      event.preventDefault()
      animation?.onMouseDown()
    },
    [animation]
  )

  const onMouseMove = React.useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      event.preventDefault()
      animation?.onMouseMove(event.nativeEvent)
    },
    [animation]
  )

  const onMouseUp = React.useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      event.preventDefault()
      animation?.onMouseUp()
    },
    [animation]
  )

  const onTouchStart = React.useCallback(
    (event: React.TouchEvent<HTMLCanvasElement>) => {
      event.preventDefault()
      animation?.onTouchStart(event.nativeEvent)
    },
    [animation]
  )

  const onTouchMove = React.useCallback(
    (event: React.TouchEvent<HTMLCanvasElement>) => {
      event.preventDefault()
      animation?.onTouchMove(event.nativeEvent)
    },
    [animation]
  )

  const onTouchEnd = React.useCallback(
    (event: React.TouchEvent<HTMLCanvasElement>) => {
      event.preventDefault()
      animation?.onTouchEnd(event.nativeEvent)
    },
    [animation]
  )

  const tick = React.useCallback(() => {
    if (!animation) {
      tickRef.current = null
      return
    }

    animation.update()
    tickRef.current = raf(tick)
  }, [animation])

  React.useEffect(() => {
    if (canvasRef.current && width > 0 && height > 0) {
      console.log('resize', width, height)

      canvasRef.current.width = Math.trunc(width)
      canvasRef.current.height = Math.trunc(height)

      animation?.resize()
    }
  }, [animation, width, height])

  React.useEffect(() => {
    if (canvasRef.current) {
      setAnimation(
        new FluidAnimation({
          canvas: canvasRef.current,
          config
        })
      )
    }
  }, [canvasRef, config])

  React.useEffect(() => {
    if (animation) {
      animation!.resize()
      animationRef?.(animation!)
      if (!tickRef.current) {
        tick()
      }
    }
  }, [animation, animationRef, tick])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style
      }}
      {...rest}
      ref={measureRef as any}
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
