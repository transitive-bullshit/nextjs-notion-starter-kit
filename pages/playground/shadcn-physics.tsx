import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

export default function ShadcnPhysicsPage() {
  return (
    <PlaygroundLayout
      title='Shadcn Physics'
      breadcrumbs={[{ label: 'Shadcn Physics' }]}
      fullFrame
    >
      <iframe
        src='https://shadbook-app.vercel.app/physics'
        title='shadcn + Physics'
        className='flex-1 w-full border-0'
        loading='lazy'
        allow='accelerometer; ambient-light-sensor; fullscreen; gyroscope; magnetometer; xr-spatial-tracking'
        allowFullScreen
      />
    </PlaygroundLayout>
  )
}
