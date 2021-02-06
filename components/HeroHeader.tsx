import React, { Component } from 'react'

import raf from 'raf'
import random from 'random'

import FluidAnimation from 'react-fluid-animation'

const minSplatRadius = 0.01
const maxSplatRadius = 0.03

export class HeroHeader extends Component<{
  className?: string
}> {
  _time: number
  _direction: number
  _tickRaf: any
  _animation: any

  componentDidMount() {
    this._reset()
    this._tick()
  }

  componentWillMount() {
    this._time = Date.now()
    this._direction = 1
  }

  componentWillUnmount() {
    if (this._tickRaf) {
      raf.cancel(this._tickRaf)
      this._tickRaf = null
    }
  }

  render() {
    return (
      <FluidAnimation
        className={this.props.className}
        animationRef={this._animationRef}
      />
    )
  }

  _animationRef = (ref) => {
    this._animation = ref
    this._reset()
  }

  _reset() {
    if (this._animation) {
      this._animation.config.splatRadius = random.float(
        minSplatRadius,
        maxSplatRadius
      )
      this._animation.addRandomSplats(random.int(100, 180))
    }
  }

  _tick = () => {
    // TODO: make this more efficient
    if (this._animation && random.float() < 0.15) {
      const w = this._animation.width
      const h = this._animation.height

      this._animation.config.splatRadius = random.float(
        minSplatRadius,
        maxSplatRadius
      )

      const splats = []
      for (let i = 0; i < 1; ++i) {
        const color = [random.float(10), random.float(10), random.float(10)]

        const w0 = w / 3.0
        const w1 = (w * 2.0) / 3.0

        const h0 = h / 3.0
        const h1 = (h * 2.0) / 3.0

        while (true) {
          const x = random.float(w)
          const y = random.float(h)
          if (x > w0 && x < w1 && y > h0 && y < h1) {
            continue
          }

          const dx = random.float(-1, 1) * random.float(200, 3000)
          const dy = random.float(-1, 1) * random.float(200, 3000)
          const splat = { x, y, dx, dy, color }
          splats.push(splat)
          break
        }

        // const t = random.float(2 * Math.PI)
        // const cos = Math.cos(t)
        // const sin = Math.sin(t)
        // const x = w / 2 + r * cos
        // const y = h / 2 + r * sin + yOffset
        // const k = random.float() > 0.98 ? random.float(3, 10) : 1
        // const dx = k * random.float(-1, 1) * random.float(50, 300) * cos
        // const dy = k * random.float(-1, 1) * random.float(50, 300) * sin
        // const splat = { x, y, dx, dy, color }
        // splats.push(splat)
      }

      this._animation.addSplats(splats)
    }

    this._tickRaf = raf(this._tick)
  }
}
