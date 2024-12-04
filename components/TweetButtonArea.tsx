import * as React from 'react'
import { useState, useEffect } from 'react'

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
    }
  }, [])

  const tweetText = `${title} by ${author}`
  const tweetLink = `https://twitter.com/intent/tweet?text=${tweetText}&url=${shareUrl}`

  return (
    <div>
      <a href={tweetLink} target='_blank' rel='noopener noreferrer'>
        Share this on Twitter
      </a>
    </div>
  )
}
