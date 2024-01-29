import * as React from 'react'

import cs from 'classnames'

import * as config from '@/lib/config'

import styles from './PageSocial.module.css'

import { FaEnvelopeOpenText } from '@react-icons/all-files/fa/FaEnvelopeOpenText'
import { FaGithub } from '@react-icons/all-files/fa/FaGithub'
import { FaLinkedin } from '@react-icons/all-files/fa/FaLinkedin'
import { FaTwitter } from '@react-icons/all-files/fa/FaTwitter'
import { FaYoutube } from '@react-icons/all-files/fa/FaYoutube'
import { FaReddit } from '@react-icons/all-files/fa/FaReddit'
import { FaInstagram } from '@react-icons/all-files/fa/FaInstagram'

interface SocialLink {
  name: string
  title: string
  icon: React.ReactNode
  href?: string
}

const socialLinks: SocialLink[] = [
  config.twitter && {
    name: 'twitter',
    href: `https://twitter.com/${config.twitter}`,
    title: `Twitter @${config.twitter}`,
    icon: (
      <FaTwitter />
    )
  },

  config.github && {
    name: 'github',
    href: `https://github.com/${config.github}`,
    title: `GitHub @${config.github}`,
    icon: (
      <FaGithub />
    )
  },

  config.linkedin && {
    name: 'linkedin',
    href: `https://www.linkedin.com/in/${config.linkedin}`,
    title: `LinkedIn ${config.author}`,
    icon: (
      <FaLinkedin />
    )
  },

  config.newsletter && {
    name: 'newsletter',
    href: `${config.newsletter}`,
    title: `Newsletter ${config.author}`,
    icon: (
      <FaEnvelopeOpenText />
    )
  },

  config.instagram && {
    name: 'instagram',
    href: `https://www.instagram.com/${config.instagram}`,
    title: `Instagram @${config.instagram}`,
    icon: (
      <FaInstagram />
    )
  },

  config.youtube && {
    name: 'youtube',
    href: `https://www.youtube.com/${config.youtube}`,
    title: `YouTube @${config.youtube}`,
    icon: (
      <FaYoutube />
    )
  },

  config.reddit && {
    name: 'reddit',
    href: `https://www.reddit.com/u/${config.reddit}`,
    title: `Reddit @${config.reddit}`,
    icon: (
      <FaReddit />
    )
  }
].filter(Boolean)

export const PageSocial: React.FC = () => {
  return (
    <div className={styles.pageSocial}>
      {socialLinks.map((action) => (
        <a
          className={cs(styles.action, styles[action.name])}
          href={action.href}
          key={action.name}
          title={action.title}
          target='_blank'
          rel='noopener noreferrer'
        >
          <div className={styles.actionBg}>
            <div className={styles.actionBgPane} />
          </div>

          <div className={styles.actionBg}>{action.icon}</div>
        </a>
      ))}
    </div>
  )
}
