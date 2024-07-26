import * as React from 'react'

import cs from 'classnames'

import * as config from '@/lib/config'

import styles from './PageSocial.module.css'
import { FaGithub, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa'
import { FaXTwitter, FaGitlab, FaEnvelopeOpenText } from 'react-icons/fa6'
import { IoIosBug } from 'react-icons/io'



interface SocialLink {
  name: string;
  title: string;
  icon: ({ size }: { size: number }) => React.ReactNode;
  color: string;
  href?: string;
};

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
    href: `https://twitter.com/${config.twitterX}`,
    title: `X @${config.twitterX}`,
    color: "#222",
    icon: FaXTwitter
  },

  config.github && {
    name: 'github',
    href: `https://github.com/${config.github}`,
    title: `GitHub @${config.github}`,
    color: "#c9510c",
    icon: FaGithub
  },

  config.gitlab && {
    name: 'github',
    href: `https://github.com/${config.github}`,
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
    title: `YouTube ${config.youtube}`,
    color: "#ff0000",
    icon: FaYoutube
  },

  config.bugtracker && {
    name: 'bugtracker',
    href: `${config.bugtracker}`,
    title: `Bugtracker`,
    color: "#e24329",
    icon: IoIosBug
  }
].filter(Boolean)

function generateCssFrag(prefix: string) {
  return socialLinks.map((action) => (
    `.social-link-${prefix}-${action.name} {}
    .social-link-${prefix}-${action.name}:hover {
      background: ${action.color};
      color: white;
    }
    `
  )).join('\n');
}

export const PageSocial: React.FC = (prefix: string) => {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{ __html: generateCssFrag("side") }}
      />
      <div className={styles.pageSocial}>
        {socialLinks.map((action) => (
          <>
            <a
              className={cs(styles.action, styles[action.name], `social-link-side-${action.name}`)}
              href={action.href}
              key={action.name}
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
