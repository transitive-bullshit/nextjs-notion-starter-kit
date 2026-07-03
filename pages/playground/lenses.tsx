import { LensesPage } from '@/components/wustep/lenses'
import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

export default function PlaygroundLensesPage() {
  return (
    <PlaygroundLayout
      title='Lenses'
      breadcrumbs={[{ label: 'Lenses' }]}
      fullFrame
    >
      <LensesPage embedded />
    </PlaygroundLayout>
  )
}
