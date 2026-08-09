'use client'

import Link from 'next/link'
import * as React from 'react'

import { github, linkedin, x } from '@/lib/config'

import styles from './AboutPage.module.css'
import { DesignButton } from './wustep/DesignButton'
import { LabsButton } from './wustep/LabsButton'
import { Illustration } from './wustep/lenses/illustrations'
import { OwnerModeToggle } from './wustep/OwnerModeToggle'
import { ThemeToggle } from './wustep/ThemeToggle'

// Plain-text mirror of the hero bio JSX below — used for meta descriptions.
export const bioText = `I'm Stephen, a product & design engineer who now also manages engineers. I think a lot about tools for thought, software design, and personal philosophy. I grew up mostly in Toledo, Ohio, and live in San Francisco now. I also enjoy roguelike deckbuilders, piano improvisation, and making random web projects.`

const workHistory = [
  {
    company: 'Notion',
    icon: 'notion',
    url: 'https://notion.com',
    roles: [
      { title: 'Tech Lead Manager', period: '2025–' },
      { title: 'Software Engineer', period: '2022–2025' }
    ]
  },
  {
    company: 'Facebook',
    icon: 'facebook',
    roles: [{ title: 'Software Engineer', period: '2019–2022' }]
  },
  {
    company: 'Ohio State',
    icon: 'osu',
    roles: [
      { title: 'B.S. Computer Science & Engineering', period: '2015–2019' }
    ]
  }
]

const writingSoftware = [
  {
    title: 'Prompting',
    href: '/prompting',
    note: 'talking to coding agents'
  },
  {
    title: 'Advice for students',
    href: '/advice-students',
    note: 'career pathfinding'
  },
  {
    title: 'Graphs of knowledge',
    href: '/cs-knowledge-graph',
    note: 'careers as infinite trees'
  },
  {
    title: "Don't thrash the user",
    href: '/thrash',
    note: 'empathetic ui/ux'
  }
]

const writingPersonal = [
  {
    title: 'Headspace',
    href: '/headspace',
    note: 'identity, growth, thought-space'
  },
  {
    title: 'Foraging',
    href: '/foraging',
    note: 'ADHD, dopamine, attention'
  },
  {
    title: 'On philosophy',
    href: '/philosophy',
    note: 'moral philosophy, lenses'
  },
  {
    title: "oct '25",
    href: '/oct-25',
    note: 'life update'
  }
]

function Tooltip({
  children,
  label,
  position: forcedPosition,
  inline
}: {
  children: React.ReactNode
  label: string
  position?: 'above' | 'below'
  inline?: boolean
}) {
  const wrapperRef = React.useRef<HTMLSpanElement>(null)
  const tooltipRef = React.useRef<HTMLSpanElement>(null)
  const tooltipId = React.useId()
  const [position, setPosition] = React.useState<'above' | 'below'>(
    forcedPosition ?? 'below'
  )
  const [shift, setShift] = React.useState(0)
  const shiftRef = React.useRef(0)
  const [arrowShift, setArrowShift] = React.useState(0)
  const positionRef = React.useRef(position)
  const [tapped, setTapped] = React.useState(false)

  // The tooltip is centered on its trigger, which pushes it past the viewport
  // edge for triggers near one. Nudge it back in (the arrow counter-shifts in
  // CSS so it keeps pointing at the trigger). Measure the tooltip itself
  // rather than the wrapper: an inline wrapper that breaks across lines
  // reports the union of its line boxes, which is not where the tooltip is
  // anchored. Undo the shift already applied to recover that anchor.
  const updateShift = React.useCallback(() => {
    if (!tooltipRef.current) return
    const margin = 12
    // clientWidth, not innerWidth: an overflowing tooltip widens the mobile
    // layout viewport, and measuring against that would leave it overflowing.
    const viewport = document.documentElement.clientWidth
    const rect = tooltipRef.current.getBoundingClientRect()
    const left = rect.left - shiftRef.current
    const right = left + rect.width
    const next =
      left < margin
        ? Math.round(margin - left)
        : right > viewport - margin
          ? -Math.round(right - (viewport - margin))
          : 0
    shiftRef.current = next
    setShift(next)

    // Point the arrow at the line box the tooltip actually sits against: an
    // inline trigger that wraps has two of them, and aiming at the midpoint of
    // both puts the arrow in the gutter between lines.
    const fragments = [...(wrapperRef.current?.getClientRects() ?? [])]
    if (fragments.length === 0) return
    const fragment =
      positionRef.current === 'below' ? fragments.at(-1)! : fragments[0]!
    const limit = Math.max(0, rect.width / 2 - 16)
    const offset =
      fragment.left + fragment.width / 2 - (left + rect.width / 2 + next)
    setArrowShift(Math.round(Math.min(Math.max(offset, -limit), limit)))
  }, [])

  // Clamp on mount too, not just on reveal: a tooltip is laid out even while
  // hidden, so an unclamped one makes the page scroll sideways on a phone.
  React.useEffect(() => {
    updateShift()
    window.addEventListener('resize', updateShift)
    return () => window.removeEventListener('resize', updateShift)
  }, [updateShift])

  const updatePosition = React.useCallback(() => {
    if (wrapperRef.current && !forcedPosition) {
      const rect = wrapperRef.current.getBoundingClientRect()
      const tooltipHeight = 50
      const spaceBelow = window.innerHeight - rect.bottom
      positionRef.current = spaceBelow >= tooltipHeight ? 'below' : 'above'
      setPosition(positionRef.current)
    }
    updateShift()
  }, [forcedPosition, updateShift])

  const close = React.useCallback(() => {
    setTapped(false)
    const active = document.activeElement
    if (active instanceof HTMLElement && wrapperRef.current?.contains(active)) {
      active.blur()
    }
  }, [])

  // Describe the trigger with the tooltip and make plain-span triggers
  // focusable so keyboard users can reveal it via :focus-within.
  const child = React.Children.only(children)
  const isSpanTrigger = React.isValidElement(child) && child.type === 'span'

  // Touch devices have no hover, so the tooltip needs a tap — but only
  // plain-span triggers can spend one on it. A link's tap belongs to its
  // navigation, so those keep the hover-only tooltip (hidden on touch).
  const toggleOnTouch = React.useCallback(() => {
    if (!window.matchMedia('(hover: none), (pointer: coarse)').matches) return
    if (tapped) {
      close()
      return
    }
    updatePosition()
    setTapped(true)
  }, [close, tapped, updatePosition])

  React.useEffect(() => {
    if (!tapped) return
    const onPointerDown = (event: PointerEvent) => {
      if (wrapperRef.current?.contains(event.target as Node)) return
      close()
    }
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('scroll', close, { passive: true })
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('scroll', close)
    }
  }, [close, tapped])

  const trigger = React.isValidElement(child)
    ? React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
        'aria-describedby': tooltipId,
        ...(isSpanTrigger ? { tabIndex: 0, onClick: toggleOnTouch } : null)
      })
    : children

  return (
    <span
      ref={wrapperRef}
      className={`${styles.tooltipWrapper} ${inline ? styles.tooltipWrapperInline : ''} ${isSpanTrigger ? styles.tooltipTappable : ''} ${tapped ? styles.tooltipTapped : ''}`}
      onMouseEnter={updatePosition}
      onFocus={updatePosition}
      onKeyDown={(event) => {
        // WCAG 1.4.13: let keyboard users dismiss the tooltip in place.
        if (event.key === 'Escape' && document.activeElement) {
          close()
          ;(document.activeElement as HTMLElement).blur()
        }
      }}
    >
      {trigger}
      <span
        ref={tooltipRef}
        id={tooltipId}
        role='tooltip'
        className={`${styles.tooltip} ${position === 'above' ? styles.tooltipAbove : styles.tooltipBelow}`}
        style={
          {
            '--tooltip-shift': `${shift}px`,
            '--tooltip-arrow-shift': `${arrowShift}px`
          } as React.CSSProperties
        }
      >
        {label}
      </span>
    </span>
  )
}

export function AboutPage() {
  const [isDark, setIsDark] = React.useState(true)

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('darkMode')
      if (saved !== null) setIsDark(JSON.parse(saved) as boolean)
    } catch {}
  }, [])

  React.useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDark))
  }, [isDark])

  return (
    <main className={`${styles.page} ${isDark ? styles.dark : styles.light}`}>
      <div className={styles.glow} aria-hidden='true' />

      <div className={styles.container}>
        <header className={`${styles.header} owner-mode-toggle-reveal-group`}>
          <div className={styles.headerLeft}>
            <h1 className={styles.nameRow}>
              <Link href='/' className={styles.wordmark}>
                Stephen Wu
              </Link>
            </h1>
            <span className={styles.title}>Engineering at Notion</span>
          </div>

          <nav className={styles.nav}>
            <ThemeToggle
              isDark={isDark}
              onToggle={() => setIsDark(!isDark)}
              className={styles.themeToggle}
            />
            <OwnerModeToggle
              className={`${styles.navIcon} ${styles.ownerModeToggle}`}
            />
            {x && (
              <a
                href={`https://x.com/${x}`}
                className={styles.navIcon}
                aria-label='X (Twitter)'
              >
                <XIcon />
              </a>
            )}
            {linkedin && (
              <a
                href={`https://linkedin.com/in/${linkedin}`}
                className={styles.navIcon}
                aria-label='LinkedIn'
              >
                <LinkedInIcon />
              </a>
            )}
            {github && (
              <a
                href={`https://github.com/${github}`}
                className={styles.navIcon}
                aria-label='GitHub'
              >
                <GitHubIcon />
              </a>
            )}
          </nav>
        </header>

        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <img
              src='/wustep.png'
              alt='Stephen Wu'
              className={styles.heroPhoto}
              draggable={false}
            />
            {/* Keep in sync with bioText above */}
            <p className={styles.bio}>
              I&apos;m Stephen, a product &amp; design engineer who now also
              manages engineers. I think a lot about tools for thought, software
              design, and{' '}
              <Tooltip
                inline
                label='Read my essay on moral philosophy and lenses'
              >
                <Link href='/philosophy' className={styles.bioHint}>
                  personal philosophy
                </Link>
              </Tooltip>
              . I grew up mostly in{' '}
              <Tooltip
                inline
                label='Los Angeles, CA → Toledo, OH → Seattle, WA → San Francisco, CA. I moved a lot!'
              >
                <span className={styles.bioHint}>Toledo, Ohio</span>
              </Tooltip>
              , and live in San Francisco now. I also enjoy{' '}
              <Tooltip
                inline
                label='Favorites: Slay the Spire 1 & 2, Monster Train, Balatro'
              >
                <span className={styles.bioHint}>roguelike deckbuilders</span>
              </Tooltip>
              , piano improvisation, and making{' '}
              <Tooltip inline label='Check out my playground of lil tech demos'>
                <Link href='/playground' className={styles.bioHint}>
                  random web projects
                </Link>
              </Tooltip>
              .
            </p>
          </div>
        </section>

        <section className={styles.work}>
          <div className={styles.sectionHeader}>
            <h2>Experience</h2>
          </div>
          {workHistory.map((company, companyIndex) => (
            <div
              key={company.company}
              className={styles.workGroup}
              style={{ animationDelay: `${companyIndex * 60 + 90}ms` }}
            >
              <div className={styles.workLeft}>
                <span className={styles.workIcon}>
                  {company.icon === 'notion' && (
                    <NotionIconSmall isDark={isDark} />
                  )}
                  {company.icon === 'facebook' && <FacebookIconSmall />}
                  {company.icon === 'osu' && <OhioStateIcon />}
                </span>
                {company.url ? (
                  <a
                    href={company.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={styles.workCompany}
                  >
                    {company.company}
                  </a>
                ) : (
                  <span className={styles.workCompany}>{company.company}</span>
                )}
              </div>
              <div className={styles.workRoles}>
                {company.roles.map((role, roleIndex) => (
                  <div key={roleIndex} className={styles.workRoleRow}>
                    <span className={styles.workRole}>{role.title}</span>
                    <span className={styles.workPeriod}>{role.period}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className={styles.projects}>
          <div className={styles.sectionHeader}>
            <Link href='/projects' className={styles.sectionTitleLink}>
              <h2>Projects</h2>
            </Link>
            <div className={styles.sectionLinks}>
              <DesignButton
                className={`${styles.sectionLink} ${styles.designLink}`}
              />
              <Tooltip label='Check out my playground of lil tech demos'>
                <LabsButton
                  className={`${styles.sectionLink} ${styles.playgroundLink}`}
                />
              </Tooltip>
              <Link
                href='/projects'
                className={styles.chevron}
                aria-label='View all projects'
              >
                <ChevronIcon />
              </Link>
            </div>
          </div>
          <div className={styles.projectGrid}>
            <Tooltip label='Behind the scenes of building and designing dashboards'>
              <a
                href='https://x.com/wustep/article/2032479265300852817'
                className={`${styles.projectCard} ${styles.featured}`}
              >
                <div className={styles.projectImage}>
                  <img
                    src='/dashboards-notion.jpg'
                    alt='Dashboards at Notion'
                    width={2400}
                    height={960}
                    draggable={false}
                  />
                </div>
                <div className={styles.projectOverlay}>
                  <span className={styles.projectLogo}>
                    <NotionLogo />
                  </span>
                  <h3>Building Dashboards at Notion</h3>
                </div>
              </a>
            </Tooltip>

            <Tooltip label='Database infrastructure and builder UX'>
              <a
                href='/notion'
                className={`${styles.projectCard} ${styles.compact}`}
              >
                <span className={styles.projectLogo}>
                  <NotionLogo />
                </span>
                <h3>Databases</h3>
              </a>
            </Tooltip>

            <Tooltip label='Read my badge post about my 3 years at Facebook'>
              <a
                href='/so-long-meta'
                className={`${styles.projectCard} ${styles.compact}`}
              >
                <span className={styles.projectLogo}>
                  <FacebookLogo />
                </span>
                <h3>Profiles</h3>
              </a>
            </Tooltip>

            <div className={styles.projectDivider} />

            <Tooltip label='A canvas of lenses for seeing the world'>
              <a
                href='/lenses'
                className={`${styles.projectCard} ${styles.lenses}`}
              >
                <div className={styles.lensesArt} aria-hidden='true'>
                  <Illustration
                    id='lenses-deck'
                    fg={isDark ? '#e8e8e8' : '#4d4d4d'}
                    bg='transparent'
                    accent={isDark ? '#f0a85a' : '#c2701f'}
                  />
                </div>
                <h3>Lenses</h3>
              </a>
            </Tooltip>

            <Tooltip label='Matter.js and pretext playground with playful DOM interactions'>
              <a
                href='/playground/dom-ino'
                className={`${styles.projectCard} ${styles.domino}`}
              >
                <div className={styles.dominoTitle}>
                  <span>DOM</span>
                  <span className={styles.dominoBlock}>ino</span>
                </div>
              </a>
            </Tooltip>

            <Tooltip label='An interactive bookshelf of my reading list'>
              <a
                href='/playground/bookshelf'
                className={`${styles.projectCard} ${styles.bookshelf}`}
              >
                <div className={styles.bookshelfBooks}>
                  <span
                    className={styles.book}
                    style={{ background: '#e74c3c', height: '70%' }}
                  />
                  <span
                    className={styles.book}
                    style={{ background: '#3b82f6', height: '85%' }}
                  />
                  <span
                    className={styles.book}
                    style={{ background: '#22c55e', height: '60%' }}
                  />
                  <span
                    className={styles.book}
                    style={{ background: '#f59e0b', height: '90%' }}
                  />
                  <span
                    className={styles.book}
                    style={{ background: '#a855f7', height: '75%' }}
                  />
                  <span
                    className={styles.book}
                    style={{ background: '#06b6d4', height: '65%' }}
                  />
                  <span
                    className={styles.book}
                    style={{ background: '#ec4899', height: '80%' }}
                  />
                </div>
                <h3>Bookshelf</h3>
              </a>
            </Tooltip>

            <Tooltip label='A browser-based Spot It! card game'>
              <a
                href='/playground/spot-it'
                className={`${styles.projectCard} ${styles.spotIt}`}
              >
                <div className={styles.spotItCards} aria-hidden='true'>
                  <svg
                    className={`${styles.spotItCard} ${styles.spotItCardBack}`}
                    viewBox='0 0 100 100'
                    fill='none'
                  >
                    <circle
                      cx='50'
                      cy='50'
                      r='48'
                      className={styles.spotItCardFill}
                    />
                    <circle
                      cx='50'
                      cy='50'
                      r='46'
                      className={styles.spotItCardStroke}
                    />
                  </svg>
                  <svg
                    className={styles.spotItCard}
                    viewBox='0 0 100 100'
                    fill='none'
                  >
                    <circle
                      cx='50'
                      cy='50'
                      r='48'
                      className={styles.spotItCardFill}
                    />
                    <circle
                      cx='50'
                      cy='50'
                      r='46'
                      className={styles.spotItCardStroke}
                    />
                    <polygon
                      className={styles.spotItSymbol}
                      points='30,20 32.5,27 40,27 34,31.5 36,39 30,35 24,39 26,31.5 20,27 27.5,27'
                      fill='#f59e0b'
                    />
                    <path
                      className={styles.spotItSymbol}
                      d='M70,28 C70,24 74,22 76,24 C78,22 82,24 82,28 C82,33 76,37 76,37 C76,37 70,33 70,28Z'
                      fill='#ec4899'
                    />
                    <polygon
                      className={styles.spotItSymbol}
                      points='52,14 48,28 53,26 49,40 57,23 52,25'
                      fill='#fb923c'
                    />
                    <polygon
                      className={styles.spotItSymbol}
                      points='24,55 31,48 38,55 31,62'
                      fill='#3b82f6'
                    />
                    <circle
                      className={styles.spotItSymbol}
                      cx='70'
                      cy='58'
                      r='8'
                      fill='#22c55e'
                    />
                    <polygon
                      className={styles.spotItSymbol}
                      points='50,60 42,74 58,74'
                      fill='#e74c3c'
                    />
                    <g className={styles.spotItSymbol}>
                      <rect
                        x='22'
                        y='77'
                        width='12'
                        height='4'
                        rx='1'
                        fill='#a855f7'
                      />
                      <rect
                        x='26'
                        y='73'
                        width='4'
                        height='12'
                        rx='1'
                        fill='#a855f7'
                      />
                    </g>
                    <path
                      className={styles.spotItSymbol}
                      d='M72,76 A7,7 0 1,1 72,90 A5,5 0 1,0 72,76Z'
                      fill='#06b6d4'
                    />
                  </svg>
                </div>
                <h3>Spot it!</h3>
              </a>
            </Tooltip>
          </div>
        </section>

        <section className={styles.writing}>
          <Link href='/writing' className={styles.sectionHeader}>
            <h2>Writing</h2>
            <span className={styles.chevron}>
              <ChevronIcon />
            </span>
          </Link>
          <div className={styles.writingColumns}>
            <div className={styles.writingColumn}>
              <h3>Software</h3>
              <div className={styles.writingList}>
                {writingSoftware.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={styles.writingLink}
                  >
                    <span className={styles.writingTitle}>{item.title}</span>
                    <span className={styles.writingNote}>{item.note}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className={styles.writingColumn}>
              <h3>Personal</h3>
              <div className={styles.writingList}>
                {writingPersonal.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={styles.writingLink}
                  >
                    <span className={styles.writingTitle}>{item.title}</span>
                    <span className={styles.writingNote}>{item.note}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <Tooltip
            label='Thanks for stopping by! Feel free to reach out here'
            position='above'
          >
            <a href='/contact' className={styles.contactLink}>
              Get in touch →
            </a>
          </Tooltip>
        </footer>
      </div>
    </main>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
      <path d='M9 18l6-6-6-6' />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor'>
      <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor'>
      <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor'>
      <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
    </svg>
  )
}

function NotionIconSmall({ isDark }: { isDark: boolean }) {
  if (isDark) {
    return (
      <svg viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M6.017 4.313l55.333 -4.087c6.797 -0.583 8.543 -0.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 0.193 -6.023 -0.39 -8.16 -3.113L3.3 79.94c-2.333 -3.113 -3.3 -5.443 -3.3 -8.167V11.113c0 -3.497 1.553 -6.413 6.017 -6.8z'
          fill='#fff'
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M61.35 0.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723 0.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257 -3.89c5.433 -0.387 6.99 -2.917 6.99 -7.193V20.64c0 -2.21 -0.873 -2.847 -3.443 -4.733L74.167 3.143c-4.273 -3.107 -6.02 -3.5 -12.817 -2.917zM25.92 19.523c-5.247 0.353 -6.437 0.433 -9.417 -1.99L8.927 11.507c-0.77 -0.78 -0.383 -1.753 1.557 -1.947l53.193 -3.887c4.467 -0.39 6.793 1.167 8.54 2.527l9.123 6.61c0.39 0.197 1.36 1.36 0.193 1.36l-54.933 3.307 -0.68 0.047zM19.803 88.3V30.367c0 -2.53 0.777 -3.697 3.103 -3.893L86 22.78c2.14 -0.193 3.107 1.167 3.107 3.693v57.547c0 2.53 -0.39 4.67 -3.883 4.863l-60.377 3.5c-3.493 0.193 -5.043 -0.97 -5.043 -4.083zm59.6 -54.827c0.387 1.75 0 3.5 -1.75 3.7l-2.91 0.577v42.773c-2.527 1.36 -4.853 2.137 -6.797 2.137 -3.107 0 -3.883 -0.973 -6.21 -3.887l-19.03 -29.94v28.967l6.02 1.363s0 3.5 -4.857 3.5l-13.39 0.777c-0.39 -0.78 0 -2.723 1.357 -3.11l3.497 -0.97v-38.3L30.48 40.667c-0.39 -1.75 0.58 -4.277 3.3 -4.473l14.367 -0.967 19.8 30.327v-26.83l-5.047 -0.58c-0.39 -2.143 1.163 -3.7 3.103 -3.89l13.4 -0.78z'
          fill='#0d0d0d'
        />
      </svg>
    )
  }
  return (
    <svg viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M61.35 0.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723 0.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257 -3.89c5.433 -0.387 6.99 -2.917 6.99 -7.193V20.64c0 -2.21 -0.873 -2.847 -3.443 -4.733L74.167 3.143c-4.273 -3.107 -6.02 -3.5 -12.817 -2.917zM25.92 19.523c-5.247 0.353 -6.437 0.433 -9.417 -1.99L8.927 11.507c-0.77 -0.78 -0.383 -1.753 1.557 -1.947l53.193 -3.887c4.467 -0.39 6.793 1.167 8.54 2.527l9.123 6.61c0.39 0.197 1.36 1.36 0.193 1.36l-54.933 3.307 -0.68 0.047zM19.803 88.3V30.367c0 -2.53 0.777 -3.697 3.103 -3.893L86 22.78c2.14 -0.193 3.107 1.167 3.107 3.693v57.547c0 2.53 -0.39 4.67 -3.883 4.863l-60.377 3.5c-3.493 0.193 -5.043 -0.97 -5.043 -4.083zm59.6 -54.827c0.387 1.75 0 3.5 -1.75 3.7l-2.91 0.577v42.773c-2.527 1.36 -4.853 2.137 -6.797 2.137 -3.107 0 -3.883 -0.973 -6.21 -3.887l-19.03 -29.94v28.967l6.02 1.363s0 3.5 -4.857 3.5l-13.39 0.777c-0.39 -0.78 0 -2.723 1.357 -3.11l3.497 -0.97v-38.3L30.48 40.667c-0.39 -1.75 0.58 -4.277 3.3 -4.473l14.367 -0.967 19.8 30.327v-26.83l-5.047 -0.58c-0.39 -2.143 1.163 -3.7 3.103 -3.89l13.4 -0.78z'
        fill='#000'
      />
    </svg>
  )
}

function FacebookIconSmall() {
  return (
    <svg viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <linearGradient
          id='fb-grad-small'
          x1='50%'
          x2='50%'
          y1='97.078%'
          y2='0%'
        >
          <stop offset='0%' stopColor='#0062E0' />
          <stop offset='100%' stopColor='#19AFFF' />
        </linearGradient>
      </defs>
      <path
        d='M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z'
        fill='url(#fb-grad-small)'
      />
      <path
        d='M25 23l.8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z'
        fill='#fff'
      />
    </svg>
  )
}

function OhioStateIcon() {
  return (
    <img
      src='/ohio-state.png'
      alt='Ohio State'
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        marginLeft: '2px'
      }}
    />
  )
}

function NotionLogo() {
  return (
    <svg viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M6.017 4.313l55.333 -4.087c6.797 -0.583 8.543 -0.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 0.193 -6.023 -0.39 -8.16 -3.113L3.3 79.94c-2.333 -3.113 -3.3 -5.443 -3.3 -8.167V11.113c0 -3.497 1.553 -6.413 6.017 -6.8z'
        fill='#fff'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M61.35 0.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723 0.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257 -3.89c5.433 -0.387 6.99 -2.917 6.99 -7.193V20.64c0 -2.21 -0.873 -2.847 -3.443 -4.733L74.167 3.143c-4.273 -3.107 -6.02 -3.5 -12.817 -2.917zM25.92 19.523c-5.247 0.353 -6.437 0.433 -9.417 -1.99L8.927 11.507c-0.77 -0.78 -0.383 -1.753 1.557 -1.947l53.193 -3.887c4.467 -0.39 6.793 1.167 8.54 2.527l9.123 6.61c0.39 0.197 1.36 1.36 0.193 1.36l-54.933 3.307 -0.68 0.047zM19.803 88.3V30.367c0 -2.53 0.777 -3.697 3.103 -3.893L86 22.78c2.14 -0.193 3.107 1.167 3.107 3.693v57.547c0 2.53 -0.39 4.67 -3.883 4.863l-60.377 3.5c-3.493 0.193 -5.043 -0.97 -5.043 -4.083zm59.6 -54.827c0.387 1.75 0 3.5 -1.75 3.7l-2.91 0.577v42.773c-2.527 1.36 -4.853 2.137 -6.797 2.137 -3.107 0 -3.883 -0.973 -6.21 -3.887l-19.03 -29.94v28.967l6.02 1.363s0 3.5 -4.857 3.5l-13.39 0.777c-0.39 -0.78 0 -2.723 1.357 -3.11l3.497 -0.97v-38.3L30.48 40.667c-0.39 -1.75 0.58 -4.277 3.3 -4.473l14.367 -0.967 19.8 30.327v-26.83l-5.047 -0.58c-0.39 -2.143 1.163 -3.7 3.103 -3.89l13.4 -0.78z'
        fill='#000'
      />
    </svg>
  )
}

function FacebookLogo() {
  return (
    <svg viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <linearGradient id='fb-grad' x1='50%' x2='50%' y1='97.078%' y2='0%'>
          <stop offset='0%' stopColor='#0062E0' />
          <stop offset='100%' stopColor='#19AFFF' />
        </linearGradient>
      </defs>
      <path
        d='M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z'
        fill='url(#fb-grad)'
      />
      <path
        d='M25 23l.8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z'
        fill='#fff'
      />
    </svg>
  )
}
