import * as React from 'react'
import InnerHTML from 'dangerously-set-html-content'
import * as types from '../lib/types'

export const CustomHtml: React.FC<{ site: types.Site }> = ({ site }) => {
  if (!site.html) {
    return null
  }

  return <InnerHTML html={site.html} />
}
