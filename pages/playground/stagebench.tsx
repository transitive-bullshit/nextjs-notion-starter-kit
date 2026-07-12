import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

export default function PlaygroundStageBenchPage() {
  return (
    <PlaygroundLayout
      title='StageBench'
      breadcrumbs={[{ label: 'StageBench' }]}
      fullFrame
    >
      <iframe
        src='https://stagebench.vercel.app/'
        title='StageBench'
        className='flex-1 w-full border-0'
        loading='lazy'
        allow='fullscreen *'
        allowFullScreen
      />
    </PlaygroundLayout>
  )
}
