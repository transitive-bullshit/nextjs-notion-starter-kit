export function bootstrap() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  initCursorSystem()
  initSoundEngine()
  if (navigator.hardwareConcurrency > 2) {
    requestIdleCallback(() => initLetterSpirits(), { timeout: 2000 })
    requestIdleCallback(() => initAmbientSpirits(), { timeout: 3000 })
  }
}

// ─────────────────────────────────────────────────────────
// Cursor System: dot + ring follower, no spotlight overlay
// ─────────────────────────────────────────────────────────
function initCursorSystem() {
  const isTouch = 'ontouchstart' in window
  if (isTouch) { initTouchEffects(); return }

  document.documentElement.classList.add('has-pointer')

  const dot = document.createElement('div')
  dot.className = 'cursor-dot'
  const ring = document.createElement('div')
  ring.className = 'cursor-ring'
  document.body.append(dot, ring)

  let mx = -100, my = -100
  let dx = -100, dy = -100, rx = -100, ry = -100
  let magnetTarget: HTMLElement | null = null
  let isHovering = false
  let running = false

  document.addEventListener('mousemove', (e: MouseEvent) => {
    mx = e.clientX
    my = e.clientY
    if (!running) { running = true; tick() }
  }, { passive: true })

  function tick() {
    dx += (mx - dx) * 0.2
    dy += (my - dy) * 0.2
    let tx = mx, ty = my
    if (magnetTarget) {
      const r = magnetTarget.getBoundingClientRect()
      tx = mx + (r.left + r.width / 2 - mx) * 0.35
      ty = my + (r.top + r.height / 2 - my) * 0.35
    }
    rx += (tx - rx) * 0.1
    ry += (ty - ry) * 0.1

    dot.style.transform = `translate(${dx}px,${dy}px)`
    ring.style.transform = `translate(${rx}px,${ry}px) scale(${isHovering ? 1.6 : 1})`

    // Stop loop when cursor is settled
    if (Math.abs(mx - dx) < 0.5 && Math.abs(mx - rx) < 0.5) {
      running = false
      return
    }
    requestAnimationFrame(tick)
  }

  document.addEventListener('mouseover', (e: MouseEvent) => {
    const t = (e.target as HTMLElement)?.closest?.('a,button,[role="button"],.notion-collection-card') as HTMLElement | null
    if (t) { isHovering = true; magnetTarget = t; ring.classList.add('cursor-ring--active'); dot.classList.add('cursor-dot--active') }
  }, { passive: true })

  document.addEventListener('mouseout', (e: MouseEvent) => {
    if ((e.target as HTMLElement)?.closest?.('a,button,[role="button"],.notion-collection-card')) {
      isHovering = false; magnetTarget = null; ring.classList.remove('cursor-ring--active'); dot.classList.remove('cursor-dot--active')
    }
  }, { passive: true })

  document.addEventListener('mousedown', () => { ring.classList.add('cursor-ring--click'); spawnParticle('click-ripple', mx, my) })
  document.addEventListener('mouseup', () => ring.classList.remove('cursor-ring--click'))
}

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
  document.addEventListener('touchstart', (e: TouchEvent) => {
    document.documentElement.classList.add('touch-active')
    const t = e.touches[0]
    if (t) spawnParticle('click-ripple', t.clientX, t.clientY)
  }, { passive: true })
  document.addEventListener('touchend', () => {
    document.documentElement.classList.remove('touch-active')
  }, { passive: true })
}

// ─────────────────────────────────────────────────────────
// Sound Engine
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
// Letter Spirits: ONLY on .notion-title (blog post page)
// NOT on card titles (too many = perf death)
// ─────────────────────────────────────────────────────────
interface SpiritChar { el: HTMLSpanElement; x: number; y: number }
let spiritChars: SpiritChar[] = []
let spiritMx = -9999, spiritMy = -9999
let spiritRunning = false

function initLetterSpirits() {
  const setup = () => {
    splitTitle()
    if (spiritChars.length === 0) return

    document.addEventListener('mousemove', (e) => {
      spiritMx = e.clientX; spiritMy = e.clientY
    }, { passive: true })

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) spiritRunning = false
      else if (spiritChars.length) startSpirits()
    })

    startSpirits()
  }

  if (document.readyState === 'complete') setTimeout(setup, 800)
  else window.addEventListener('load', () => setTimeout(setup, 800))

  // Re-split on SPA nav
  let mutTimer: ReturnType<typeof setTimeout> | null = null
  const target = document.getElementById('__next') || document.body
  new MutationObserver(() => {
    if (mutTimer) clearTimeout(mutTimer)
    mutTimer = setTimeout(() => { spiritChars = []; splitTitle(); if (spiritChars.length) startSpirits() }, 600)
  }).observe(target, { childList: true })
}

function splitTitle() {
  // Only split the single blog post title — NOT card titles
  const el = document.querySelector('.notion-title')
  if (!el || el.querySelector('.spirit-char')) return

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

  // Cache positions
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
  const RADIUS = 120

  function tick() {
    if (!spiritRunning) return
    const sy = window.scrollY

    for (const ch of spiritChars) {
      const cy = ch.y - sy
      const ddx = spiritMx - ch.x, ddy = spiritMy - cy
      const dist = Math.sqrt(ddx * ddx + ddy * ddy)

      if (dist < RADIUS) {
        const e = ((1 - dist / RADIUS) ** 2)
        ch.el.style.transform = `translate(${(-ddx / dist) * 2 * e}px,${-6 * e}px) scale(${1 + e * 0.08})`
        ch.el.style.color = e > 0.5 ? (cta || '#f97316') : e > 0.2 ? (primary || '#2563eb') : ''
        ch.el.style.textShadow = e > 0.3 ? `0 0 ${Math.round(4 + e * 10)}px rgba(37,99,235,${(e * 0.4).toFixed(2)})` : ''
      } else if (ch.el.style.transform) {
        ch.el.style.transform = ''; ch.el.style.color = ''; ch.el.style.textShadow = ''
      }
    }
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

// ─────────────────────────────────────────────────────────
// Ambient Spirits: max 4, pauses when hidden
// ─────────────────────────────────────────────────────────
const SHAPES = ['✦', '✧', '·', '○']
let ambientId: ReturnType<typeof setInterval> | null = null

function initAmbientSpirits() {
  const start = () => { if (!ambientId) ambientId = setInterval(spawnAmbient, 5000) }
  const stop = () => { if (ambientId) { clearInterval(ambientId); ambientId = null } }

  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start() })

  if (document.readyState === 'complete') setTimeout(start, 2000)
  else window.addEventListener('load', () => setTimeout(start, 2000))
}

function spawnAmbient() {
  if (document.querySelectorAll('.ambient-spirit').length >= 4) return
  const blocks = document.querySelectorAll('.notion-text, .notion-quote, .notion-h1, .notion-h2')
  if (blocks.length === 0) return
  const block = blocks[Math.floor(Math.random() * blocks.length)]
  if (!block) return
  const rect = block.getBoundingClientRect()
  if (rect.bottom < 0 || rect.top > window.innerHeight) return

  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]!
  const cls = Math.random() < 0.5 ? 'ambient-spirit--primary' : 'ambient-spirit--cta'
  const el = document.createElement('div')
  el.className = `ambient-spirit ${cls}`
  el.textContent = shape
  el.style.cssText = `left:${rect.left + Math.random() * rect.width}px;top:${rect.top + Math.random() * rect.height}px;font-size:${6 + Math.random() * 5}px;animation-duration:${3 + Math.random() * 2}s`
  el.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 25}px`)
  el.style.setProperty('--drift-y', `${-(10 + Math.random() * 20)}px`)
  document.body.appendChild(el)
  el.addEventListener('animationend', () => el.remove(), { once: true })
}

// Polyfill requestIdleCallback
const ric = window.requestIdleCallback || ((cb: () => void) => setTimeout(cb, 1))
function requestIdleCallback(cb: () => void, opts?: { timeout: number }) { return ric.call(window, cb, opts as any) }
