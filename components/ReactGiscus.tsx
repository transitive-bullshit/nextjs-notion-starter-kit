import React from 'react'
import styles from './styles.module.css'
import { Giscus } from '@giscus/react'
import { giscusConfig } from 'lib/config'

const ReactGiscus: React.FC<{ darkMode: boolean }> = (props: { darkMode: boolean }) => {
  return (
    <div className={styles.comments}>
      <Giscus
        {
        ...{
          ...giscusConfig.config(),
          theme: props.darkMode ? 'dark_dimmed' : 'light',
        }
        }
      />
    </div>
  )
}

export default ReactGiscus;
