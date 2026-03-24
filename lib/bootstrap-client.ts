export function bootstrap() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  initCursorSystem()
  initSoundEngine()
  initLetterSpirits()
  initAmbientSpirits()
}

// ─────────────────────────────────────────────────────────
// Cursor System: smooth follower + trail + magnetic + morph
// FIX #2: --mx/--my set on dedicated spotlight element, not :root
// ─────────────────────────────────────────────────────────
let spotlightEl: HTMLDivElement | null = null

function initCursorSystem() {
  const isTouch = 'ontouchstart' in window
  const root = document.documentElement

  if (isTouch) {
    initTouchEffects()
    return
  }

  root.classList.add('has-pointer')

  // FIX #2: Create dedicated spotlight overlay for --mx/--my
  spotlightEl = document.createElement('div')
  spotlightEl.className = 'cursor-spotlight'
  document.body.appendChild(spotlightEl)

  // Create cursor follower elements
  const dot = document.createElement('div')
  dot.className = 'cursor-dot'
  const ring = document.createElement('div')
  ring.className = 'cursor-ring'
  document.body.appendChild(dot)
  document.body.appendChild(ring)

  let mx = -100
  let my = -100
  let dx = -100
  let dy = -100
  let rx = -100
  let ry = -100
  let magnetTarget: HTMLElement | null = null
  let isHovering = false

  // Track mouse position — update spotlight element only, not :root
  document.addEventListener(
    'mousemove',
    (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      spotlightEl!.style.setProperty('--mx', `${mx}px`)
      spotlightEl!.style.setProperty('--my', `${my}px`)
    },
    { passive: true }
  )

  // Smooth animation loop — dot follows instantly, ring lags behind
  function animate() {
    dx += (mx - dx) * 0.25
    dy += (my - dy) * 0.25

    let targetX = mx
    let targetY = my
    if (magnetTarget) {
      const rect = magnetTarget.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      targetX = mx + (cx - mx) * 0.4
      targetY = my + (cy - my) * 0.4
    }
    rx += (targetX - rx) * 0.12
    ry += (targetY - ry) * 0.12

    dot.style.transform = `translate(${dx}px, ${dy}px)`
    ring.style.transform = `translate(${rx}px, ${ry}px) scale(${isHovering ? 1.8 : 1})`

    requestAnimationFrame(animate)
  }
  requestAnimationFrame(animate)

  // Hover detection
  document.addEventListener(
    'mouseover',
    (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.(
        'a, button, [role="button"], .notion-collection-card, input, textarea, .notion-search-button'
      ) as HTMLElement | null
      if (target) {
        isHovering = true
        magnetTarget = target
        ring.classList.add('cursor-ring--active')
        dot.classList.add('cursor-dot--active')
      }
    },
    { passive: true }
  )

  document.addEventListener(
    'mouseout',
    (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.(
        'a, button, [role="button"], .notion-collection-card, input, textarea, .notion-search-button'
      )
      if (target) {
        isHovering = false
        magnetTarget = null
        ring.classList.remove('cursor-ring--active')
        dot.classList.remove('cursor-dot--active')
      }
    },
    { passive: true }
  )

  // Click effect
  document.addEventListener('mousedown', () => {
    ring.classList.add('cursor-ring--click')
    spawnRipple(mx, my)
  })
  document.addEventListener('mouseup', () => {
    ring.classList.remove('cursor-ring--click')
  })

  // Trail particles on fast movement
  let lastTrailTime = 0
  document.addEventListener(
    'mousemove',
    (e: MouseEvent) => {
      const now = performance.now()
      const speed = Math.sqrt(e.movementX ** 2 + e.movementY ** 2)
      if (speed > 8 && now - lastTrailTime > 50) {
        lastTrailTime = now
        spawnTrailParticle(e.clientX, e.clientY)
      }
    },
    { passive: true }
  )
}

function spawnRipple(x: number, y: number) {
  const ripple = document.createElement('div')
  ripple.className = 'click-ripple'
  ripple.style.left = `${x}px`
  ripple.style.top = `${y}px`
  document.body.appendChild(ripple)
  ripple.addEventListener('animationend', () => ripple.remove())
}

function spawnTrailParticle(x: number, y: number) {
  const p = document.createElement('div')
  p.className = 'cursor-trail'
  p.style.left = `${x}px`
  p.style.top = `${y}px`
  document.body.appendChild(p)
  p.addEventListener('animationend', () => p.remove())
}

function initTouchEffects() {
  // FIX #2: Touch also uses dedicated spotlight element
  const touchSpot = document.createElement('div')
  touchSpot.className = 'cursor-spotlight'
  document.body.appendChild(touchSpot)
  spotlightEl = touchSpot

  document.addEventListener(
    'touchmove',
    (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      touchSpot.style.setProperty('--mx', `${t.clientX}px`)
      touchSpot.style.setProperty('--my', `${t.clientY}px`)
    },
    { passive: true }
  )

  document.addEventListener(
    'touchstart',
    (e: TouchEvent) => {
      document.documentElement.classList.add('touch-active')
      const t = e.touches[0]
      if (t) spawnRipple(t.clientX, t.clientY)
    },
    { passive: true }
  )

  document.addEventListener('touchend', () => {
    document.documentElement.classList.remove('touch-active')
  }, { passive: true })
}

// ─────────────────────────────────────────────────────────
// Sound Engine: warm synthesized micro-sounds via Web Audio
// FIX #3: disconnect temp nodes, suspend AudioContext when idle
// ─────────────────────────────────────────────────────────
let audioCtx: AudioContext | null = null
let soundEnabled = false
let masterGain: GainNode | null = null
let suspendTimer: ReturnType<typeof setTimeout> | null = null

function ensureAudioResumed() {
  if (audioCtx?.state === 'suspended') audioCtx.resume()
  if (suspendTimer) clearTimeout(suspendTimer)
  suspendTimer = setTimeout(() => {
    if (audioCtx?.state === 'running') audioCtx.suspend()
  }, 5000)
}

function initSoundEngine() {
  const unlock = () => {
    if (audioCtx) return
    audioCtx = new AudioContext()

    masterGain = audioCtx.createGain()
    masterGain.gain.value = 0.35
    masterGain.connect(audioCtx.destination)

    soundEnabled = true
    document.removeEventListener('click', unlock)
    document.removeEventListener('touchstart', unlock)
  }
  document.addEventListener('click', unlock, { once: true })
  document.addEventListener('touchstart', unlock, { once: true })

  document.addEventListener('click', () => {
    if (soundEnabled) playClickSound()
  })

  let lastHoverTarget: EventTarget | null = null
  document.addEventListener(
    'mouseover',
    (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.(
        'a, button, [role="button"]'
      )
      if (target && target !== lastHoverTarget && soundEnabled) {
        lastHoverTarget = target
        playHoverSound()
      }
      if (!target) lastHoverTarget = null
    },
    { passive: true }
  )
}

function playClickSound() {
  if (!audioCtx || !masterGain) return
  ensureAudioResumed()
  const t = audioCtx.currentTime

  const osc1 = audioCtx.createOscillator()
  const g1 = audioCtx.createGain()
  osc1.type = 'triangle'
  osc1.frequency.setValueAtTime(220, t)
  osc1.frequency.exponentialRampToValueAtTime(80, t + 0.1)
  g1.gain.setValueAtTime(0.045, t)
  g1.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
  osc1.connect(g1)
  g1.connect(masterGain)
  osc1.start(t)
  osc1.stop(t + 0.12)
  osc1.onended = () => { osc1.disconnect(); g1.disconnect() }

  const bufSize = audioCtx.sampleRate * 0.025
  const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufSize) ** 2
  }
  const noise = audioCtx.createBufferSource()
  noise.buffer = buf
  const nFilter = audioCtx.createBiquadFilter()
  nFilter.type = 'lowpass'
  nFilter.frequency.value = 800
  nFilter.Q.value = 0.7
  const nGain = audioCtx.createGain()
  nGain.gain.setValueAtTime(0.025, t)
  nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03)
  noise.connect(nFilter)
  nFilter.connect(nGain)
  nGain.connect(masterGain)
  noise.start(t)
  noise.stop(t + 0.03)
  noise.onended = () => { noise.disconnect(); nFilter.disconnect(); nGain.disconnect() }

  const osc2 = audioCtx.createOscillator()
  const g2 = audioCtx.createGain()
  osc2.type = 'sine'
  osc2.frequency.setValueAtTime(330, t)
  osc2.frequency.exponentialRampToValueAtTime(120, t + 0.08)
  g2.gain.setValueAtTime(0.015, t)
  g2.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
  osc2.connect(g2)
  g2.connect(masterGain)
  osc2.start(t)
  osc2.stop(t + 0.08)
  osc2.onended = () => { osc2.disconnect(); g2.disconnect() }
}

function playHoverSound() {
  if (!audioCtx || !masterGain) return
  ensureAudioResumed()
  const t = audioCtx.currentTime

  const osc1 = audioCtx.createOscillator()
  const osc2 = audioCtx.createOscillator()
  const g = audioCtx.createGain()

  osc1.type = 'sine'
  osc1.frequency.setValueAtTime(400, t)
  osc1.frequency.exponentialRampToValueAtTime(550, t + 0.08)

  osc2.type = 'sine'
  osc2.frequency.setValueAtTime(403, t)
  osc2.frequency.exponentialRampToValueAtTime(553, t + 0.08)

  g.gain.setValueAtTime(0.008, t)
  g.gain.setValueAtTime(0.008, t + 0.03)
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.12)

  osc1.connect(g)
  osc2.connect(g)
  g.connect(masterGain)

  osc1.start(t)
  osc2.start(t)
  osc1.stop(t + 0.12)
  osc2.stop(t + 0.12)
  // FIX #3: Disconnect on end
  osc2.onended = () => { osc1.disconnect(); osc2.disconnect(); g.disconnect() }
}

// ─────────────────────────────────────────────────────────
// Letter Spirits: each character reacts to cursor proximity
// FIX #1: Use cached positions + scrollY offset, no per-frame gBCR
// FIX #5: MutationObserver with subtree:true + debounce
// ─────────────────────────────────────────────────────────
interface SpiritChar {
  el: HTMLSpanElement
  x: number  // center X at scroll=0 (page coords)
  y: number  // center Y at scroll=0 (page coords)
}

let spiritChars: SpiritChar[] = []
let spiritMx = -9999
let spiritMy = -9999
const SPIRIT_RADIUS = 150
const MAX_LIFT = -8
const PARTICLE_CHANCE = 0.03

function initLetterSpirits() {
  const setup = () => {
    splitTextIntoSpans()
    if (spiritChars.length === 0) return

    document.addEventListener(
      'mousemove',
      (e) => {
        spiritMx = e.clientX
        spiritMy = e.clientY
      },
      { passive: true }
    )

    // Recache positions on resize/scroll (debounced)
    let recacheTimer: ReturnType<typeof setTimeout> | null = null
    const recache = () => {
      if (recacheTimer) clearTimeout(recacheTimer)
      recacheTimer = setTimeout(cachePositions, 200)
    }
    window.addEventListener('resize', recache, { passive: true })

    animateSpirits()
  }

  if (document.readyState === 'complete') {
    setTimeout(setup, 500)
  } else {
    window.addEventListener('load', () => setTimeout(setup, 500))
  }

  // FIX #5: subtree:true + debounced to detect SPA route changes
  let mutationTimer: ReturnType<typeof setTimeout> | null = null
  const observer = new MutationObserver(() => {
    if (mutationTimer) clearTimeout(mutationTimer)
    mutationTimer = setTimeout(() => {
      spiritChars = []
      splitTextIntoSpans()
    }, 500)
  })
  observer.observe(document.body, { childList: true, subtree: true })
}

function splitTextIntoSpans() {
  const selectors = [
    '.notion-title',
    '.notion-gallery-grid .notion-page-title-text',
    '.notion-h1 .notion-h-title',
    '.notion-h2 .notion-h-title',
  ]

  const elements = document.querySelectorAll(selectors.join(', '))
  elements.forEach((el) => {
    if (el.querySelector('.spirit-char')) return

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    const textNodes: Text[] = []
    let node: Text | null
    while ((node = walker.nextNode() as Text | null)) {
      if (node.textContent && node.textContent.trim()) {
        textNodes.push(node)
      }
    }

    textNodes.forEach((textNode) => {
      const text = textNode.textContent || ''
      const frag = document.createDocumentFragment()

      for (let i = 0; i < text.length; i++) {
        const ch = text[i]!
        if (ch === ' ') {
          const s = document.createElement('span')
          s.textContent = ' '
          s.style.display = 'inline'
          frag.appendChild(s)
          continue
        }

        const span = document.createElement('span')
        span.className = 'spirit-char'
        span.textContent = ch
        span.style.display = 'inline-block'
        span.style.willChange = 'transform, color, text-shadow'
        frag.appendChild(span)
      }

      textNode.parentNode?.replaceChild(frag, textNode)
    })
  })

  cachePositions()
}

// FIX #1: Cache positions once (page coords), not per frame
function cachePositions() {
  spiritChars = []
  const scrollY = window.scrollY
  document.querySelectorAll('.spirit-char').forEach((el) => {
    const htmlEl = el as HTMLSpanElement
    const rect = htmlEl.getBoundingClientRect()
    spiritChars.push({
      el: htmlEl,
      x: rect.left + rect.width / 2,
      // Store as page coordinate (viewport Y + scrollY)
      y: rect.top + rect.height / 2 + scrollY,
    })
  })
}

function animateSpirits() {
  const primary = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary').trim()
  const cta = getComputedStyle(document.documentElement)
    .getPropertyValue('--cta').trim()

  function tick() {
    const vh = window.innerHeight
    const scrollY = window.scrollY

    // FIX #1: Batch reads first (no gBCR), then batch writes
    for (const ch of spiritChars) {
      // Convert cached page-Y to viewport-Y
      const cy = ch.y - scrollY
      const cx = ch.x

      // Viewport cull
      if (cy < -SPIRIT_RADIUS || cy > vh + SPIRIT_RADIUS) {
        if (ch.el.style.transform) {
          ch.el.style.transform = ''
          ch.el.style.color = ''
          ch.el.style.textShadow = ''
        }
        continue
      }

      const dx = spiritMx - cx
      const dy = spiritMy - cy
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < SPIRIT_RADIUS) {
        const intensity = 1 - dist / SPIRIT_RADIUS
        const eased = intensity * intensity

        const lift = MAX_LIFT * eased
        const pushX = (-dx / dist) * 2 * eased

        ch.el.style.transform = `translate(${pushX}px, ${lift}px) scale(${1 + eased * 0.12})`

        if (eased > 0.5) {
          ch.el.style.color = cta || '#f97316'
        } else if (eased > 0.2) {
          ch.el.style.color = primary || '#2563eb'
        } else {
          ch.el.style.color = ''
        }

        const glowSize = Math.round(4 + eased * 16)
        const glowOpacity = (eased * 0.7).toFixed(2)
        ch.el.style.textShadow = `0 0 ${glowSize}px rgba(37,99,235,${glowOpacity}), 0 0 ${glowSize * 2}px rgba(249,115,22,${(eased * 0.3).toFixed(2)})`

        if (eased > 0.6 && Math.random() < PARTICLE_CHANCE) {
          spawnLetterSpark(cx, cy)
        }
      } else {
        if (ch.el.style.transform) {
          ch.el.style.transform = ''
          ch.el.style.color = ''
          ch.el.style.textShadow = ''
        }
      }
    }

    requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}

function spawnLetterSpark(x: number, y: number) {
  const spark = document.createElement('div')
  spark.className = 'letter-spark'
  const angle = Math.random() * Math.PI * 2
  const dist = 8 + Math.random() * 16
  const tx = Math.cos(angle) * dist
  const ty = Math.sin(angle) * dist - 10
  spark.style.left = `${x}px`
  spark.style.top = `${y}px`
  spark.style.setProperty('--tx', `${tx}px`)
  spark.style.setProperty('--ty', `${ty}px`)
  document.body.appendChild(spark)
  spark.addEventListener('animationend', () => spark.remove())
}

// ─────────────────────────────────────────────────────────
// Ambient Spirits: random floating particles near text
// ─────────────────────────────────────────────────────────
const AMBIENT_SHAPES = ['●', '✦', '◆', '✧', '○', '·', '✶', '⬥']
const AMBIENT_INTERVAL = 2500
const MAX_AMBIENT = 12

function initAmbientSpirits() {
  const setup = () => {
    setInterval(spawnAmbientSpirit, AMBIENT_INTERVAL)
  }

  if (document.readyState === 'complete') {
    setTimeout(setup, 1000)
  } else {
    window.addEventListener('load', () => setTimeout(setup, 1000))
  }
}

function spawnAmbientSpirit() {
  if (document.querySelectorAll('.ambient-spirit').length >= MAX_AMBIENT) return

  const textBlocks = document.querySelectorAll(
    '.notion-text, .notion-quote, .notion-callout, .notion-h1, .notion-h2, .notion-h3, .notion-gallery-grid .notion-collection-card-body'
  )
  if (textBlocks.length === 0) return

  const block = textBlocks[Math.floor(Math.random() * textBlocks.length)]
  if (!block) return
  const rect = block.getBoundingClientRect()
  const vh = window.innerHeight

  if (rect.bottom < 0 || rect.top > vh) return

  const side = Math.random()
  let x: number, y: number

  if (side < 0.3) {
    x = rect.left - 20 - Math.random() * 30
    y = rect.top + Math.random() * rect.height
  } else if (side < 0.6) {
    x = rect.right + 10 + Math.random() * 30
    y = rect.top + Math.random() * rect.height
  } else {
    x = rect.left + Math.random() * rect.width
    y = rect.top + Math.random() * rect.height
  }

  const spirit = document.createElement('div')
  spirit.className = 'ambient-spirit'

  const shape = AMBIENT_SHAPES[Math.floor(Math.random() * AMBIENT_SHAPES.length)]!
  spirit.textContent = shape

  const driftX = (Math.random() - 0.5) * 40
  const driftY = -(15 + Math.random() * 35)

  spirit.style.left = `${x}px`
  spirit.style.top = `${y}px`
  spirit.style.setProperty('--drift-x', `${driftX}px`)
  spirit.style.setProperty('--drift-y', `${driftY}px`)

  const duration = 3000 + Math.random() * 3000
  spirit.style.animationDuration = `${duration}ms`

  const variant = Math.random()
  if (variant < 0.4) {
    spirit.classList.add('ambient-spirit--primary')
  } else if (variant < 0.7) {
    spirit.classList.add('ambient-spirit--cta')
  } else {
    spirit.classList.add('ambient-spirit--muted')
  }

  const size = 6 + Math.random() * 8
  spirit.style.fontSize = `${size}px`

  document.body.appendChild(spirit)
  spirit.addEventListener('animationend', () => spirit.remove())
}
