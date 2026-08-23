import { describe, expect, it, vi } from 'vitest'

import FluidAnimation, { defaultConfig } from './fluid-animation'

type MockFunction = (...args: any[]) => any

function mockFunction<T extends MockFunction = () => void>(implementation?: T) {
  return vi.fn<T>(implementation)
}

function createWebGLHarness() {
  let resourceId = 0
  const createResource = () => ({ id: ++resourceId })
  const gl: Record<string, any> = {
    ACTIVE_UNIFORMS: 1,
    ARRAY_BUFFER: 2,
    COLOR_ATTACHMENT0: 3,
    COLOR_BUFFER_BIT: 4,
    COMPILE_STATUS: 5,
    ELEMENT_ARRAY_BUFFER: 6,
    FLOAT: 7,
    FRAGMENT_SHADER: 8,
    FRAMEBUFFER: 9,
    FRAMEBUFFER_COMPLETE: 10,
    HALF_FLOAT: 11,
    LINEAR: 12,
    LINK_STATUS: 13,
    NEAREST: 14,
    R16F: 15,
    RED: 16,
    RG: 17,
    RG16F: 18,
    RGBA: 19,
    RGBA16F: 20,
    STATIC_DRAW: 21,
    TEXTURE0: 22,
    TEXTURE_2D: 23,
    TEXTURE_MAG_FILTER: 24,
    TEXTURE_MIN_FILTER: 25,
    TEXTURE_WRAP_S: 26,
    TEXTURE_WRAP_T: 27,
    TRIANGLES: 28,
    UNSIGNED_SHORT: 29,
    VERTEX_SHADER: 30,
    activeTexture: mockFunction(),
    attachShader: mockFunction(),
    bindBuffer: mockFunction(),
    bindFramebuffer: mockFunction(),
    bindTexture: mockFunction(),
    bufferData: mockFunction(),
    checkFramebufferStatus: mockFunction(() => 10),
    clear: mockFunction(),
    clearColor: mockFunction(),
    compileShader: mockFunction(),
    createBuffer: mockFunction(createResource),
    createFramebuffer: mockFunction(createResource),
    createProgram: mockFunction(createResource),
    createShader: mockFunction(createResource),
    createTexture: mockFunction(createResource),
    deleteBuffer: mockFunction(),
    deleteFramebuffer: mockFunction(),
    deleteProgram: mockFunction(),
    deleteShader: mockFunction(),
    deleteTexture: mockFunction(),
    drawElements: mockFunction(),
    enableVertexAttribArray: mockFunction(),
    framebufferTexture2D: mockFunction(),
    getActiveUniform: mockFunction(),
    getExtension: mockFunction(() => ({})),
    getProgramInfoLog: mockFunction(() => ''),
    getProgramParameter: mockFunction((_program: unknown, parameter: number) =>
      parameter === 1 ? 0 : true
    ),
    getShaderInfoLog: mockFunction(() => ''),
    getShaderParameter: mockFunction(() => true),
    getUniformLocation: mockFunction(),
    linkProgram: mockFunction(),
    shaderSource: mockFunction(),
    texImage2D: mockFunction(),
    texParameteri: mockFunction(),
    uniform1f: mockFunction(),
    uniform1i: mockFunction(),
    uniform2f: mockFunction(),
    uniform3f: mockFunction(),
    useProgram: mockFunction(),
    vertexAttribPointer: mockFunction(),
    viewport: mockFunction()
  }
  const canvas = {
    getContext: mockFunction(() => gl),
    height: 360,
    width: 640
  }

  return { canvas, gl }
}

describe('FluidAnimation disposal', () => {
  it('releases replaced and active WebGL resources exactly once', () => {
    const { canvas, gl } = createWebGLHarness()
    const animation = new FluidAnimation({ canvas, config: defaultConfig })

    expect(gl.deleteShader).toHaveBeenCalledTimes(18)
    expect(gl.deleteFramebuffer).toHaveBeenCalledTimes(3)
    expect(gl.deleteTexture).toHaveBeenCalledTimes(3)

    canvas.width = 800
    animation.resize()

    expect(gl.deleteFramebuffer).toHaveBeenCalledTimes(11)
    expect(gl.deleteTexture).toHaveBeenCalledTimes(11)

    animation.dispose()

    expect(gl.deleteBuffer).toHaveBeenCalledTimes(2)
    expect(gl.deleteFramebuffer).toHaveBeenCalledTimes(19)
    expect(gl.deleteProgram).toHaveBeenCalledTimes(9)
    expect(gl.deleteTexture).toHaveBeenCalledTimes(19)

    animation.dispose()
    animation.addRandomSplats(1)
    animation.update()
    canvas.width = 900
    animation.resize()

    expect(gl.createFramebuffer).toHaveBeenCalledTimes(19)
    expect(gl.deleteBuffer).toHaveBeenCalledTimes(2)
    expect(gl.deleteFramebuffer).toHaveBeenCalledTimes(19)
    expect(gl.deleteProgram).toHaveBeenCalledTimes(9)
    expect(gl.deleteTexture).toHaveBeenCalledTimes(19)
    expect(gl.drawElements).not.toHaveBeenCalled()
  })
})
