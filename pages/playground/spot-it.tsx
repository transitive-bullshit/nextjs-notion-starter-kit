import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

export default function PlaygroundSpotItPage() {
  return (
    <PlaygroundLayout
      title='Spot it!'
      breadcrumbs={[{ label: 'Spot it!' }]}
      fullFrame
    >
      <iframe
        src='https://spot-its.vercel.app/'
        title='Spot it! iframe'
        className='flex-1 w-full border-0'
        loading='lazy'
        allow='fullscreen *'
        allowFullScreen
      />
    </PlaygroundLayout>
  )
}
