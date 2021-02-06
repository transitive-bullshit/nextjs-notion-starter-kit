import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'

import { ArticleSharedElement } from './ArticleViewTransitions'
import styles from './article-masthead.module.css'

export type ArticleMastheadProps = {
  author: string
  coverAlt?: string
  coverPosition?: number | string
  coverUrl: string
  description: string
  iconEmoji?: string
  iconUrl?: string
  pageId: string
  published: string
  readingLength: string
  tags: readonly string[]
  title: string
}

function getCoverStyle(
  coverPosition: ArticleMastheadProps['coverPosition']
): CSSProperties {
  if (typeof coverPosition === 'number') {
    const normalizedPosition = Math.min(Math.max(coverPosition, 0), 1)

    return {
      objectPosition: `center ${(1 - normalizedPosition) * 100}%`
    }
  }

  return {
    objectPosition: coverPosition || 'center'
  }
}

export function ArticleMasthead({
  author,
  coverAlt = '',
  coverPosition,
  coverUrl,
  description,
  iconEmoji,
  iconUrl,
  pageId,
  published,
  readingLength,
  tags,
  title
}: ArticleMastheadProps) {
  const coverStyle = getCoverStyle(coverPosition)

  return (
    <section className={styles.masthead} aria-labelledby='article-title'>
      <div className={styles.copy}>
        <div className={styles.topline}>
          <Link href='/#writing'>
            <span aria-hidden='true'>←</span>
            Writing index
          </Link>
          <span>Article</span>
        </div>

        <div className={styles.titleBlock}>
          <p className={styles.kicker}>
            {iconUrl || iconEmoji ? (
              <span
                className={styles.pageIcon}
                data-image={iconUrl ? 'true' : undefined}
                aria-hidden='true'
              >
                {iconUrl ? (
                  <Image src={iconUrl} alt='' width={26} height={26} />
                ) : (
                  iconEmoji
                )}
              </span>
            ) : null}
            Writing
          </p>
          <ArticleSharedElement pageId={pageId} part='title'>
            <h1 id='article-title'>{title}</h1>
          </ArticleSharedElement>
          {description ? (
            <ArticleSharedElement pageId={pageId} part='description'>
              <p className={styles.description}>{description}</p>
            </ArticleSharedElement>
          ) : null}
        </div>

        <div className={styles.metadata}>
          <dl>
            <div>
              <dt>Author</dt>
              <dd>{author}</dd>
            </div>
            <div>
              <dt>Published</dt>
              <dd>
                <time>{published}</time>
              </dd>
            </div>
            <div>
              <dt>Length</dt>
              <dd>{readingLength}</dd>
            </div>
          </dl>

          {tags.length > 0 ? (
            <ul className={styles.tags} aria-label='Topics'>
              {tags.map((tag) => (
                <li key={tag}>{tag.startsWith('#') ? tag : `#${tag}`}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <figure className={styles.hero}>
        <ArticleSharedElement pageId={pageId} part='hero'>
          <Image
            className={styles.heroImage}
            src={coverUrl}
            alt={coverAlt}
            fill
            priority
            sizes='(max-width: 820px) calc(100vw - 36px), (max-width: 1320px) 42vw, 560px'
            style={coverStyle}
          />
        </ArticleSharedElement>
        <span className={styles.heroColorWash} aria-hidden='true' />
        <span className={styles.heroGrain} aria-hidden='true' />
      </figure>
    </section>
  )
}
