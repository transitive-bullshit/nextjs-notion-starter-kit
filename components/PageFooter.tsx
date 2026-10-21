'use client'

import Giscus from '@giscus/react'
import * as React from 'react'

import * as config from '@/lib/config'

import styles from './styles.module.css'

export function PageFooter({ isBlogPost }: { isBlogPost: boolean }) {
  // only display comments on blog post pages when giscus is configured
  if (
    !isBlogPost ||
    !config.giscusRepo ||
    !config.giscusRepoId ||
    !config.giscusCategory ||
    !config.giscusCategoryId
  ) {
    return null
  }

  return (
    <div className={styles.comments}>
      <Giscus
        id='comments'
        repo={config.giscusRepo}
        repoId={config.giscusRepoId}
        category={config.giscusCategory}
        categoryId={config.giscusCategoryId}
        mapping='title'
        reactionsEnabled='1'
        emitMetadata='0'
        inputPosition='bottom'
        theme='preferred_color_scheme'
        lang='en'
        loading='lazy'
      />
    </div>
  )
}
