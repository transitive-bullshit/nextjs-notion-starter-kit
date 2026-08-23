// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
function compileShader(gl, type, source) {
  const shader = gl.createShader(type)
  if (!shader) {
    throw new Error('Unable to create WebGL shader')
  }

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message =
      gl.getShaderInfoLog(shader) || 'Unable to compile WebGL shader'
    gl.deleteShader(shader)
    throw new Error(message)
  }

  return shader
}

export default class GLProgram {
  constructor(gl, vertexSource, fragmentSource) {
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource)
    let fragmentShader

    this.uniforms = {}
    this.gl = gl

    try {
      fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
      this.program = gl.createProgram()
      if (!this.program) {
        throw new Error('Unable to create WebGL program')
      }

      gl.attachShader(this.program, vertexShader)
      gl.attachShader(this.program, fragmentShader)
      gl.linkProgram(this.program)

      if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        throw new Error(
          gl.getProgramInfoLog(this.program) || 'Unable to link WebGL program'
        )
      }

      const uniformCount = gl.getProgramParameter(
        this.program,
        gl.ACTIVE_UNIFORMS
      )

      for (let i = 0; i < uniformCount; i++) {
        const uniformName = gl.getActiveUniform(this.program, i).name
        this.uniforms[uniformName] = gl.getUniformLocation(
          this.program,
          uniformName
        )
      }
    } catch (err) {
      if (this.program) {
        gl.deleteProgram(this.program)
        this.program = null
      }

      throw err
    } finally {
      gl.deleteShader(vertexShader)
      if (fragmentShader) gl.deleteShader(fragmentShader)
    }
  }

  bind() {
    this.gl.useProgram(this.program)
  }

  dispose() {
    if (!this.program) return

    this.gl.deleteProgram(this.program)
    this.program = null
    this.uniforms = {}
  }
}
