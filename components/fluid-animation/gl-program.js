// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
function compileShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(shader)
  }

  return shader
}

export default class GLProgram {
  constructor(gl, vertexSource, fragmentSource) {
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource)
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource)

    this.uniforms = {}
    this.program = gl.createProgram()
    this.gl = gl

    gl.attachShader(this.program, vertexShader)
    gl.attachShader(this.program, fragmentShader)
    gl.linkProgram(this.program)

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw gl.getProgramInfoLog(this.program)
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
  }

  bind() {
    this.gl.useProgram(this.program)
  }
}
