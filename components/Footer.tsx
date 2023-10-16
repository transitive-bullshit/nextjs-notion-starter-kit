import * as React from 'react'

import styles from './styles.module.css'

export const FooterImpl: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>
        &copy; Copyright {new Date().getFullYear().toString()} Talking Points -
        All Rights Reserved
      </div>
    </footer>
  )
}

export const Footer = React.memo(FooterImpl)
