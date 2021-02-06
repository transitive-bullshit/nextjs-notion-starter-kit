// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import getGLContext from './get-gl-context'
import GLProgram from './gl-program'
import shaders from './shaders'

export const defaultConfig = {
  textureDownsample: 1,
  densityDissipation: 0.98,
  velocityDissipation: 0.99,
  pressureDissipation: 0.8,
  pressureIterations: 25,
  curl: 30,
  splatRadius: 0.005
}

class Pointer {
  constructor() {
    this.id = -1
    this.x = 0
    this.y = 0
    this.dx = 0
    this.dy = 0
    this.down = false
    this.moved = false
    this.color = [30, 0, 300]
  }
}

export default class FluidAnimation {
  constructor(opts) {
    const {
      canvas,
      config = {
        ...defaultConfig,
        ...opts.config
      }
    } = opts

    this._canvas = canvas
    this._config = config

    this._pointers = [new Pointer()]
    this._splatStack = []

    const { gl, ext } = getGLContext(canvas)
    this._gl = gl
    this._ext = ext

    this._initPrograms()
    this._initBlit()
    this.resize()

    this._time = Date.now()
    this._timer = 0
  }

  get config() {
    return this._config
  }

  set config(config) {
    this._config = config
  }

  get width() {
    return this._canvas.width
  }

  get height() {
    return this._canvas.height
  }

  addSplat(splat) {
    this._splatStack.push([splat])
  }

  addSplats(splats) {
    this._splatStack.push(Array.isArray(splats) ? splats : [splats])
  }

  addRandomSplats(count) {
    const splats = []

    for (let i = 0; i < count; ++i) {
      splats.push(this._getRandomSplat())
    }

    this.addSplats(splats)
  }

  resize() {
    const { width, height } = this._canvas

    if (this._width !== width || this._height !== height) {
      this._width = width
      this._height = height

      this._initFramebuffers()
    }
  }

  onMouseMove = (e) => {
    this._pointers[0].moved = this._pointers[0].down
    this._pointers[0].dx = (e.offsetX - this._pointers[0].x) * 10.0
    this._pointers[0].dy = (e.offsetY - this._pointers[0].y) * 10.0
    this._pointers[0].x = e.offsetX
    this._pointers[0].y = e.offsetY
  }

  onMouseDown = () => {
    this._pointers[0].down = true
    this._pointers[0].color = [
      Math.random() + 0.2,
      Math.random() + 0.2,
      Math.random() + 0.2
    ]
  }

  onMouseUp = () => {
    this._pointers[0].down = false
  }

  onTouchStart = (e) => {
    for (let i = 0; i < e.touches.length; ++i) {
      this._pointers[i].down = true
      this._pointers[i].color = [
        Math.random() + 0.2,
        Math.random() + 0.2,
        Math.random() + 0.2
      ]
    }
  }

  onTouchMove = (e) => {
    for (let i = 0; i < e.touches.length; ++i) {
      const touch = e.touches[i]
      this._pointers[i].moved = this._pointers[i].down
      this._pointers[i].dx = (touch.clientX - this._pointers[i].x) * 10.0
      this._pointers[i].dy = (touch.clientY - this._pointers[i].y) * 10.0
      this._pointers[i].x = touch.clientX
      this._pointers[i].y = touch.clientY
    }
  }

  onTouchEnd = (e) => {
    for (let i = 0; i < e.touches.length; ++i) {
      this._pointers[i].down = false
    }
  }

  _initPrograms() {
    const gl = this._gl
    const ext = this._ext

    this._programs = {}
    this._programs.clear = new GLProgram(gl, shaders.vert, shaders.clear)
    this._programs.display = new GLProgram(gl, shaders.vert, shaders.display)
    this._programs.splat = new GLProgram(gl, shaders.vert, shaders.splat)
    this._programs.advection = new GLProgram(
      gl,
      shaders.vert,
      ext.supportLinearFiltering
        ? shaders.advection
        : shaders.advectionManualFiltering
    )
    this._programs.divergence = new GLProgram(
      gl,
      shaders.vert,
      shaders.divergence
    )
    this._programs.curl = new GLProgram(gl, shaders.vert, shaders.curl)
    this._programs.vorticity = new GLProgram(
      gl,
      shaders.vert,
      shaders.vorticity
    )
    this._programs.pressure = new GLProgram(gl, shaders.vert, shaders.pressure)
    this._programs.gradientSubtract = new GLProgram(
      gl,
      shaders.vert,
      shaders.gradientSubtract
    )
  }

  _initFramebuffers() {
    const gl = this._gl
    const ext = this._ext

    function createFBO(texId, w, h, internalFormat, format, type, param) {
      gl.activeTexture(gl.TEXTURE0 + texId)
      const texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        w,
        h,
        0,
        format,
        type,
        null
      )

      const fbo = gl.createFramebuffer()
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      )
      gl.viewport(0, 0, w, h)
      gl.clear(gl.COLOR_BUFFER_BIT)

      return [texture, fbo, texId]
    }

    function createDoubleFBO(texId, w, h, internalFormat, format, type, param) {
      let fbo1 = createFBO(texId, w, h, internalFormat, format, type, param)
      let fbo2 = createFBO(texId + 1, w, h, internalFormat, format, type, param)

      return {
        get read() {
          return fbo1
        },
        get write() {
          return fbo2
        },
        swap() {
          const temp = fbo1
          fbo1 = fbo2
          fbo2 = temp
        }
      }
    }

    this._textureWidth = gl.drawingBufferWidth >> this._config.textureDownsample
    this._textureHeight =
      gl.drawingBufferHeight >> this._config.textureDownsample

    const texType = ext.halfFloatTexType
    const rgba = ext.formatRGBA
    const rg = ext.formatRG
    const r = ext.formatR

    this._density = createDoubleFBO(
      2,
      this._textureWidth,
      this._textureHeight,
      rgba.internalFormat,
      rgba.format,
      texType,
      ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST
    )

    this._velocity = createDoubleFBO(
      0,
      this._textureWidth,
      this._textureHeight,
      rg.internalFormat,
      rg.format,
      texType,
      ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST
    )

    this._divergence = createFBO(
      4,
      this._textureWidth,
      this._textureHeight,
      r.internalFormat,
      r.format,
      texType,
      gl.NEAREST
    )

    this._curl = createFBO(
      5,
      this._textureWidth,
      this._textureHeight,
      r.internalFormat,
      r.format,
      texType,
      gl.NEAREST
    )

    this._pressure = createDoubleFBO(
      6,
      this._textureWidth,
      this._textureHeight,
      r.internalFormat,
      r.format,
      texType,
      gl.NEAREST
    )
  }

  _initBlit() {
    const gl = this._gl

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW
    )
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      gl.STATIC_DRAW
    )
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)
  }

  _blit = (destination) => {
    const gl = this._gl
    gl.bindFramebuffer(gl.FRAMEBUFFER, destination)
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
  }

  _splat(x, y, dx, dy, color) {
    const gl = this._gl

    this._programs.splat.bind()
    gl.uniform1i(this._programs.splat.uniforms.uTarget, this._velocity.read[2])
    gl.uniform1f(
      this._programs.splat.uniforms.aspectRatio,
      this._canvas.width / this._canvas.height
    )
    gl.uniform2f(
      this._programs.splat.uniforms.point,
      x / this._canvas.width,
      1.0 - y / this._canvas.height
    )
    gl.uniform3f(this._programs.splat.uniforms.color, dx, -dy, 1.0)
    gl.uniform1f(this._programs.splat.uniforms.radius, this._config.splatRadius)
    this._blit(this._velocity.write[1])
    this._velocity.swap()

    gl.uniform1i(this._programs.splat.uniforms.uTarget, this._density.read[2])
    gl.uniform3f(
      this._programs.splat.uniforms.color,
      color[0] * 0.3,
      color[1] * 0.3,
      color[2] * 0.3
    )
    this._blit(this._density.write[1])
    this._density.swap()
  }

  _addSplat(splat) {
    const { x, y, dx, dy, color } = splat

    if (x === undefined) return
    if (y === undefined) return
    if (dx === undefined) return
    if (dy === undefined) return
    if (color === undefined) return

    this._splat(x, y, dx, dy, color)
  }

  _addSplats(splats) {
    for (const splat of splats) {
      this._addSplat(splat)
    }
  }

  _getRandomSplat() {
    const color = [Math.random() * 10, Math.random() * 10, Math.random() * 10]
    const x = this._canvas.width * Math.random()
    const y = this._canvas.height * Math.random()
    const dx = 1000 * (Math.random() - 0.5)
    const dy = 1000 * (Math.random() - 0.5)

    return { x, y, dx, dy, color }
  }

  update() {
    const gl = this._gl

    const dt = Math.min((Date.now() - this._time) / 1000, 0.016)
    this._time = Date.now()
    this._timer += 0.0001

    const w = this._textureWidth
    const h = this._textureHeight
    const iW = 1.0 / w
    const iH = 1.0 / h

    gl.viewport(0, 0, w, h)

    if (this._splatStack.length > 0) {
      this._addSplats(this._splatStack.pop())
    }

    this._programs.advection.bind()
    gl.uniform2f(this._programs.advection.uniforms.texelSize, iW, iH)
    gl.uniform1i(
      this._programs.advection.uniforms.uVelocity,
      this._velocity.read[2]
    )
    gl.uniform1i(
      this._programs.advection.uniforms.uSource,
      this._velocity.read[2]
    )
    gl.uniform1f(this._programs.advection.uniforms.dt, dt)
    gl.uniform1f(
      this._programs.advection.uniforms.dissipation,
      this._config.velocityDissipation
    )
    this._blit(this._velocity.write[1])
    this._velocity.swap()

    gl.uniform1i(
      this._programs.advection.uniforms.uVelocity,
      this._velocity.read[2]
    )
    gl.uniform1i(
      this._programs.advection.uniforms.uSource,
      this._density.read[2]
    )
    gl.uniform1f(
      this._programs.advection.uniforms.dissipation,
      this._config.densityDissipation
    )
    this._blit(this._density.write[1])
    this._density.swap()

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this._pointers.length; i++) {
      const pointer = this._pointers[i]
      if (pointer.moved) {
        this._splat(pointer.x, pointer.y, pointer.dx, pointer.dy, pointer.color)
        pointer.moved = false
      }
    }

    this._programs.curl.bind()
    gl.uniform2f(this._programs.curl.uniforms.texelSize, iW, iH)
    gl.uniform1i(this._programs.curl.uniforms.uVelocity, this._velocity.read[2])
    this._blit(this._curl[1])

    this._programs.vorticity.bind()
    gl.uniform2f(this._programs.vorticity.uniforms.texelSize, iW, iH)
    gl.uniform1i(
      this._programs.vorticity.uniforms.uVelocity,
      this._velocity.read[2]
    )
    gl.uniform1i(this._programs.vorticity.uniforms.uCurl, this._curl[2])
    gl.uniform1f(this._programs.vorticity.uniforms.curl, this._config.curl)
    gl.uniform1f(this._programs.vorticity.uniforms.dt, dt)
    this._blit(this._velocity.write[1])
    this._velocity.swap()

    this._programs.divergence.bind()
    gl.uniform2f(this._programs.divergence.uniforms.texelSize, iW, iH)
    gl.uniform1i(
      this._programs.divergence.uniforms.uVelocity,
      this._velocity.read[2]
    )
    this._blit(this._divergence[1])

    this._programs.clear.bind()
    let pressureTexId = this._pressure.read[2]
    gl.activeTexture(gl.TEXTURE0 + pressureTexId)
    gl.bindTexture(gl.TEXTURE_2D, this._pressure.read[0])
    gl.uniform1i(this._programs.clear.uniforms.uTexture, pressureTexId)
    gl.uniform1f(
      this._programs.clear.uniforms.value,
      this._config.pressureDissipation
    )
    this._blit(this._pressure.write[1])
    this._pressure.swap()

    this._programs.pressure.bind()
    gl.uniform2f(this._programs.pressure.uniforms.texelSize, iW, iH)
    gl.uniform1i(
      this._programs.pressure.uniforms.uDivergence,
      this._divergence[2]
    )
    pressureTexId = this._pressure.read[2]
    gl.uniform1i(this._programs.pressure.uniforms.uPressure, pressureTexId)
    gl.activeTexture(gl.TEXTURE0 + pressureTexId)
    for (let i = 0; i < this._config.pressureIterations; i++) {
      gl.bindTexture(gl.TEXTURE_2D, this._pressure.read[0])
      this._blit(this._pressure.write[1])
      this._pressure.swap()
    }

    this._programs.gradientSubtract.bind()
    gl.uniform2f(this._programs.gradientSubtract.uniforms.texelSize, iW, iH)
    gl.uniform1i(
      this._programs.gradientSubtract.uniforms.uPressure,
      this._pressure.read[2]
    )
    gl.uniform1i(
      this._programs.gradientSubtract.uniforms.uVelocity,
      this._velocity.read[2]
    )
    this._blit(this._velocity.write[1])
    this._velocity.swap()

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    this._programs.display.bind()
    gl.uniform1i(
      this._programs.display.uniforms.uTexture,
      this._density.read[2]
    )
    this._blit(null)
  }
}
