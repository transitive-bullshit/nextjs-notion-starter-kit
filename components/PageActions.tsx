import { LikeIcon } from '@/lib/icons/like'
import { RetweetIcon } from '@/lib/icons/retweet'

import styles from './styles.module.css'

/**
 * @see https://developer.twitter.com/en/docs/twitter-for-websites/web-intents/overview
 */
export function PageActions({ tweet }: { tweet: string }) {
  return (
    <div className={styles.pageActions}>
      <a
        className={styles.likeTweet}
        href={`https://x.com/intent/like?tweet_id=${tweet}`}
        target='_blank'
        rel='noopener noreferrer'
        aria-label='Like this post on X'
        title='Like this post on X'
      >
        <LikeIcon />
      </a>

      <a
        className={styles.retweet}
        href={`https://x.com/intent/retweet?tweet_id=${tweet}`}
        target='_blank'
        rel='noopener noreferrer'
        aria-label='Repost this post on X'
        title='Repost this post on X'
      >
        <RetweetIcon />
      </a>
    </div>
  )
}
