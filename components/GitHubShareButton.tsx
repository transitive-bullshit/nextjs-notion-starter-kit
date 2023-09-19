import * as React from 'react'

import * as config from '@/lib/config'

import styles from './styles.module.css'

export const GitHubShareButton: React.FC = () => {
  return (
    <a
      href={config.homepage}
      target='_blank'
      rel='noopener noreferrer'
      className={styles.githubCorner}
      aria-label='View source on GitHub'
    >
      <svg
        width='80'
        height='80'
        viewBox='0 0 250 250'
        style={{
          fill: '#70B7FD',
          color: '#fff',
          position: 'absolute',
          zIndex: 1001,
          top: 0,
          right: 0,
          border: 0,
          transform: 'scale(1, 1)'
        }}
        aria-hidden='true'
      >
        <path d='M0,0 L115,115  L250,250 L250,0 Z' />
        {/* Text : Download */}
        <text
          x='130'
          y='100'
          style={{
            fill: '#fff',
            fontSize: '36px',
            fontWeight: 600,
            fontFamily: 'sans-serif',
            zIndex: 1001,
            color: '#fff'
          }}
          // transform='scale(.1)'
          transform='rotate(45 120 120)'
          textAnchor='middle'
        >
          DOWNLOAD{' '}
        </text>
      </svg>
    </a>
  )
}
