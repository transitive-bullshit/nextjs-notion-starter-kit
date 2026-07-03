import { useEffect, useState } from 'react'

import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'
import { useDarkMode } from '@/lib/use-dark-mode'

export default function PlaygroundBookshelfPage() {
  const [hasMounted, setHasMounted] = useState(false)
  const { isDarkMode } = useDarkMode()
  const mode = isDarkMode ? 'dark' : 'light'

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <PlaygroundLayout
      title='Bookshelf'
      breadcrumbs={[{ label: 'Bookshelf' }]}
      fullFrame
    >
      {hasMounted && (
        <iframe
          src={`https://wustep-bookshelf.vercel.app/?mode=${mode}`}
          title='Bookshelf iframe'
          className='flex-1 w-full border-0'
          loading='lazy'
          allow='fullscreen *'
          allowFullScreen
        />
      )}
    </PlaygroundLayout>
  )
}
