export function bootstrap() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  initCursorSystem()
  initSoundEngine()
  // Letter spirits + ambient: defer until idle, skip on low-end devices
  if (navigator.hardwareConcurrency > 2) {
    requestIdleCallback(() => initLetterSpirits(), { timeout: 2000 })
    requestIdleCallback(() => initAmbientSpirits(), { timeout: 3000 })
  }
}

// ─────────────────────────────────────────────────────────
// Cursor System: follower + spotlight + trail
// ─────────────────────────────────────────────────────────
function initCursorSystem() {
  const isTouch = 'ontouchstart' in window
  if (isTouch) { initTouchEffects(); return }

  document.documentElement.classList.add('has-pointer')

  const spotlightEl = document.createElement('div')
  spotlightEl.className = 'cursor-spotlight'
  const dot = document.createElement('div')
  dot.className = 'cursor-dot'
  const ring = document.createElement('div')
  ring.className = 'cursor-ring'
  document.body.append(spotlightEl, dot, ring)

  let mx = -100, my = -100
  let dx = -100, dy = -100, rx = -100, ry = -100
  let magnetTarget: HTMLElement | null = null
  let isHovering = false
  let cursorMoving = false
  let idleTimer: ReturnType<typeof setTimeout> | null = null

  document.addEventListener('mousemove', (e: MouseEvent) => {
    mx = e.clientX
    my = e.clientY
    spotlightEl.style.setProperty('--mx', `${mx}px`)
    spotlightEl.style.setProperty('--my', `${my}px`)
    if (!cursorMoving) { cursorMoving = true; animateCursor() }
    if (idleTimer) clearTimeout(idleTimer)
    idleTimer = setTimeout(() => { cursorMoving = false }, 100)
  }, { passive: true })

  function animateCursor() {
    if (!cursorMoving) return
    dx += (mx - dx) * 0.25
    dy += (my - dy) * 0.25
    let tx = mx, ty = my
    if (magnetTarget) {
      const r = magnetTarget.getBoundingClientRect()
      tx = mx + (r.left + r.width / 2 - mx) * 0.4
      ty = my + (r.top + r.height / 2 - my) * 0.4
    }
    rx += (tx - rx) * 0.12
    ry += (ty - ry) * 0.12
    dot.style.transform = `translate(${dx}px,${dy}px)`
    ring.style.transform = `translate(${rx}px,${ry}px) scale(${isHovering ? 1.8 : 1})`
    requestAnimationFrame(animateCursor)
  }

  document.addEventListener('mouseover', (e: MouseEvent) => {
    const t = (e.target as HTMLElement)?.closest?.('a,button,[role="button"],.notion-collection-card,input,textarea') as HTMLElement | null
    if (t) { isHovering = true; magnetTarget = t; ring.classList.add('cursor-ring--active'); dot.classList.add('cursor-dot--active') }
  }, { passive: true })

  document.addEventListener('mouseout', (e: MouseEvent) => {
    const t = (e.target as HTMLElement)?.closest?.('a,button,[role="button"],.notion-collection-card,input,textarea')
    if (t) { isHovering = false; magnetTarget = null; ring.classList.remove('cursor-ring--active'); dot.classList.remove('cursor-dot--active') }
  }, { passive: true })

  document.addEventListener('mousedown', () => { ring.classList.add('cursor-ring--click'); spawnRipple(mx, my) })
  document.addEventListener('mouseup', () => ring.classList.remove('cursor-ring--click'))

  // Trail: throttled, max 5 alive at once
  let lastTrailTime = 0
  document.addEventListener('mousemove', (e: MouseEvent) => {
    const now = performance.now()
    if (Math.sqrt(e.movementX ** 2 + e.movementY ** 2) > 10 && now - lastTrailTime > 80) {
      lastTrailTime = now
      if (document.querySelectorAll('.cursor-trail').length < 5) {
        spawnParticle('cursor-trail', e.clientX, e.clientY)
      }
    }
  }, { passive: true })
}

function spawnRipple(x: number, y: number) { spawnParticle('click-ripple', x, y) }

function spawnParticle(cls: string, x: number, y: number, props?: Record<string, string>) {
  const el = document.createElement('div')
  el.className = cls
  el.style.left = `${x}px`
  el.style.top = `${y}px`
  if (props) for (const [k, v] of Object.entries(props)) el.style.setProperty(k, v)
  document.body.appendChild(el)
  el.addEventListener('animationend', () => el.remove(), { once: true })
}

function initTouchEffects() {
  const spot = document.createElement('div')
  spot.className = 'cursor-spotlight'
  document.body.appendChild(spot)

  document.addEventListener('touchmove', (e: TouchEvent) => {
    const t = e.touches[0]
    if (!t) return
    spot.style.setProperty('--mx', `${t.clientX}px`)
    spot.style.setProperty('--my', `${t.clientY}px`)
  }, { passive: true })

  document.addEventListener('touchstart', (e: TouchEvent) => {
    document.documentElement.classList.add('touch-active')
    const t = e.touches[0]
    if (t) spawnRipple(t.clientX, t.clientY)
  }, { passive: true })

  document.addEventListener('touchend', () => {
    document.documentElement.classList.remove('touch-active')
  }, { passive: true })
}

// ─────────────────────────────────────────────────────────
// Sound Engine: lightweight, suspends when idle
// ─────────────────────────────────────────────────────────
let audioCtx: AudioContext | null = null
let soundEnabled = false
let masterGain: GainNode | null = null
let suspendTimer: ReturnType<typeof setTimeout> | null = null

function ensureAudio() {
  if (audioCtx?.state === 'suspended') audioCtx.resume()
  if (suspendTimer) clearTimeout(suspendTimer)
  suspendTimer = setTimeout(() => { if (audioCtx?.state === 'running') audioCtx.suspend() }, 5000)
}

function initSoundEngine() {
  const unlock = () => {
    if (audioCtx) return
    audioCtx = new AudioContext()
    masterGain = audioCtx.createGain()
    masterGain.gain.value = 0.35
    masterGain.connect(audioCtx.destination)
    soundEnabled = true
  }
  document.addEventListener('click', unlock, { once: true })
  document.addEventListener('touchstart', unlock, { once: true })

  document.addEventListener('click', () => { if (soundEnabled) playClick() })

  let lastHover: EventTarget | null = null
  document.addEventListener('mouseover', (e: MouseEvent) => {
    const t = (e.target as HTMLElement)?.closest?.('a,button,[role="button"]')
    if (t && t !== lastHover && soundEnabled) { lastHover = t; playHover() }
    if (!t) lastHover = null
  }, { passive: true })
}

function playClick() {
  if (!audioCtx || !masterGain) return
  ensureAudio()
  const t = audioCtx.currentTime
  const o = audioCtx.createOscillator(), g = audioCtx.createGain()
  o.type = 'triangle'; o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(80, t + 0.1)
  g.gain.setValueAtTime(0.045, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
  o.connect(g); g.connect(masterGain!); o.start(t); o.stop(t + 0.12)
  o.onended = () => { o.disconnect(); g.disconnect() }
}

function playHover() {
  if (!audioCtx || !masterGain) return
  ensureAudio()
  const t = audioCtx.currentTime
  const o1 = audioCtx.createOscillator(), o2 = audioCtx.createOscillator(), g = audioCtx.createGain()
  o1.type = 'sine'; o1.frequency.setValueAtTime(400, t); o1.frequency.exponentialRampToValueAtTime(550, t + 0.08)
  o2.type = 'sine'; o2.frequency.setValueAtTime(403, t); o2.frequency.exponentialRampToValueAtTime(553, t + 0.08)
  g.gain.setValueAtTime(0.008, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
  o1.connect(g); o2.connect(g); g.connect(masterGain!); o1.start(t); o2.start(t); o1.stop(t + 0.12); o2.stop(t + 0.12)
  o2.onended = () => { o1.disconnect(); o2.disconnect(); g.disconnect() }
}

// ─────────────────────────────────────────────────────────
// Letter Spirits: per-char proximity glow on titles ONLY
// PERF: runs at 30fps, pauses when tab hidden, no DOM spam
// ─────────────────────────────────────────────────────────
interface SpiritChar { el: HTMLSpanElement; x: number; y: number }
let spiritChars: SpiritChar[] = []
let spiritMx = -9999, spiritMy = -9999
let spiritRunning = false
const SPIRIT_RADIUS = 120
const MAX_LIFT = -6

function initLetterSpirits() {
  const setup = () => {
    splitText()
    if (spiritChars.length === 0) return

    document.addEventListener('mousemove', (e) => {
      spiritMx = e.clientX; spiritMy = e.clientY
    }, { passive: true })

    // Recache on resize (debounced)
    let resizeTimer: ReturnType<typeof setTimeout> | null = null
    window.addEventListener('resize', () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(cachePos, 300)
    }, { passive: true })

    // Pause when tab hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { spiritRunning = false }
      else if (spiritChars.length > 0) startSpirits()
    })

    startSpirits()
  }

  if (document.readyState === 'complete') setTimeout(setup, 800)
  else window.addEventListener('load', () => setTimeout(setup, 800))

  // SPA navigation: observe only #__next direct children, debounced
  let mutTimer: ReturnType<typeof setTimeout> | null = null
  const target = document.getElementById('__next') || document.body
  new MutationObserver(() => {
    if (mutTimer) clearTimeout(mutTimer)
    mutTimer = setTimeout(() => { spiritChars = []; splitText() }, 600)
  }).observe(target, { childList: true })
}

function splitText() {
  const els = document.querySelectorAll('.notion-title, .notion-gallery-grid .notion-page-title-text')
  els.forEach((el) => {
    if (el.querySelector('.spirit-char')) return
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    const nodes: Text[] = []
    let n: Text | null
    while ((n = walker.nextNode() as Text | null)) { if (n.textContent?.trim()) nodes.push(n) }

    nodes.forEach((tn) => {
      const text = tn.textContent || ''
      const frag = document.createDocumentFragment()
      for (let i = 0; i < text.length; i++) {
        const ch = text[i]!
        const s = document.createElement('span')
        s.textContent = ch
        if (ch !== ' ') { s.className = 'spirit-char'; s.style.display = 'inline-block' }
        frag.appendChild(s)
      }
      tn.parentNode?.replaceChild(frag, tn)
    })
  })
  cachePos()
}

function cachePos() {
  spiritChars = []
  const sy = window.scrollY
  document.querySelectorAll('.spirit-char').forEach((el) => {
    const r = (el as HTMLElement).getBoundingClientRect()
    spiritChars.push({ el: el as HTMLSpanElement, x: r.left + r.width / 2, y: r.top + r.height / 2 + sy })
  })
}

function startSpirits() {
  if (spiritRunning) return
  spiritRunning = true
  const primary = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
  const cta = getComputedStyle(document.documentElement).getPropertyValue('--cta').trim()
  let last = 0

  function tick(now: number) {
    if (!spiritRunning) return
    // Throttle to ~30fps
    if (now - last < 33) { requestAnimationFrame(tick); return }
    last = now

    const vh = window.innerHeight, sy = window.scrollY

    for (const ch of spiritChars) {
      const cy = ch.y - sy
      if (cy < -SPIRIT_RADIUS || cy > vh + SPIRIT_RADIUS) {
        if (ch.el.style.transform) { ch.el.style.transform = ''; ch.el.style.color = ''; ch.el.style.textShadow = '' }
        continue
      }

      const ddx = spiritMx - ch.x, ddy = spiritMy - cy
      const dist = Math.sqrt(ddx * ddx + ddy * ddy)

      if (dist < SPIRIT_RADIUS) {
        const e = ((1 - dist / SPIRIT_RADIUS) ** 2)
        ch.el.style.transform = `translate(${(-ddx / dist) * 2 * e}px,${MAX_LIFT * e}px) scale(${1 + e * 0.1})`
        ch.el.style.color = e > 0.5 ? (cta || '#f97316') : e > 0.2 ? (primary || '#2563eb') : ''
        const gs = Math.round(4 + e * 12)
        ch.el.style.textShadow = `0 0 ${gs}px rgba(37,99,235,${(e * 0.5).toFixed(2)})`
      } else if (ch.el.style.transform) {
        ch.el.style.transform = ''; ch.el.style.color = ''; ch.el.style.textShadow = ''
      }
    }
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

// ─────────────────────────────────────────────────────────
// Ambient Spirits: fewer, pause when hidden
// ─────────────────────────────────────────────────────────
const AMBIENT_SHAPES = ['✦', '✧', '·', '○']
let ambientInterval: ReturnType<typeof setInterval> | null = null

function initAmbientSpirits() {
  const start = () => {
    if (ambientInterval) return
    ambientInterval = setInterval(spawnAmbient, 4000)
  }
  const stop = () => {
    if (ambientInterval) { clearInterval(ambientInterval); ambientInterval = null }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start()
  })

  if (document.readyState === 'complete') setTimeout(start, 2000)
  else window.addEventListener('load', () => setTimeout(start, 2000))
}

function spawnAmbient() {
  if (document.querySelectorAll('.ambient-spirit').length >= 6) return
  const blocks = document.querySelectorAll('.notion-text, .notion-quote, .notion-h1, .notion-h2, .notion-gallery-grid .notion-collection-card-body')
  if (blocks.length === 0) return
  const block = blocks[Math.floor(Math.random() * blocks.length)]
  if (!block) return
  const rect = block.getBoundingClientRect()
  if (rect.bottom < 0 || rect.top > window.innerHeight) return

  const x = rect.left + Math.random() * rect.width
  const y = rect.top + Math.random() * rect.height
  const shape = AMBIENT_SHAPES[Math.floor(Math.random() * AMBIENT_SHAPES.length)]!
  const dx = (Math.random() - 0.5) * 30
  const dy = -(10 + Math.random() * 25)
  const cls = Math.random() < 0.5 ? 'ambient-spirit--primary' : 'ambient-spirit--cta'

  const el = document.createElement('div')
  el.className = `ambient-spirit ${cls}`
  el.textContent = shape
  el.style.cssText = `left:${x}px;top:${y}px;font-size:${6 + Math.random() * 6}px;animation-duration:${3 + Math.random() * 2}s`
  el.style.setProperty('--drift-x', `${dx}px`)
  el.style.setProperty('--drift-y', `${dy}px`)
  document.body.appendChild(el)
  el.addEventListener('animationend', () => el.remove(), { once: true })
}

// Polyfill for requestIdleCallback
declare global { interface Window { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number } }
if (!window.requestIdleCallback) window.requestIdleCallback = ((cb: () => void) => setTimeout(cb, 1)) as any
