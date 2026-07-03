import type * as React from 'react'

import * as config from '@/lib/config'
import { cn } from '@/lib/utils'

import {
  GithubIcon,
  LinkedinIcon,
  NewsletterIcon,
  XIcon,
  YoutubeIcon
} from '../icons/SocialIcons'
import styles from './PageSocial.module.css'

interface SocialLink {
  name: string
  title: string
  icon: React.ReactNode
  href?: string
}

const socialLinks: SocialLink[] = [
  config.x && {
    name: 'x',
    href: `https://x.com/${config.x}`,
    title: `X @${config.x}`,
    icon: <XIcon />
  },

  config.github && {
    name: 'github',
    href: `https://github.com/${config.github}`,
    title: `GitHub @${config.github}`,
    icon: <GithubIcon />
  },

  config.linkedin && {
    name: 'linkedin',
    href: `https://www.linkedin.com/in/${config.linkedin}`,
    title: `LinkedIn ${config.author}`,
    icon: <LinkedinIcon />
  },

  config.newsletter && {
    name: 'newsletter',
    href: `${config.newsletter}`,
    title: `Newsletter ${config.author}`,
    icon: <NewsletterIcon />
  },

  config.youtube && {
    name: 'youtube',
    href: `https://www.youtube.com/${config.youtube}`,
    title: `YouTube ${config.youtube}`,
    icon: <YoutubeIcon />
  }
].filter(Boolean)

export function PageSocial() {
  return (
    <div className={styles.pageSocial}>
      {socialLinks.map((action) => (
        <a
          className={cn(styles.action, styles[action.name])}
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
