import Image from 'next/image'

import { twitter } from '@/lib/config'

import styles from './author-letter.module.css'

const X_URL = `https://x.com/${twitter ?? 'transitive_bs'}`
const GITHUB_URL =
  'https://github.com/transitive-bullshit/nextjs-notion-starter-kit'

export function AuthorLetter() {
  return (
    <section
      className={styles.letter}
      id='author-letter'
      aria-labelledby='author-letter-title'
    >
      <div className={styles.inner}>
        <header className={styles.identity}>
          <a
            className={styles.avatarLink}
            href={X_URL}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={`Twitter @${twitter ?? 'transitive_bs'} (opens in a new tab)`}
          >
            <Image
              className={styles.avatar}
              src='/page-icon.png'
              alt='Travis Fischer'
              width={64}
              height={64}
            />
          </a>
          <p className={styles.kicker}>Travis Fischer</p>
        </header>

        <h2 className={styles.title} id='author-letter-title'>
          My heart is open source 💕
        </h2>

        <div className={styles.body}>
          <p className={styles.lead}>
            I'm currently focused on making AI futures feel real via stories,
            OSS tools, and memes. This site is a personal playground and blog.
            It uses{' '}
            <a
              className={styles.link}
              href='https://www.notion.so'
              target='_blank'
              rel='noopener noreferrer'
            >
              Notion
            </a>{' '}
            as a CMS and is{' '}
            <a
              className={styles.link}
              href={GITHUB_URL}
              target='_blank'
              rel='noopener noreferrer'
            >
              open source and forkable
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
