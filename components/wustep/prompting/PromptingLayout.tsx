import Link from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import BodyClassName from 'react-body-classname'

import { LabsButton } from '@/components/wustep/LabsButton'
import { ThemeToggle } from '@/components/wustep/ThemeToggle'
import { useDarkMode } from '@/lib/use-dark-mode'

import type { ChapterMeta } from './types'
import { CHAPTERS, TOTAL_CHAPTERS } from './constants'
import { manualMono, manualSerif } from './fonts'
import { TocIcon } from './icons'
import styles from './PromptingPage.module.css'

/**
 * PromptingLayout — chrome that wraps every chapter page.
 *
 *   Provides the shared header (back-to-home + theme toggle), notion
 *   body class, and the manual's running rails: a ruled folio head with
 *   the guide title + chapter mark, a chapter opener plate, and a ruled
 *   prev/next footer.
 */
export function PromptingLayout({
  chapter,
  children
}: {
  chapter?: ChapterMeta
  children: React.ReactNode
}) {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <>
      <BodyClassName className={isDarkMode ? 'notion dark-mode' : 'notion'} />

      <div
        className={`${styles.frame} ${manualSerif.variable} ${manualMono.variable}`}
      >
        <header className='notion-header'>
          <div className='notion-nav-header'>
            <Link
              href='/'
              className={styles.homeBackButton}
              aria-label='Back to home'
            >
              <span className={styles.homeBackArrow}>←</span>
            </Link>

            <div className='notion-nav-header-rhs breadcrumbs'>
              <LabsButton className='breadcrumb button' />
              <ThemeToggle
                isDark={hasMounted ? isDarkMode : false}
                onToggle={toggleDarkMode}
                className='breadcrumb button'
              />
            </div>
          </div>
        </header>

        <main className={styles.page}>
          {chapter && <ChapterHeader chapter={chapter} />}
          {children}
          {chapter && <ChapterNav chapter={chapter} />}
        </main>

        <TableOfContents />
      </div>
    </>
  )
}

/**
 * TableOfContents — fixed-position icon in the upper-right of the
 * viewport. Opens on click (with Escape / outside-click / route-change
 * close) so it works for touch, keyboard, and screen readers; hovering
 * still reveals it on pointer-fine devices as a shortcut. Available at
 * every viewport width.
 */
function TableOfContents() {
  const router = useRouter()
  const currentPath = router.asPath.split(/[?#]/)[0]
  const [isOpen, setIsOpen] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  // Close when the pointer commits a navigation or clicks elsewhere.
  React.useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  // Route change (chapter picked) dismisses the panel.
  React.useEffect(() => {
    setIsOpen(false)
  }, [currentPath])

  return (
    <div
      ref={rootRef}
      className={isOpen ? `${styles.toc} ${styles.tocOpen}` : styles.toc}
    >
      <button
        ref={triggerRef}
        type='button'
        className={styles.tocTrigger}
        aria-label='Table of contents'
        aria-haspopup='true'
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <TocIcon className={styles.tocIcon} />
      </button>
      <nav className={styles.tocPanel} aria-label='Chapters'>
        <div className={styles.tocPanelHeader}>Contents</div>
        <ol className={styles.tocList}>
          {CHAPTERS.map((c) => {
            const isCurrent = c.href === currentPath
            return (
              <li key={c.href} className={styles.tocItem}>
                <Link
                  href={c.href}
                  className={
                    isCurrent
                      ? `${styles.tocLink} ${styles.tocLinkCurrent}`
                      : styles.tocLink
                  }
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  <span className={styles.tocIndex}>
                    {String(c.index).padStart(2, '0')}
                  </span>
                  <span className={styles.tocTitle}>{c.title}</span>
                </Link>
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}

/**
 * ChapterHeader — a hairline running head (series title left, humane
 * chapter mark right) above the chapter title set in the book serif.
 */
function ChapterHeader({ chapter }: { chapter: ChapterMeta }) {
  return (
    <header className={styles.chapterHeader}>
      <div className={styles.folio}>
        <Link href='/prompting' className={styles.folioTitle}>
          How to talk to coding agents
        </Link>
        <span className={styles.folioMark}>
          Chapter <span className={styles.folioMarkNum}>{chapter.index}</span>{' '}
          of {TOTAL_CHAPTERS}
        </span>
      </div>
      <div className={styles.chapterPlate}>
        <h1 className={styles.chapterTitle}>{chapter.title}</h1>
      </div>
    </header>
  )
}

function ChapterNav({ chapter }: { chapter: ChapterMeta }) {
  return (
    <nav className={styles.chapterNav} aria-label='Chapter navigation'>
      <div className={styles.chapterNavSlot}>
        {chapter.prevHref && chapter.prevLabel && (
          <Link href={chapter.prevHref} className={styles.chapterNavLink}>
            <span className={styles.chapterNavArrow} aria-hidden='true'>
              ←
            </span>
            <span className={styles.chapterNavBody}>
              <span className={styles.chapterNavDirection}>Previous</span>
              <span className={styles.chapterNavLabel}>
                {chapter.prevLabel}
              </span>
            </span>
          </Link>
        )}
      </div>
      <div className={styles.chapterNavSlot}>
        {chapter.nextHref &&
          chapter.nextLabel &&
          (chapter.nextKind === 'restart' ? (
            <Link
              href={chapter.nextHref}
              className={styles.chapterNavRestart}
              aria-label={`Restart: ${chapter.nextLabel}`}
            >
              <RestartIcon className={styles.chapterNavRestartIcon} />
              <span className={styles.chapterNavRestartLabel}>
                {chapter.nextLabel}
              </span>
            </Link>
          ) : (
            <Link
              href={chapter.nextHref}
              className={`${styles.chapterNavLink} ${styles.chapterNavLinkNext}`}
            >
              <span className={styles.chapterNavBody}>
                <span className={styles.chapterNavDirection}>Next</span>
                <span className={styles.chapterNavLabel}>
                  {chapter.nextLabel}
                </span>
              </span>
              <span className={styles.chapterNavArrow} aria-hidden='true'>
                →
              </span>
            </Link>
          ))}
      </div>
    </nav>
  )
}

/**
 * RestartIcon — circular arrow used by the Recap chapter's "Restart"
 * pill. Rotates continuously at a slow, almost-ignorable pace, and
 * speeds up on hover via CSS.
 */
function RestartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width='14'
      height='14'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M3 12a9 9 0 1 0 3-6.7' />
      <path d='M3 4v5h5' />
    </svg>
  )
}
