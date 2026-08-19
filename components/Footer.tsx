'use client'

import * as React from 'react'

import * as config from '@/lib/config'
import { GitHubIcon } from '@/lib/icons/github'

import landingStyles from './landing-footer.module.css'

interface FooterProps {
  gitCommitSha?: string
  sourceNotionPageId?: string
}

const sourceRepositoryUrl =
  'https://github.com/transitive-bullshit/nextjs-notion-starter-kit'
const fullGitCommitPattern = /^[0-9a-f]{40}$/i

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23'
})

function useLiveMetadata() {
  const [time, setTime] = React.useState('--:--:--')
  const [viewport, setViewport] = React.useState('--- × ---')
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    let resizeFrame: number | undefined

    const updateTime = () => setTime(timeFormatter.format(new Date()))
    const updateViewport = () => {
      setViewport(`${window.innerWidth} × ${window.innerHeight}`)
    }
    const scheduleViewportUpdate = () => {
      if (resizeFrame !== undefined) window.cancelAnimationFrame(resizeFrame)
      resizeFrame = window.requestAnimationFrame(updateViewport)
    }

    updateTime()
    updateViewport()
    setIsReady(true)

    const timer = window.setInterval(updateTime, 1000)
    window.addEventListener('resize', scheduleViewportUpdate, {
      passive: true
    })

    return () => {
      window.clearInterval(timer)
      window.removeEventListener('resize', scheduleViewportUpdate)
      if (resizeFrame !== undefined) window.cancelAnimationFrame(resizeFrame)
    }
  }, [])

  return { time, viewport, isReady }
}

export function FooterImpl({ gitCommitSha, sourceNotionPageId }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const { time, viewport, isReady } = useLiveMetadata()
  const candidateGitCommitSha =
    gitCommitSha?.trim() || process.env.NEXT_PUBLIC_BUILD_GIT_SHA?.trim()
  const resolvedGitCommitSha = fullGitCommitPattern.test(
    candidateGitCommitSha ?? ''
  )
    ? candidateGitCommitSha
    : undefined
  const gitCommitUrl = resolvedGitCommitSha
    ? `${sourceRepositoryUrl}/commit/${encodeURIComponent(resolvedGitCommitSha)}`
    : sourceRepositoryUrl
  const shortGitCommitSha = resolvedGitCommitSha?.slice(0, 7)
  const sourceNotionUrl = sourceNotionPageId
    ? `https://www.notion.so/${sourceNotionPageId.replaceAll('-', '')}`
    : undefined

  return (
    <footer className={landingStyles.footer}>
      <nav
        className={landingStyles.primaryLinks}
        aria-label='Project and social links'
      >
        <a
          className={landingStyles.primaryLink}
          href={sourceRepositoryUrl}
          target='_blank'
          rel='noopener noreferrer'
        >
          <span className={landingStyles.primaryLabel}>
            <GitHubIcon />
            GitHub
          </span>
          <span className={landingStyles.primaryHandle}>
            nextjs-notion-starter-kit
            <span aria-hidden='true'>↗</span>
          </span>
        </a>

        {config.twitter && (
          <a
            className={landingStyles.primaryLink}
            href={`https://x.com/${config.twitter}`}
            aria-label={`Twitter @${config.twitter} — online`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <span className={landingStyles.primaryLabel}>
              <span className={landingStyles.statusDot} aria-hidden='true' />
              Twitter
            </span>
            <span className={landingStyles.primaryHandle}>
              @{config.twitter}
              <span aria-hidden='true'>↗</span>
            </span>
          </a>
        )}
      </nav>

      <dl className={landingStyles.metadata} aria-label='Live page metadata'>
        <div className={landingStyles.metadataItem}>
          <dt>Build</dt>
          <dd className={landingStyles.metadataLink}>
            {shortGitCommitSha ? (
              <a
                href={gitCommitUrl}
                title={`View commit ${resolvedGitCommitSha}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <code>{shortGitCommitSha}</code>
                <span aria-hidden='true'>↗</span>
              </a>
            ) : (
              <span>Local</span>
            )}
          </dd>
        </div>
        <div className={landingStyles.metadataItem}>
          <dt>Local time</dt>
          <dd
            className={landingStyles.liveValue}
            data-ready={isReady ? 'true' : 'false'}
          >
            <time>{time}</time>
          </dd>
        </div>
        <div className={landingStyles.metadataItem}>
          <dt>Viewport</dt>
          <dd
            className={landingStyles.liveValue}
            data-ready={isReady ? 'true' : 'false'}
          >
            <output>{viewport}</output>
          </dd>
        </div>
        <div className={landingStyles.metadataItem}>
          <dt>Notion</dt>
          <dd className={landingStyles.metadataLink}>
            {sourceNotionUrl ? (
              <a
                href={sourceNotionUrl}
                target='_blank'
                rel='noopener noreferrer'
              >
                Public page
                <span aria-hidden='true'>↗</span>
              </a>
            ) : (
              <span>Unavailable</span>
            )}
          </dd>
        </div>
      </dl>

      <div className={landingStyles.bottomLine}>
        <p>© {currentYear} Travis Fischer</p>
        <nav className={landingStyles.utilityLinks} aria-label='More links'>
          <a
            href={sourceRepositoryUrl}
            target='_blank'
            rel='noopener noreferrer'
          >
            Source code
          </a>
        </nav>
      </div>
    </footer>
  )
}

export const Footer = React.memo(FooterImpl)
