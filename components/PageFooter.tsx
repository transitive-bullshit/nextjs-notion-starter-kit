import * as React from 'react'
import Giscus from '@giscus/react';

import styles from './styles.module.css'

export const PageFooter: React.FC<{
  isBlogPost: boolean
}> = ({ isBlogPost }) => {
  // only display comments and page actions on blog post pages
  if (isBlogPost) {
    return (
      <div className={styles.comments}>
        <Giscus
          id="comments"
          repo="sgamerw/nextjs-notion-starter-kit"
          repoId="R_kgDOKLTTmw"
          category="Announcements"
          categoryId="DIC_kwDOKLTTm84CY6Ny"
          mapping="title"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="bottom"
          theme="preferred_color_scheme"
          lang="zh-CN"
          loading="lazy"
        />
      </div>
    );
  }

  return null
}
