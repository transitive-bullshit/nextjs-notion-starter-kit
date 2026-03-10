import * as React from 'react'

import { Footer } from './Footer'

export const PageLayout: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <div className='notion notion-app'>
      <div className='notion-frame'>
        <header className='notion-header'>
          <div className='notion-nav-header'>
            <div className='breadcrumbs'>
              <a href='/' className='breadcrumb active'>
                <span className='title'>Coursetexts</span>
              </a>
            </div>
          </div>
        </header>
        <div className='notion-page-scroller'>
          <main
            style={{ marginBottom: '2rem' }}
            className='notion-page notion-page-no-cover notion-page-has-icon notion-page-has-text-icon notion-full-page'
          >
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </div>
  )
}
