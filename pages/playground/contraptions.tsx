import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

export default function PlaygroundContraptionsPage() {
  return (
    <PlaygroundLayout
      title='Contraptions'
      breadcrumbs={[{ label: 'Contraptions' }]}
      fullFrame
    >
      <iframe
        src='https://contraptions-wustep.vercel.app/'
        title='Contraptions'
        className='flex-1 w-full border-0'
        loading='lazy'
        allow='fullscreen *'
        allowFullScreen
      />
    </PlaygroundLayout>
  )
}
