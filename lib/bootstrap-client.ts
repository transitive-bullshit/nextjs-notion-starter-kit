export function bootstrap() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const isLowEnd = navigator.hardwareConcurrency <= 2

  // Mobile: only touch ripple (lightweight)
  if (isMobile) {
    initTouchRipple()
    return
  }

  // Desktop: cursor + effects (gated by CPU)
  initCursorSystem()
  if (!isLowEnd) {
    requestIdleCallback(() => initLetterSpirits(), { timeout: 2000 })
    requestIdleCallback(() => initAmbientSpirits(), { timeout: 3000 })
  }
}

// ─────────────────────────────────────────────────────────
// Touch Ripple — lightweight, mobile only
// ─────────────────────────────────────────────────────────
function initTouchRipple() {
  document.addEventListener('touchstart', (e: TouchEvent) => {
    const t = e.touches[0]
    if (t) spawnParticle('click-ripple', t.clientX, t.clientY)
  }, { passive: true })
}

// ─────────────────────────────────────────────────────────
// Cursor System — dot + ring, STOPS when idle
// ─────────────────────────────────────────────────────────
function initCursorSystem() {
  document.documentElement.classList.add('has-pointer')

  const dot = document.createElement('div')
  dot.className = 'cursor-dot'
  const ring = document.createElement('div')
  ring.className = 'cursor-ring'
  document.body.append(dot, ring)

  let mx = -100, my = -100
  let dx = -100, dy = -100, rx = -100, ry = -100
  let isHovering = false
  let rafId = 0

  document.addEventListener('mousemove', (e: MouseEvent) => {
    mx = e.clientX
    my = e.clientY
    if (!rafId) rafId = requestAnimationFrame(tick)
  }, { passive: true })

  function tick() {
    dx += (mx - dx) * 0.2
    dy += (my - dy) * 0.2
    rx += (mx - rx) * 0.1
    ry += (my - ry) * 0.1

    dot.style.transform = `translate(${dx}px,${dy}px)`
    ring.style.transform = `translate(${rx}px,${ry}px) scale(${isHovering ? 1.6 : 1})`

    // STOP when settled — no infinite loop
    if (Math.abs(mx - dx) > 0.3 || Math.abs(mx - rx) > 0.3) {
      rafId = requestAnimationFrame(tick)
    } else {
      rafId = 0
    }
  }

  document.addEventListener('mouseover', (e: MouseEvent) => {
    if ((e.target as HTMLElement)?.closest?.('a,button,[role="button"],.notion-collection-card')) {
      isHovering = true
      ring.classList.add('cursor-ring--active')
      dot.classList.add('cursor-dot--active')
    }
  }, { passive: true })

  document.addEventListener('mouseout', (e: MouseEvent) => {
    if ((e.target as HTMLElement)?.closest?.('a,button,[role="button"],.notion-collection-card')) {
      isHovering = false
      ring.classList.remove('cursor-ring--active')
      dot.classList.remove('cursor-dot--active')
    }
  }, { passive: true })

  document.addEventListener('mousedown', () => {
    ring.classList.add('cursor-ring--click')
    spawnParticle('click-ripple', mx, my)
  })
  document.addEventListener('mouseup', () => ring.classList.remove('cursor-ring--click'))
}

function spawnParticle(cls: string, x: number, y: number) {
  const el = document.createElement('div')
  el.className = cls
  el.style.left = `${x}px`
  el.style.top = `${y}px`
  document.body.appendChild(el)
  el.addEventListener('animationend', () => el.remove(), { once: true })
}

// ─────────────────────────────────────────────────────────
// Letter Spirits — ONLY runs rAF when cursor is near title
// ─────────────────────────────────────────────────────────
interface SpiritChar { el: HTMLSpanElement; x: number; y: number }
let spiritChars: SpiritChar[] = []
let spiritMx = -9999, spiritMy = -9999
let spiritRafId = 0
let titleRect: DOMRect | null = null

function initLetterSpirits() {
  const setup = () => {
    splitTitle()
    if (spiritChars.length === 0) return

    document.addEventListener('mousemove', (e) => {
      spiritMx = e.clientX
      spiritMy = e.clientY
      // Only start loop if cursor is near the title area
      if (titleRect && isNearTitle(e.clientY)) {
        if (!spiritRafId) spiritRafId = requestAnimationFrame(spiritTick)
      }
    }, { passive: true })
  }

  if (document.readyState === 'complete') setTimeout(setup, 800)
  else window.addEventListener('load', () => setTimeout(setup, 800))

  // Re-split on SPA nav — debounced to 1s, not every mutation
  let mutTimer: ReturnType<typeof setTimeout> | null = null
  const target = document.getElementById('__next') || document.body
  new MutationObserver(() => {
    if (mutTimer) clearTimeout(mutTimer)
    mutTimer = setTimeout(() => {
      spiritChars = []
      spiritRafId = 0
      splitTitle()
    }, 1000)
  }).observe(target, { childList: true })
}

function isNearTitle(cy: number): boolean {
  if (!titleRect) return false
  const margin = 150
  return cy > titleRect.top - margin && cy < titleRect.bottom + margin
}

function splitTitle() {
  const el = document.querySelector('.notion-title')
  if (!el || el.querySelector('.spirit-char')) return

  titleRect = el.getBoundingClientRect()

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

  spiritChars = []
  const sy = window.scrollY
  document.querySelectorAll('.spirit-char').forEach((el) => {
    const r = (el as HTMLElement).getBoundingClientRect()
    spiritChars.push({ el: el as HTMLSpanElement, x: r.left + r.width / 2, y: r.top + r.height / 2 + sy })
  })
}

function spiritTick() {
  const sy = window.scrollY
  const RADIUS = 120
  let anyActive = false

  for (const ch of spiritChars) {
    const cy = ch.y - sy
    const ddx = spiritMx - ch.x, ddy = spiritMy - cy
    const dist = Math.sqrt(ddx * ddx + ddy * ddy)

    if (dist < RADIUS) {
      anyActive = true
      const e = ((1 - dist / RADIUS) ** 2)
      ch.el.style.transform = `translate(${(-ddx / dist) * 2 * e}px,${-6 * e}px) scale(${1 + e * 0.08})`
      ch.el.style.color = e > 0.3 ? 'var(--primary)' : ''
      ch.el.style.textShadow = e > 0.3 ? `0 0 ${Math.round(4 + e * 10)}px rgba(37,99,235,${(e * 0.4).toFixed(2)})` : ''
    } else if (ch.el.style.transform) {
      ch.el.style.transform = ''
      ch.el.style.color = ''
      ch.el.style.textShadow = ''
    }
  }

  // STOP loop when nothing is active — no infinite rAF
  if (anyActive || isNearTitle(spiritMy)) {
    spiritRafId = requestAnimationFrame(spiritTick)
  } else {
    spiritRafId = 0
  }
}

// ─────────────────────────────────────────────────────────
// Ambient Spirits — max 3, pauses when hidden/idle
// ─────────────────────────────────────────────────────────
const SHAPES = ['✦', '✧', '·', '○']
let ambientId: ReturnType<typeof setInterval> | null = null

function initAmbientSpirits() {
  const start = () => { if (!ambientId) ambientId = setInterval(spawnAmbient, 6000) }
  const stop = () => { if (ambientId) { clearInterval(ambientId); ambientId = null } }

  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start() })
  // Stop after 60s of no mouse movement
  let idleTimer: ReturnType<typeof setTimeout> | null = null
  document.addEventListener('mousemove', () => {
    if (!ambientId) start()
    if (idleTimer) clearTimeout(idleTimer)
    idleTimer = setTimeout(stop, 60000)
  }, { passive: true })

  if (document.readyState === 'complete') setTimeout(start, 3000)
  else window.addEventListener('load', () => setTimeout(start, 3000))
}

function spawnAmbient() {
  // Cap at 3 elements
  if (document.querySelectorAll('.ambient-spirit').length >= 3) return
  const blocks = document.querySelectorAll('.notion-text, .notion-quote, .notion-h1, .notion-h2')
  if (blocks.length === 0) return
  const block = blocks[Math.floor(Math.random() * blocks.length)]
  if (!block) return
  const rect = block.getBoundingClientRect()
  // Skip if not in viewport
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

// Polyfill
function requestIdleCallback(cb: () => void, opts?: { timeout: number }) {
  if (typeof window !== 'undefined' && window.requestIdleCallback) {
    return window.requestIdleCallback(cb, opts as any)
  }
  return setTimeout(cb, 1) as unknown as number
}
