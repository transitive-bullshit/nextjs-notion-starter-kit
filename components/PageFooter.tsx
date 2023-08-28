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
          repo="giscus/giscus"
          repoId="MDEwOlJlcG9zaXRvcnkzNTE5NTgwNTM="
          category="General"
          categoryId="MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyNzk2NTc1"
          mapping="title"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="bottom"
          theme="preferred_color_scheme"
          lang="en"
          loading="lazy"
        />
      </div>
    );
  }

  return null
}
