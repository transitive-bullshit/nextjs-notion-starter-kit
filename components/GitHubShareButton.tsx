import React from 'react'

import styles from './styles.module.css'

export const GitHubShareButton: React.FC = () => {
  return (
    <a
      href='https://www.linkedin.com/in/product-owner-herman'
      target='_blank'
      rel='noopener noreferrer'
      className={styles.githubCorner}
      aria-label='View my iN Profile'
    >

      <img src="./public/LinkedIn_icon_circle.svg.png"/>
      
    </a>
  )
}
