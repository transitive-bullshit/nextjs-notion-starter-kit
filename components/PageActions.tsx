import { AiOutlineRetweet } from '@react-icons/all-files/ai/AiOutlineRetweet'
import { IoHeartOutline } from '@react-icons/all-files/io5/IoHeartOutline'

import styles from './styles.module.css'

/**
 * @see https://developer.twitter.com/en/docs/twitter-for-websites/web-intents/overview
 */
export function PageActions({ tweet,tweettext }: { tweet: string ,tweettext: string}) {
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
      <a
      className={styles.share}
        href={`http://twitter.com/share?url=blog.technotut.net&text=${tweettext}&hashtags=#TUT_DJ`}
        target='_blank'
        rel='noopener noreferrer'
        title='share this page'
      >
        <AiOutlineRetweet />
      </a>
    </div>
  )
}
