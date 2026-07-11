import {
  ArrowRight,
  Copy,
  ExternalLink,
  Link as LinkIcon,
  Moon,
  RotateCcw,
  Sun
} from 'lucide-react'
import Head from 'next/head'
import * as React from 'react'

import { DesignWorkbench } from '@/components/design/DesignWorkbench'
import { designPreviewPages } from '@/lib/design-preview-pages'

import styles from './theme.module.css'

type ThemeMode = 'light' | 'dark'
type TokenKey =
  | 'background'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'surface'
  | 'surfaceHover'
  | 'divider'
type TokenSet = Record<TokenKey, string>
type ThemeState = Record<ThemeMode, TokenSet>

const tokenDefinitions: Array<{
  key: TokenKey
  label: string
  cssVariable: string
}> = [
  { key: 'background', label: 'Background', cssVariable: '--w-background' },
  { key: 'primary', label: 'Primary text', cssVariable: '--w-primary' },
  { key: 'secondary', label: 'Secondary text', cssVariable: '--w-secondary' },
  { key: 'accent', label: 'Accent', cssVariable: '--w-accent' },
  { key: 'surface', label: 'Surface', cssVariable: '--w-surface' },
  {
    key: 'surfaceHover',
    label: 'Surface hover',
    cssVariable: '--w-surface-hover'
  },
  { key: 'divider', label: 'Divider', cssVariable: '--w-divider' }
]

const defaults: ThemeState = {
  light: {
    background: '#ffffff',
    primary: '#1a1a1a',
    secondary: '#666666',
    accent: '#000000',
    surface: '#f7f7f7',
    surfaceHover: '#efefef',
    divider: '#e9e9e9'
  },
  dark: {
    background: '#0d0d0d',
    primary: '#e8e8e8',
    secondary: '#929292',
    accent: '#ffffff',
    surface: '#171717',
    surfaceHover: '#222222',
    divider: '#292929'
  }
}

const storageKey = 'design-theme-lab'

function normalizeLocalPath(value: string) {
  const url = new URL(value.trim() || '/', window.location.origin)
  if (url.origin !== window.location.origin) {
    throw new Error('Preview paths must stay on this site.')
  }
  if (url.pathname.startsWith('/design')) {
    throw new Error('Choose a public page outside the design tools.')
  }
  return `${url.pathname}${url.search}`
}

function serializeTokens(tokens: TokenSet) {
  return tokenDefinitions
    .map(({ key }) => tokens[key].replace('#', ''))
    .join('.')
}

function parseTokens(value: string | null): TokenSet | null {
  if (!value) return null
  const colors = value.split('.')
  if (
    colors.length !== tokenDefinitions.length ||
    colors.some((color) => !/^[\da-f]{6}$/i.test(color))
  ) {
    return null
  }

  return Object.fromEntries(
    tokenDefinitions.map(({ key }, index) => [key, `#${colors[index]}`])
  ) as TokenSet
}

function channelToLinear(channel: number) {
  const value = channel / 255
  return value <= 0.040_45
    ? value / 12.92
    : Math.pow((value + 0.055) / 1.055, 2.4)
}

function luminance(hex: string) {
  const value = hex.replace('#', '')
  const red = Number.parseInt(value.slice(0, 2), 16)
  const green = Number.parseInt(value.slice(2, 4), 16)
  const blue = Number.parseInt(value.slice(4, 6), 16)
  return (
    0.2126 * channelToLinear(red) +
    0.7152 * channelToLinear(green) +
    0.0722 * channelToLinear(blue)
  )
}

function contrastRatio(foreground: string, background: string) {
  const lighter = Math.max(luminance(foreground), luminance(background))
  const darker = Math.min(luminance(foreground), luminance(background))
  return (lighter + 0.05) / (darker + 0.05)
}

function createCssBlock(selector: string, tokens: TokenSet) {
  return `${selector} {
${tokenDefinitions
  .map(({ key, cssVariable }) => `  ${cssVariable}: ${tokens[key]};`)
  .join('\n')}
}`
}

function createCss(theme: ThemeState) {
  return `${createCssBlock(':root', theme.light)}\n\n${createCssBlock(
    '.dark-mode',
    theme.dark
  )}`
}

function createPreviewStyle(tokens: TokenSet, mode: ThemeMode) {
  const declarations = [
    ...tokenDefinitions.map(
      ({ key, cssVariable }) => `${cssVariable}: ${tokens[key]} !important;`
    ),
    `--foreground: ${tokens.primary} !important;`,
    `--card: ${tokens.surface} !important;`,
    `--card-foreground: ${tokens.primary} !important;`,
    `--popover: ${tokens.surface} !important;`,
    `--popover-foreground: ${tokens.primary} !important;`,
    `--muted: ${tokens.surface} !important;`,
    `--muted-foreground: ${tokens.secondary} !important;`,
    `--border: ${tokens.divider} !important;`,
    `--input: ${tokens.divider} !important;`,
    `--ring: ${tokens.accent} !important;`,
    `--w-dark-background: ${tokens.background} !important;`,
    `--w-dark-primary: ${tokens.primary} !important;`,
    `--w-dark-secondary: ${tokens.secondary} !important;`,
    `--w-dark-accent: ${tokens.accent} !important;`,
    `--w-dark-surface: ${tokens.surface} !important;`,
    `--w-dark-surface-hover: ${tokens.surfaceHover} !important;`,
    `--w-dark-divider: ${tokens.divider} !important;`
  ].join('\n')

  return `:root, html, body, [data-font-root] {
${declarations}
}

html, body {
  color-scheme: ${mode} !important;
  color: ${tokens.primary} !important;
  background: ${tokens.background} !important;
}

main {
  --about-bg: ${tokens.background} !important;
  --about-text: ${tokens.primary} !important;
  --about-muted: ${tokens.secondary} !important;
  --about-accent: ${tokens.accent} !important;
  --about-card: ${tokens.surface} !important;
  --about-card-hover: ${tokens.surfaceHover} !important;
  --about-border: ${tokens.divider} !important;
}`
}

function ColorTokenControl({
  id,
  label,
  value,
  onChange
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const [draft, setDraft] = React.useState(value)

  React.useEffect(() => setDraft(value), [value])

  const commitDraft = () => {
    if (/^#[\da-f]{6}$/i.test(draft)) {
      onChange(draft.toLowerCase())
    } else {
      setDraft(value)
    }
  }

  return (
    <div className={styles.colorControl}>
      <input
        type='color'
        value={value}
        onInput={(event) => onChange(event.currentTarget.value)}
        aria-label={`${label} color picker`}
      />
      <input
        id={id}
        value={draft}
        onChange={(event) => {
          const nextValue = event.target.value
          setDraft(nextValue)
          if (/^#[\da-f]{6}$/i.test(nextValue))
            onChange(nextValue.toLowerCase())
        }}
        onBlur={commitDraft}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.currentTarget.blur()
        }}
        spellCheck={false}
        maxLength={7}
      />
    </div>
  )
}

export default function ThemeDesignPage() {
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const modeObserverRef = React.useRef<MutationObserver | null>(null)
  const [theme, setTheme] = React.useState<ThemeState>(defaults)
  const [mode, setMode] = React.useState<ThemeMode>('light')
  const [ready, setReady] = React.useState(false)
  const [feedback, setFeedback] = React.useState('')
  const [previewPath, setPreviewPath] = React.useState('/')
  const [draftPath, setDraftPath] = React.useState('/')
  const [pathError, setPathError] = React.useState('')
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const saved = JSON.parse(
        localStorage.getItem(storageKey) || 'null'
      ) as ThemeState | null
      const light = parseTokens(params.get('light')) || saved?.light
      const dark = parseTokens(params.get('dark')) || saved?.dark
      const savedMode = params.get('mode') as ThemeMode | null
      const nextPath = normalizeLocalPath(params.get('path') || '/')

      setTheme({
        light: light || defaults.light,
        dark: dark || defaults.dark
      })
      if (savedMode === 'light' || savedMode === 'dark') setMode(savedMode)
      setPreviewPath(nextPath)
      setDraftPath(nextPath)
    } catch {
      setTheme(defaults)
    } finally {
      setReady(true)
    }
  }, [])

  React.useEffect(() => {
    if (!ready) return
    localStorage.setItem(storageKey, JSON.stringify(theme))
    const url = new URL(window.location.href)
    url.searchParams.set('light', serializeTokens(theme.light))
    url.searchParams.set('dark', serializeTokens(theme.dark))
    url.searchParams.set('mode', mode)
    url.searchParams.set('path', previewPath)
    window.history.replaceState(window.history.state, '', url)
  }, [mode, previewPath, ready, theme])

  const activeTokens = theme[mode]
  const primaryContrast = contrastRatio(
    activeTokens.primary,
    activeTokens.background
  )
  const secondaryContrast = contrastRatio(
    activeTokens.secondary,
    activeTokens.background
  )

  const applyPreviewTheme = React.useCallback(() => {
    const doc = iframeRef.current?.contentDocument
    if (!doc?.head) return

    let previewStyle = doc.head.querySelector<HTMLStyleElement>(
      'style[data-design-theme-preview]'
    )
    if (!previewStyle) {
      previewStyle = doc.createElement('style')
      previewStyle.dataset.designThemePreview = 'true'
      doc.head.append(previewStyle)
    }
    previewStyle.textContent = createPreviewStyle(activeTokens, mode)

    doc.documentElement.classList.remove('dark-mode')
    doc.body?.classList.toggle('dark-mode', mode === 'dark')
    doc.documentElement.style.colorScheme = mode
  }, [activeTokens, mode])

  React.useEffect(() => {
    applyPreviewTheme()
  }, [applyPreviewTheme])

  // Keep the sidebar mode in sync when the previewed page's own light/dark
  // toggle flips the `dark-mode` class inside the iframe. Without this, the
  // inline token overrides we inject would pin the colors and the in-page
  // toggle would appear dead.
  const syncModeFromFrame = React.useCallback(() => {
    const doc = iframeRef.current?.contentDocument
    if (!doc) return
    const isDark =
      doc.documentElement.classList.contains('dark-mode') ||
      Boolean(doc.body?.classList.contains('dark-mode'))
    setMode((current) => {
      const next = isDark ? 'dark' : 'light'
      return current === next ? current : next
    })
  }, [])

  React.useEffect(() => () => modeObserverRef.current?.disconnect(), [])

  const navigateTo = (value: string) => {
    try {
      const path = normalizeLocalPath(value)
      setPathError('')
      setPreviewPath(path)
      setDraftPath(path)
      setLoading(true)
    } catch (err) {
      setPathError(
        err instanceof Error ? err.message : 'Enter a valid local path.'
      )
    }
  }

  const handleFrameLoad = () => {
    applyPreviewTheme()
    iframeRef.current?.contentWindow?.requestAnimationFrame(() =>
      applyPreviewTheme()
    )
    setLoading(false)

    const observerDoc = iframeRef.current?.contentDocument
    modeObserverRef.current?.disconnect()
    if (observerDoc) {
      const observer = new MutationObserver(syncModeFromFrame)
      observer.observe(observerDoc.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      })
      if (observerDoc.body) {
        observer.observe(observerDoc.body, {
          attributes: true,
          attributeFilter: ['class']
        })
      }
      modeObserverRef.current = observer
      syncModeFromFrame()
    }
    try {
      const location = iframeRef.current?.contentWindow?.location
      if (!location || location.origin !== window.location.origin) return
      const path = `${location.pathname}${location.search}`
      if (!path.startsWith('/design')) {
        setPreviewPath(path)
        setDraftPath(path)
      }
    } catch {
      // Same-origin navigation resynchronizes on the next successful load.
    }
  }

  const setToken = (key: TokenKey, value: string) => {
    if (!/^#[\da-f]{6}$/i.test(value)) return
    setTheme((current) => ({
      ...current,
      [mode]: { ...current[mode], [key]: value.toLowerCase() }
    }))
  }

  const showFeedback = (message: string) => {
    setFeedback(message)
    window.setTimeout(() => setFeedback(''), 1600)
  }

  const copyCss = async () => {
    await navigator.clipboard.writeText(createCss(theme))
    showFeedback('CSS copied')
  }

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    showFeedback('Link copied')
  }

  const resetTheme = () => {
    setTheme(defaults)
    showFeedback('Reset')
  }

  const controls = (
    <>
      <section className={styles.controlSection}>
        <label className={styles.controlLabel} htmlFor='theme-preview-page'>
          Preview page
        </label>
        <select
          id='theme-preview-page'
          className={styles.select}
          value={
            designPreviewPages.some((page) => page.path === previewPath)
              ? previewPath
              : 'custom'
          }
          onChange={(event) => {
            if (event.target.value !== 'custom') navigateTo(event.target.value)
          }}
        >
          {designPreviewPages.map((page) => (
            <option key={page.path} value={page.path}>
              {page.label}
            </option>
          ))}
          <option value='custom'>Custom path</option>
        </select>
        <form
          className={styles.pathForm}
          onSubmit={(event) => {
            event.preventDefault()
            navigateTo(draftPath)
          }}
        >
          <input
            value={draftPath}
            onChange={(event) => setDraftPath(event.target.value)}
            aria-label='Custom preview path'
            aria-invalid={Boolean(pathError)}
            spellCheck={false}
          />
          <button type='submit' aria-label='Load preview path'>
            <ArrowRight aria-hidden='true' />
          </button>
        </form>
        {pathError && <p className={styles.pathError}>{pathError}</p>}
      </section>

      <section className={styles.controlSection}>
        <div className={styles.modeSwitch} aria-label='Theme mode'>
          <button
            type='button'
            className={mode === 'light' ? styles.selectedMode : ''}
            onClick={() => setMode('light')}
            aria-pressed={mode === 'light'}
          >
            <Sun aria-hidden='true' /> Light
          </button>
          <button
            type='button'
            className={mode === 'dark' ? styles.selectedMode : ''}
            onClick={() => setMode('dark')}
            aria-pressed={mode === 'dark'}
          >
            <Moon aria-hidden='true' /> Dark
          </button>
        </div>
      </section>

      <section className={styles.tokenSection}>
        <div className={styles.sectionHeading}>
          <span>{mode === 'light' ? 'Light' : 'Dark'} tokens</span>
          <span>{tokenDefinitions.length}</span>
        </div>
        <div className={styles.tokenList}>
          {tokenDefinitions.map((token) => (
            <div className={styles.tokenRow} key={token.key}>
              <label htmlFor={`token-${token.key}`}>{token.label}</label>
              <ColorTokenControl
                id={`token-${token.key}`}
                label={token.label}
                value={activeTokens[token.key]}
                onChange={(value) => setToken(token.key, value)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.contrastSection}>
        <div className={styles.sectionHeading}>
          <span>Contrast</span>
          <span>WCAG AA</span>
        </div>
        <div className={styles.contrastRow}>
          <span>Primary / background</span>
          <strong
            className={primaryContrast >= 4.5 ? styles.pass : styles.fail}
          >
            {primaryContrast.toFixed(2)}:1
          </strong>
        </div>
        <div className={styles.contrastRow}>
          <span>Secondary / background</span>
          <strong
            className={secondaryContrast >= 4.5 ? styles.pass : styles.fail}
          >
            {secondaryContrast.toFixed(2)}:1
          </strong>
        </div>
      </section>
    </>
  )

  const controlsFooter = (
    <div className={styles.footerActions}>
      <button type='button' onClick={resetTheme}>
        <RotateCcw aria-hidden='true' /> Reset
      </button>
      <button type='button' onClick={() => void copyShareLink()}>
        <LinkIcon aria-hidden='true' /> Share
      </button>
      <button type='button' onClick={() => void copyCss()}>
        <Copy aria-hidden='true' /> Copy CSS
      </button>
    </div>
  )

  const previewLabel =
    designPreviewPages.find((page) => page.path === previewPath)?.label ||
    previewPath

  const toolbar = (
    <>
      <div className={styles.previewIdentity} title={previewPath}>
        <span className={loading ? styles.loadingDot : styles.readyDot} />
        <span>Preview</span>
        <strong>{previewLabel}</strong>
      </div>
      <div className={styles.toolbarSwatches} aria-label='Current palette'>
        {tokenDefinitions.slice(0, 5).map(({ key, label }) => (
          <span
            key={key}
            style={{ backgroundColor: activeTokens[key] }}
            title={`${label}: ${activeTokens[key]}`}
          />
        ))}
      </div>
      <span className={styles.toolbarMode}>
        {mode === 'light' ? (
          <Sun aria-hidden='true' />
        ) : (
          <Moon aria-hidden='true' />
        )}
        {mode} preview
      </span>
      <button
        type='button'
        className={styles.openPage}
        onClick={() =>
          window.open(previewPath, '_blank', 'noopener,noreferrer')
        }
        aria-label='Open original page in a new tab'
      >
        <ExternalLink aria-hidden='true' />
      </button>
    </>
  )

  return (
    <>
      <Head>
        <title>Theme · Design workbench</title>
        <meta
          name='description'
          content='Edit, share, and export the site theme tokens.'
        />
        <meta name='robots' content='noindex,nofollow' />
      </Head>

      <DesignWorkbench
        activeTool='theme'
        title='Theme'
        description='Tune both color modes, verify contrast, share a setup, and export CSS.'
        controls={controls}
        controlsFooter={controlsFooter}
        toolbar={toolbar}
        status={loading ? 'Loading' : feedback || 'Saved locally'}
      >
        <div className={styles.browserFrame}>
          {ready ? (
            <iframe
              ref={iframeRef}
              src={previewPath}
              title={`Theme preview of ${previewPath}`}
              onLoad={handleFrameLoad}
            />
          ) : (
            <div className={styles.previewLoading}>Preparing preview…</div>
          )}
        </div>
      </DesignWorkbench>
    </>
  )
}
