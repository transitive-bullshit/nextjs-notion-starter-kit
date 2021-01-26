import React from 'react'
import { IoHeartOutline } from 'react-icons/io5'
import { AiOutlineRetweet } from 'react-icons/ai'

import styles from './styles.module.css'

/**
 * @see https://developer.twitter.com/en/docs/twitter-for-websites/web-intents/overview
 */
export const PageActions: React.FC<{ tweet: string }> = ({ tweet }) => {
  return (
    <div className={styles.pageActions}>
      <a
        className={styles.likeTweet}
        href={`https://twitter.com/intent/like?tweet_id=${tweet}`}
        target='_blank'
        rel='noopener noreferrer'
        title='Like this post on Twitter'
      >
        <IoHeartOutline />
      </a>

      <a
        className={styles.retweet}
        href={`https://twitter.com/intent/retweet?tweet_id=${tweet}`}
        target='_blank'
        rel='noopener noreferrer'
        title='Retweet this post on Twitter'
      >
        <AiOutlineRetweet />
      </a>
    </div>
  )
}
