'use client'

import type { CSSProperties, MouseEvent, PointerEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

import { SmoothHashLink } from './SmoothHashLink'
import { useSound } from './SoundProvider'
import styles from './landing-signature.module.css'

const O_COUNT = 8
const WORDMARK = `Y${'O'.repeat(O_COUNT)}!!!!`
const DESCRIPTOR = 'Transitive BS'
const FORCE = 1
const DAMPING = 0.78
const STIFFNESS = 0.115

type MotionValue = {
  x: number
  y: number
  scaleX: number
  scaleY: number
  rotation: number
  velocityX: number
  velocityY: number
  velocityScaleX: number
  velocityScaleY: number
  velocityRotation: number
}

type PointerState = {
  x: number
  y: number
  previousX: number
  previousTime: number
  velocityX: number
  inside: boolean
}

type Wave = {
  origin: number
  startedAt: number
}

type StressFieldRenderer = {
  dispose: () => void
  draw: (
    glyphs: Array<HTMLSpanElement | null>,
    energy: Float32Array,
    pointerState: PointerState,
    pointerIsActive: boolean
  ) => void
}

const MAX_GLYPHS = O_COUNT

const STRESS_VERTEX_SHADER = `
  attribute vec2 aPosition;
  varying vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`

const STRESS_FRAGMENT_SHADER = `
  precision highp float;

  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform vec2 uGlyphs[8];
  uniform float uEnergy[8];
  uniform vec2 uPointer;
  uniform float uPointerPresence;

  const vec3 WARM_WHITE = vec3(0.941, 0.933, 0.902);
  const vec3 ACID = vec3(0.839, 1.0, 0.247);

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 aspectScale = vec2(aspect, 1.0);
    float potential = 0.0;
    float liveStress = 0.0;
    float directionalStress = 0.0;
    float nearest = 4.0;

    for (int index = 0; index < 8; index++) {
      vec2 delta = (vUv - uGlyphs[index]) * aspectScale;
      float distanceToGlyph = length(delta);
      float proximity = exp(-distanceToGlyph * 7.5);
      float energy = uEnergy[index];

      potential += 0.0085 / (distanceToGlyph + 0.018);
      liveStress += energy * proximity;
      directionalStress +=
        energy * delta.x * proximity / (distanceToGlyph + 0.035);
      nearest = min(nearest, distanceToGlyph);
    }

    vec2 pointerDelta = (vUv - uPointer) * aspectScale;
    float pointerDistance = length(pointerDelta);
    float pointerStress =
      uPointerPresence * exp(-pointerDistance * 8.0);
    potential +=
      uPointerPresence * 0.012 / (pointerDistance + 0.026);

    float phase = potential * 20.0 + directionalStress * 2.8;
    float majorWave = abs(sin(phase));
    float minorWave = abs(sin(phase * 2.03 + 0.7));
    float majorLine = 1.0 - smoothstep(0.025, 0.105, majorWave);
    float minorLine = 1.0 - smoothstep(0.02, 0.075, minorWave);
    float envelope = 1.0 - smoothstep(0.08, 0.7, nearest);
    float response = clamp(liveStress + pointerStress * 0.75, 0.0, 1.0);
    float line = (majorLine * 0.82 + minorLine * 0.2) * envelope;
    float alpha = line * (0.13 + response * 0.72) + response * 0.055;
    vec3 color = mix(WARM_WHITE, ACID, smoothstep(0.06, 0.56, response));

    gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.9));
  }
`

const createMotionValue = (): MotionValue => ({
  x: 0,
  y: 0,
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
  velocityX: 0,
  velocityY: 0,
  velocityScaleX: 0,
  velocityScaleY: 0,
  velocityRotation: 0
})

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

function compileStressShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Unable to create stress-field shader')

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message =
      gl.getShaderInfoLog(shader) ?? 'Unable to compile stress-field shader'
    gl.deleteShader(shader)
    throw new Error(message)
  }

  return shader
}

function getStressUniform(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string
) {
  const location = gl.getUniformLocation(program, name)
  if (location === null) throw new Error(`Unable to locate ${name}`)
  return location
}

function createStressFieldRenderer(
  canvas: HTMLCanvasElement,
  word: HTMLButtonElement
): StressFieldRenderer | null {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    stencil: false
  })

  if (!gl) return null

  let vertexShader: WebGLShader | null = null
  let fragmentShader: WebGLShader | null = null
  let program: WebGLProgram | null = null
  let buffer: WebGLBuffer | null = null
  let contextLost = false

  const handleContextLost = () => {
    contextLost = true
    delete canvas.dataset.ready
  }

  canvas.addEventListener('webglcontextlost', handleContextLost)

  try {
    vertexShader = compileStressShader(
      gl,
      gl.VERTEX_SHADER,
      STRESS_VERTEX_SHADER
    )
    fragmentShader = compileStressShader(
      gl,
      gl.FRAGMENT_SHADER,
      STRESS_FRAGMENT_SHADER
    )
    program = gl.createProgram()
    if (!program) throw new Error('Unable to create stress-field program')

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(
        gl.getProgramInfoLog(program) ?? 'Unable to link stress-field program'
      )
    }

    buffer = gl.createBuffer()
    if (!buffer) throw new Error('Unable to create stress-field buffer')

    const position = gl.getAttribLocation(program, 'aPosition')
    if (position < 0) throw new Error('Unable to locate aPosition')

    const uniforms = {
      energy: getStressUniform(gl, program, 'uEnergy[0]'),
      glyphs: getStressUniform(gl, program, 'uGlyphs[0]'),
      pointer: getStressUniform(gl, program, 'uPointer'),
      pointerPresence: getStressUniform(gl, program, 'uPointerPresence'),
      resolution: getStressUniform(gl, program, 'uResolution')
    }

    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    )
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    gl.disable(gl.DEPTH_TEST)

    const positions = new Float32Array(MAX_GLYPHS * 2)
    positions.fill(-4)
    canvas.dataset.ready = ''

    return {
      draw(glyphs, energy, pointerState, pointerIsActive) {
        if (contextLost) return

        const canvasRect = canvas.getBoundingClientRect()
        const wordRect = word.getBoundingClientRect()
        if (canvasRect.width <= 0 || canvasRect.height <= 0) return

        const requestedPixelRatio = Math.min(window.devicePixelRatio || 1, 1.25)
        const pixelBudgetRatio = Math.sqrt(
          1_800_000 / (canvasRect.width * canvasRect.height)
        )
        const pixelRatio = Math.min(requestedPixelRatio, pixelBudgetRatio)
        const width = Math.max(1, Math.round(canvasRect.width * pixelRatio))
        const height = Math.max(1, Math.round(canvasRect.height * pixelRatio))

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width
          canvas.height = height
        }

        positions.fill(-4)
        glyphs.slice(0, MAX_GLYPHS).forEach((glyph, index) => {
          if (!glyph) return

          const rect = glyph.getBoundingClientRect()
          positions[index * 2] =
            (rect.left + rect.width / 2 - canvasRect.left) / canvasRect.width
          positions[index * 2 + 1] =
            1 -
            (rect.top + rect.height / 2 - canvasRect.top) / canvasRect.height
        })

        const pointerX =
          (wordRect.left + pointerState.x - canvasRect.left) / canvasRect.width
        const pointerY =
          1 -
          (wordRect.top + pointerState.y - canvasRect.top) / canvasRect.height

        gl.viewport(0, 0, width, height)
        gl.useProgram(program)
        gl.uniform2fv(uniforms.glyphs, positions)
        gl.uniform1fv(uniforms.energy, energy)
        gl.uniform2f(uniforms.pointer, pointerX, pointerY)
        gl.uniform1f(uniforms.pointerPresence, pointerIsActive ? 1 : 0)
        gl.uniform2f(uniforms.resolution, width, height)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      },
      dispose() {
        delete canvas.dataset.ready
        canvas.removeEventListener('webglcontextlost', handleContextLost)

        if (!contextLost) {
          if (buffer) gl.deleteBuffer(buffer)
          if (program) gl.deleteProgram(program)
          if (vertexShader) gl.deleteShader(vertexShader)
          if (fragmentShader) gl.deleteShader(fragmentShader)
        }
      }
    }
  } catch (err) {
    console.warn('Resonance stress field unavailable', err)
    canvas.removeEventListener('webglcontextlost', handleContextLost)
    if (buffer) gl.deleteBuffer(buffer)
    if (program) gl.deleteProgram(program)
    if (vertexShader) gl.deleteShader(vertexShader)
    if (fragmentShader) gl.deleteShader(fragmentShader)
    return null
  }
}

export function LandingSignature() {
  const { playSound } = useSound()
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [staticOrigin, setStaticOrigin] = useState(Math.floor(O_COUNT / 2))
  const [activationCount, setActivationCount] = useState(0)

  const sceneRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wordRef = useRef<HTMLButtonElement>(null)
  const glyphRefs = useRef<Array<HTMLSpanElement | null>>([])
  const motionValues = useRef<MotionValue[]>([])
  const animationFrame = useRef<number | null>(null)
  const lastFrameTime = useRef(0)
  const reducedMotion = useRef(false)
  const staticOriginRef = useRef(staticOrigin)
  const wave = useRef<Wave | null>(null)
  const wakeAnimation = useRef<() => void>(() => undefined)
  const drawStaticField = useRef<() => void>(() => undefined)
  const pointer = useRef<PointerState>({
    x: 0,
    y: 0,
    previousX: 0,
    previousTime: 0,
    velocityX: 0,
    inside: false
  })
  useEffect(() => {
    motionValues.current = Array.from({ length: O_COUNT }, createMotionValue)
    glyphRefs.current.length = O_COUNT
    wave.current = null
    if (reducedMotion.current) {
      drawStaticField.current()
    } else {
      wakeAnimation.current()
    }
  }, [])

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const canvas = canvasRef.current
    const scene = sceneRef.current
    const word = wordRef.current
    const stressRenderer =
      canvas && word ? createStressFieldRenderer(canvas, word) : null
    const fieldEnergy = new Float32Array(MAX_GLYPHS)
    let sceneVisible = true

    const applyStaticState = () => {
      for (const glyph of glyphRefs.current) {
        if (!glyph) continue

        glyph.style.transform = ''
        glyph.style.setProperty('--energy', '0')
      }
    }

    const stopAnimation = () => {
      if (animationFrame.current !== null) {
        window.cancelAnimationFrame(animationFrame.current)
        animationFrame.current = null
      }
    }

    const renderStressField = (useStaticSignal = false) => {
      fieldEnergy.fill(0)
      if (useStaticSignal) {
        fieldEnergy[clamp(staticOriginRef.current, 0, O_COUNT - 1)] = 0.92
      }

      stressRenderer?.draw(
        glyphRefs.current,
        fieldEnergy,
        pointer.current,
        !useStaticSignal && pointer.current.inside
      )
    }

    drawStaticField.current = () => renderStressField(true)

    const frame = (time: number) => {
      animationFrame.current = null

      if (document.visibilityState === 'hidden' || reducedMotion.current) {
        return
      }

      const word = wordRef.current
      const glyphs = glyphRefs.current

      if (!word || glyphs.length === 0) return

      const delta = lastFrameTime.current
        ? clamp((time - lastFrameTime.current) / 16.667, 0.35, 1.8)
        : 1
      lastFrameTime.current = time

      const wordRect = word.getBoundingClientRect()
      const pointerState = pointer.current
      const activeWave = wave.current
      const dampingFactor = Math.pow(DAMPING, delta)
      const interactionRadius = clamp(wordRect.width * 0.2, 104, 280)
      const pointerVelocity = clamp(pointerState.velocityX, -2.4, 2.4)
      let shouldContinue = false
      fieldEnergy.fill(0)

      for (let index = 0; index < glyphs.length; index += 1) {
        const glyph = glyphs[index]
        if (!glyph) continue

        const state = motionValues.current[index] ?? createMotionValue()
        motionValues.current[index] = state

        let targetX = 0
        let targetY = 0
        let targetScaleX = 1
        let targetScaleY = 1
        let targetRotation = 0
        let energy = 0

        if (pointerState.inside) {
          const center = glyph.offsetLeft + glyph.offsetWidth / 2
          const distance = center - pointerState.x
          const influence = Math.exp(
            -(distance * distance) / (interactionRadius * interactionRadius)
          )
          const verticalDistance = clamp(
            pointerState.y - wordRect.height / 2,
            -wordRect.height,
            wordRect.height
          )

          targetX += -distance * 0.105 * influence * FORCE
          targetX += pointerVelocity * 22 * influence * FORCE
          targetY += verticalDistance * 0.11 * influence * FORCE
          targetScaleX -= 0.105 * influence * FORCE
          targetScaleX += Math.abs(pointerVelocity) * 0.018 * influence
          targetScaleY += 0.14 * influence * FORCE
          targetRotation +=
            clamp(verticalDistance / wordRect.height, -1, 1) *
            clamp(distance / interactionRadius, -1, 1) *
            7 *
            influence *
            FORCE
          energy = influence * 0.18
        }

        if (activeWave) {
          const delay = Math.abs(index - activeWave.origin) * 56
          const localTime = time - activeWave.startedAt - delay
          const duration = 460

          if (localTime >= 0 && localTime <= duration) {
            const progress = localTime / duration
            const pulse = Math.sin(progress * Math.PI)
            const recoil = Math.sin(progress * Math.PI * 2)

            targetY -= pulse * clamp(wordRect.height * 0.38, 22, 72) * FORCE
            targetX += recoil * (index < activeWave.origin ? -1 : 1) * 7 * FORCE
            targetScaleX += pulse * 0.1 * FORCE
            targetScaleY -= pulse * 0.13 * FORCE
            targetRotation += recoil * 3.5 * FORCE
            energy = Math.max(energy, pulse)
            shouldContinue = true
          } else if (localTime < 0) {
            shouldContinue = true
          }
        }

        state.velocityX =
          (state.velocityX + (targetX - state.x) * STIFFNESS * delta) *
          dampingFactor
        state.velocityY =
          (state.velocityY + (targetY - state.y) * STIFFNESS * delta) *
          dampingFactor
        state.velocityScaleX =
          (state.velocityScaleX +
            (targetScaleX - state.scaleX) * STIFFNESS * delta) *
          dampingFactor
        state.velocityScaleY =
          (state.velocityScaleY +
            (targetScaleY - state.scaleY) * STIFFNESS * delta) *
          dampingFactor
        state.velocityRotation =
          (state.velocityRotation +
            (targetRotation - state.rotation) * STIFFNESS * delta) *
          dampingFactor

        state.x += state.velocityX * delta
        state.y += state.velocityY * delta
        state.scaleX += state.velocityScaleX * delta
        state.scaleY += state.velocityScaleY * delta
        state.rotation += state.velocityRotation * delta

        glyph.style.transform = `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, 0) rotate(${state.rotation.toFixed(2)}deg) scale(${state.scaleX.toFixed(3)}, ${state.scaleY.toFixed(3)})`
        glyph.style.setProperty('--energy', energy.toFixed(3))
        fieldEnergy[index] = Math.max(
          energy,
          clamp(
            (Math.abs(state.y) + Math.abs(state.x) * 0.35) /
              Math.max(wordRect.height * 0.32, 24),
            0,
            1
          )
        )

        const displacement =
          Math.abs(targetX - state.x) +
          Math.abs(targetY - state.y) +
          Math.abs(targetScaleX - state.scaleX) * 12 +
          Math.abs(targetScaleY - state.scaleY) * 12 +
          Math.abs(targetRotation - state.rotation)
        const velocity =
          Math.abs(state.velocityX) +
          Math.abs(state.velocityY) +
          Math.abs(state.velocityScaleX) * 12 +
          Math.abs(state.velocityScaleY) * 12 +
          Math.abs(state.velocityRotation)

        if (displacement > 0.035 || velocity > 0.035) shouldContinue = true
      }

      pointerState.velocityX *= Math.pow(0.72, delta)
      stressRenderer?.draw(
        glyphs,
        fieldEnergy,
        pointerState,
        pointerState.inside
      )

      if (
        activeWave &&
        time - activeWave.startedAt > (glyphs.length - 1) * 56 + 460
      ) {
        wave.current = null
      }

      if (shouldContinue) {
        animationFrame.current = window.requestAnimationFrame(frame)
      }
    }

    const wake = () => {
      if (
        animationFrame.current !== null ||
        document.visibilityState === 'hidden' ||
        !sceneVisible ||
        reducedMotion.current
      ) {
        return
      }

      lastFrameTime.current = performance.now()
      animationFrame.current = window.requestAnimationFrame(frame)
    }

    const handleMotionPreference = () => {
      reducedMotion.current = motionQuery.matches
      setPrefersReducedMotion(motionQuery.matches)

      if (reducedMotion.current) {
        stopAnimation()
        wave.current = null
        applyStaticState()
        renderStressField(true)
      } else {
        wake()
      }
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        stopAnimation()
      } else if (reducedMotion.current) {
        renderStressField(true)
      } else {
        lastFrameTime.current = performance.now()
        wake()
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      if (reducedMotion.current) renderStressField(true)
      else wake()
    })
    if (word) resizeObserver.observe(word)
    if (scene) resizeObserver.observe(scene)

    const intersectionObserver = scene
      ? new IntersectionObserver(([entry]) => {
          sceneVisible = entry?.isIntersecting ?? true
          if (sceneVisible) {
            if (reducedMotion.current) renderStressField(true)
            else wake()
          } else {
            stopAnimation()
          }
        })
      : null
    if (scene && intersectionObserver) intersectionObserver.observe(scene)

    wakeAnimation.current = wake
    motionQuery.addEventListener('change', handleMotionPreference)
    document.addEventListener('visibilitychange', handleVisibility)
    handleMotionPreference()

    return () => {
      stopAnimation()
      resizeObserver.disconnect()
      intersectionObserver?.disconnect()
      stressRenderer?.dispose()
      motionQuery.removeEventListener('change', handleMotionPreference)
      document.removeEventListener('visibilitychange', handleVisibility)
      wakeAnimation.current = () => undefined
      drawStaticField.current = () => undefined
    }
  }, [])

  const updatePointer = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion.current || event.pointerType === 'touch') return

    const word = wordRef.current
    if (!word) return

    const rect = word.getBoundingClientRect()
    const now = performance.now()
    const nextX = event.clientX - rect.left
    const elapsed = Math.max(now - pointer.current.previousTime, 8)

    pointer.current.x = nextX
    pointer.current.y = event.clientY - rect.top
    pointer.current.velocityX = (nextX - pointer.current.previousX) / elapsed
    pointer.current.previousX = nextX
    pointer.current.previousTime = now
    pointer.current.inside = true
    wakeAnimation.current()
  }

  const leaveInstrument = () => {
    pointer.current.inside = false
    pointer.current.velocityX = 0
    wakeAnimation.current()
  }

  const sendWave = (clientX?: number) => {
    const word = wordRef.current
    if (!word) return

    playSound('sparkle')

    let origin = (staticOriginRef.current + 1) % O_COUNT

    if (clientX !== undefined) {
      const wordRect = word.getBoundingClientRect()
      const localX = clientX - wordRect.left
      let shortestDistance = Number.POSITIVE_INFINITY

      glyphRefs.current.forEach((glyph, index) => {
        if (!glyph) return

        const center = glyph.offsetLeft + glyph.offsetWidth / 2
        const distance = Math.abs(center - localX)
        if (distance < shortestDistance) {
          shortestDistance = distance
          origin = index
        }
      })
    }

    staticOriginRef.current = origin
    setStaticOrigin(origin)
    setActivationCount((count) => count + 1)

    if (reducedMotion.current) {
      drawStaticField.current()
      return
    }

    wave.current = { origin, startedAt: performance.now() }
    wakeAnimation.current()
  }

  const handleWordClick = (event: MouseEvent<HTMLButtonElement>) => {
    sendWave(event.detail === 0 ? undefined : event.clientX)
  }

  const handleSceneClick = (event: MouseEvent<HTMLElement>) => {
    if (event.target instanceof Element && event.target.closest('a, button')) {
      return
    }

    sendWave(event.clientX)
  }

  const wordStyle = {
    '--word-size': `${Math.min(13.75, 138 / (O_COUNT + 5))}vw`
  } as CSSProperties

  return (
    <section
      className={styles.scene}
      data-reduced-motion={prefersReducedMotion ? '' : undefined}
      aria-labelledby='resonance-title'
      ref={sceneRef}
      onClick={handleSceneClick}
    >
      <div className={styles.atmosphere} aria-hidden='true' />
      <canvas
        className={styles.stressField}
        ref={canvasRef}
        aria-hidden='true'
      />

      <div
        className={styles.instrument}
        onPointerEnter={updatePointer}
        onPointerMove={updatePointer}
        onPointerLeave={leaveInstrument}
        onPointerCancel={leaveInstrument}
      >
        <div className={styles.descriptor}>
          <span aria-hidden='true' />
          {DESCRIPTOR}
        </div>

        <h1 className={styles.accessibleTitle} id='resonance-title'>
          {WORDMARK}
        </h1>
        <div className={styles.title}>
          <button
            ref={wordRef}
            className={styles.word}
            style={wordStyle}
            type='button'
            aria-label={
              prefersReducedMotion
                ? 'Move the static signal'
                : `Send a wave through ${WORDMARK}`
            }
            onClick={handleWordClick}
          >
            <span className={styles.anchorGlyph} aria-hidden='true'>
              Y
            </span>
            {Array.from({ length: O_COUNT }, (_, index) => (
              <span
                className={styles.resonantGlyph}
                data-glyph='O'
                data-selected={
                  prefersReducedMotion && index === staticOrigin
                    ? ''
                    : undefined
                }
                aria-hidden='true'
                key={index}
                ref={(element) => {
                  glyphRefs.current[index] = element
                }}
              >
                O
              </span>
            ))}
            <span className={styles.anchorGlyph} aria-hidden='true'>
              !!!!
            </span>
          </button>
        </div>

        <span className={styles.accessibleStatus} aria-live='polite'>
          {activationCount > 0
            ? `${prefersReducedMotion ? 'Signal moved' : 'Wave sent'} from O ${staticOrigin + 1}.`
            : ''}
        </span>
      </div>

      <SmoothHashLink className={styles.footerMeta} href='#author-letter'>
        A note from Travis <span aria-hidden='true'>↓</span>
      </SmoothHashLink>
    </section>
  )
}
