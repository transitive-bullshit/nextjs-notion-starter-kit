import * as React from 'react'

import { LoadingIcon } from './LoadingIcon'
import styles from './styles.module.css'

export const Loading: React.FC = () => (
  <div className={styles.container}>
    <LoadingIcon />
  </div>
)
