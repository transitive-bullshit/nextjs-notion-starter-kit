import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

export default function PlaygroundBombermanPage() {
  return (
    <PlaygroundLayout
      title='Bomberman'
      breadcrumbs={[{ label: 'Bomberman' }]}
      fullFrame
    >
      <iframe
        src='https://wustep-bomberman.vercel.app/'
        title='Bomberman'
        className='flex-1 w-full border-0'
        loading='lazy'
        allow='fullscreen *; gamepad *'
        allowFullScreen
      />
    </PlaygroundLayout>
  )
}
