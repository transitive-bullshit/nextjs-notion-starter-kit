import * as React from 'react'

import { IoGridOutline, IoListOutline } from '@/components/icons/InlineIcons'
import { cn } from '@/lib/utils'

export type ViewMode = 'gallery' | 'list'

interface PostsHeadingToggleProps {
  blockId: string
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function PostsHeadingToggle({
  viewMode,
  onViewModeChange
}: PostsHeadingToggleProps) {
  const headingText = 'Posts'

  return (
    <div className='posts-heading-toggle'>
      <h1 className={cn('notion-h-title', 'notion-h1', 'notion-h-indent-0')}>
        {headingText}
      </h1>
      <div className='posts-heading-toggle-group'>
        <button
          className={cn('posts-heading-toggle-button', {
            active: viewMode === 'list'
          })}
          onClick={() => onViewModeChange('list')}
          aria-label='List view'
          aria-pressed={viewMode === 'list'}
        >
          <IoListOutline />
        </button>
        <button
          className={cn('posts-heading-toggle-button', {
            active: viewMode === 'gallery'
          })}
          onClick={() => onViewModeChange('gallery')}
          aria-label='Gallery view'
          aria-pressed={viewMode === 'gallery'}
        >
          <IoGridOutline />
        </button>
      </div>
    </div>
  )
}
