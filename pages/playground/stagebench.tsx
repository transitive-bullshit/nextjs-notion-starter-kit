import Link from 'next/link'

import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

export default function PlaygroundStageBenchPage() {
  return (
    <PlaygroundLayout
      title='StageBench'
      breadcrumbs={[{ label: 'StageBench' }]}
    >
      <div className='space-y-6'>
        <p className='text-muted-foreground'>
          A benchmark for evaluating models by having them generate a replica of
          the Nord Stage 4.
          <br />
          Open it{' '}
          <Link href='https://stagebench.vercel.app/' target='_blank'>
            in its own tab
          </Link>
          .
        </p>
        <div className='relative w-full overflow-hidden rounded-3xl border bg-card shadow-lg'>
          <iframe
            src='https://stagebench.vercel.app/'
            title='StageBench'
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
