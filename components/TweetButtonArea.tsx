import * as React from 'react'
import { useEffect, useState } from 'react'

import styles from './styles.module.css'

export function TweetButtonArea({
  title,
  author
}: {
  title: string
  author: string
}) {
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(encodeURIComponent(window.location.href))

      // Twitterウィジェットのスクリプトを読み込み
      const script = document.createElement('script')
      script.src = 'https://platform.twitter.com/widgets.js'
      script.async = true
      document.body.append(script)

      // スクリプトが読み込まれた後、Twitterウィジェットを初期化
      script.addEventListener('load', () => {
        if (window.twttr) {
          window.twttr.widgets.load()
        }
      })

      return () => {
        script.remove()
      }
    }
  }, [])

  const tweetText = `${title} by ${author}`
  const tweetLink = `https://twitter.com/intent/tweet?text=${tweetText}&url=${shareUrl}`

  return (
    <div className={styles.tweetButtonArea}>
      {/* ウィジェット用のボタン */}
      <a
        className='twitter-share-button'
        href={tweetLink}
        target='_blank'
        rel='noopener noreferrer'
        data-show-count='false'
        data-size='large'
        title='Xでシェアする'
      >
        Tweet
      </a>
    </div>
  )
}
