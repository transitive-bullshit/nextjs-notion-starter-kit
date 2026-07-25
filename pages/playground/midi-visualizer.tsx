import dynamic from 'next/dynamic'

import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

// The visualizer pulls in Tone.js, which is by far the heaviest dependency on
// the site and is useless until the user actually interacts with the keyboard.
// Loading it lazily (and client-only — it needs Web Audio + canvas) keeps it
// out of this page's initial JS.
const MidiVisualizer = dynamic(
  () =>
    import('@/components/wustep/MidiVisualizer').then((m) => m.MidiVisualizer),
  { ssr: false }
)

export default function PlaygroundMidiVisualizerPage() {
  return (
    <PlaygroundLayout
      title='MIDI Visualizer'
      breadcrumbs={[{ label: 'MIDI Visualizer' }]}
      fullFrame
    >
      <MidiVisualizer className='flex-1' />
    </PlaygroundLayout>
  )
}
