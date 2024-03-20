import * as React from 'react'

import styles from './styles.module.css'

export const GitHubShareButton: React.FC = () => {
  return (
    <a
      href='https://blog.buhe.dev/feed'
      target='_blank'
      rel='noopener noreferrer'
      className={styles.githubCorner}
      aria-label='View source on GitHub'
    >
      <svg
        width='100'
        height='100'
        viewBox='0 0 450 450'
        style={{
          fill: '#70B7FD',
          color: '#fff',
          position: 'absolute',
          zIndex: 1001,
          top: 0,
          right: 0,
          border: 0,
          transform: 'scale(0.5, 0.5)'
        }}
        aria-hidden='true'
      >
        <g>
          <rect x="0" y="0" style={{ fill: '#F78422' }} width="1200" height="1200" />
          <g>
            <path style={{ fill: '#FFFFFF' }} d="M296.208,159.16C234.445,97.397,152.266,63.382,64.81,63.382v64.348
			c70.268,0,136.288,27.321,185.898,76.931c49.609,49.61,76.931,115.63,76.931,185.898h64.348
			C391.986,303.103,357.971,220.923,296.208,159.16z"/>
            <path style={{ fill: '#FFFFFF' }} d="M64.143,172.273v64.348c84.881,0,153.938,69.056,153.938,153.939h64.348
			C282.429,270.196,184.507,172.273,64.143,172.273z"/>
            <circle style={{ fill: '#FFFFFF' }} cx="109.833" cy="346.26" r="46.088" />
          </g>
        </g>
      </svg>
    </a>
  )
}
