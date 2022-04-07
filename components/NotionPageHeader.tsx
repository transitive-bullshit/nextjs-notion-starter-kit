import React from 'react'
// import useDarkMode from '@fisch0920/use-dark-mode'

import { Header, Breadcrumbs, Search } from 'react-notion-x'

import * as types from 'lib/types'
import { navigationStyle } from 'lib/config'

// import styles from './styles.module.css'

export const NotionPageHeader: React.FC<{
  block: types.CollectionViewPageBlock | types.PageBlock
}> = ({ block }) => {
  if (navigationStyle === 'default') {
    return <Header block={block} />
  }

  return (
    <header className='notion-header'>
      <div className='notion-nav-header'>
        <Breadcrumbs block={block} rootOnly={true} />
        <Search block={block} />
      </div>
    </header>
  )
}
