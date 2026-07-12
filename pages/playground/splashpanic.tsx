import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

export default function PlaygroundSplashPanicPage() {
  return (
    <PlaygroundLayout
      title='Splash Panic!'
      breadcrumbs={[{ label: 'Splash Panic!' }]}
      fullFrame
    >
      <iframe
        src='https://splashpanic.vercel.app/'
        title='Splash Panic!'
        className='flex-1 w-full border-0'
        loading='lazy'
        allow='fullscreen *'
        allowFullScreen
      />
    </PlaygroundLayout>
  )
}
