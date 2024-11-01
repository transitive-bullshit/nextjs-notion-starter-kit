import type * as React from 'react'
import cs from 'classnames'

import * as config from '@/lib/config'

import styles from './PageSocial.module.css'
import { FaGithub, FaInstagram, FaLinkedin, FaMastodon, FaReddit, FaTwitter, FaYoutube } from 'react-icons/fa'
import { FaXTwitter, FaGitlab, FaEnvelopeOpenText } from 'react-icons/fa6'
import { IoIosBug } from 'react-icons/io'

interface SocialLink {
  name: string
  title: string
  icon: ({ size }: { size: number }) => React.ReactNode
  color: string
  href?: string
}

export const socialLinks: SocialLink[] = [
  config.twitter && {
    name: 'twitter',
    href: `https://twitter.com/${config.twitter}`,
    title: `Twitter @${config.twitter}`,
    color: "#2795e9",
    icon: FaTwitter
  },
  config.twitterX && {
    name: 'twitterX',
    href: `https://x.com/${config.twitterX}`,
    title: `X.com @${config.twitterX}`,
    color: "#222",
    icon: FaXTwitter
  },

  config.mastodon && {
    name: 'mastodon',
    href: config.mastodon,
    title: `Mastodon`,
    color: "#5a4be1",
    icon: FaMastodon
  },

  config.github && {
    name: 'github',
    href: `https://github.com/${config.github}`,
    title: `GitHub @${config.github}`,
    color: "#c9510c",
    icon: FaGithub
  },

  config.gitlab && {
    name: 'gitlab',
    href: `https://gitlab.com/${config.github}`,
    title: `GitLab @${config.github}`,
    color: "#e24329",
    icon: FaGitlab
  },

  config.linkedin && {
    name: 'linkedin',
    href: `https://www.linkedin.com/in/${config.linkedin}`,
    title: `LinkedIn ${config.author}`,
    color: "#0077b5",
    icon: FaLinkedin
  },

  config.newsletter && {
    name: 'newsletter',
    href: `${config.newsletter}`,
    title: `Newsletter ${config.author}`,
    color: "#777",
    icon: FaEnvelopeOpenText
  },

  config.youtube && {
    name: 'youtube',
    href: `https://www.youtube.com/${config.youtube}`,
    title: `YouTube @${config.youtube}`,
    color: "#ff0000",
    icon: FaYoutube
  },

  config.instagram && {
    name: 'instagram',
    href: `https://instagram.com/${config.instagram}`,
    title: `Instagram @${config.instagram}`,
    color: "#ff0000",
    icon: FaInstagram
  },

  config.reddit && {
    name: 'reddit',
    href: `https://www.reddit.com/u/${config.reddit}`,
    title: `Reddit @${config.reddit}`,
    color: "#ff0000",
    icon: FaReddit
  },

  config.bugtracker && {
    name: 'bugtracker',
    href: `${config.bugtracker}`,
    title: 'Bugtracker',
    color: "#e24329",
    icon: IoIosBug
  }
].filter(Boolean)

export function PageSocial(prefix: string) {
  return (
    <>
      <div className={styles.pageSocial}>
        {socialLinks.map((action) => (
          <>
            <a
              key={action.name}
              style={{ '--hover-color': action.color } as React.CSSProperties}
              className={cs(styles.action, styles[action.name], styles.socialLink)}
              href={action.href}
              title={action.title}
              target='_blank'
              rel='noopener noreferrer'
            >
              <div className={styles.actionBg}>
                <div className={styles.actionBgPane} />
              </div>

              <div className={styles.actionBg}>{action.icon({ size: 24 })}</div>
            </a>
          </>
        ))}
      </div>
    </>
  )
}

export function PageSocialButtons() {
  return (
    <>
      {socialLinks.map((action) => (
        <a
          key={action.name}
          style={{ '--hover-color': action.color } as React.CSSProperties}
          className={cs(styles[action.name], styles.socialLink)}
          href={action.href}
          title={action.title}
          target='_blank'
          rel='noopener noreferrer'
        >
          {action.icon({ size: 32 })}
        </a>
      ))}
    </>
  )
}
