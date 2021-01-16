import * as React from 'react'
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa'

import styles from './styles.module.css'

export const Footer: React.FC<{}> = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>Copyright 2021 Travis Fischer</div>
      <div className={styles.social}>
        <a
          className={styles.twitter}
          href='https://twitter.com/transitive_bs'
          title='Twitter @transitive_bs'
          target='_blank'
          rel='noopener noreferrer'
        >
          <FaTwitter />
        </a>

        <a
          className={styles.github}
          href='https://github.com/transitive-bullshit'
          title='GitHub @transitive-bullshit'
          target='_blank'
          rel='noopener noreferrer'
        >
          <FaGithub />
        </a>

        <a
          className={styles.linkedin}
          href='https://www.linkedin.com/in/fisch2'
          title='LinkedIn Travis Fischer'
          target='_blank'
          rel='noopener noreferrer'
        >
          <FaLinkedin />
        </a>
      </div>
    </footer>
  )
}
