import Link from 'next/link'

import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

export default function PlaygroundSplashPanicPage() {
  return (
    <PlaygroundLayout
      title='Splash Panic!'
      breadcrumbs={[{ label: 'Splash Panic!' }]}
    >
      <div className='space-y-6'>
        <p className='text-muted-foreground'>
          A chaotic multiplayer water-balloon battle arena inspired by Crazy
          Arcade — trap your rivals in bubbles, rescue your teammates, and be
          the last one standing.
          <br />
          It plays best (arrow keys and all){' '}
          <Link href='https://splashpanic.vercel.app/' target='_blank'>
            in its own tab
          </Link>
          .
        </p>
        <div className='relative w-full overflow-hidden rounded-3xl border bg-card shadow-lg'>
          <iframe
            src='https://splashpanic.vercel.app/'
            title='Splash Panic!'
            className='h-[720px] w-full border-0'
            loading='lazy'
            allow='fullscreen *'
            allowFullScreen
          />
        </div>
      </div>
    </PlaygroundLayout>
  )
}
