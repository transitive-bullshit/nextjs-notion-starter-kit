import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

export default function PlaygroundTbdbitlPage() {
  return (
    <PlaygroundLayout
      title='TBDBITL Infographic'
      breadcrumbs={[{ label: 'TBDBITL Infographic' }]}
      fullFrame
    >
      <iframe
        src='https://wustep.github.io/tbdbitl/'
        title='TBDBITL Infographic'
        className='flex-1 w-full border-0'
        loading='lazy'
        allow='fullscreen *'
        allowFullScreen
      />
    </PlaygroundLayout>
  )
}
