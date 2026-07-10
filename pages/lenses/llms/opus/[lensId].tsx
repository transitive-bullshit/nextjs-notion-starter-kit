import { makeDeckLensRoute } from '@/components/wustep/lenses/llms/deckPages'
import { OPUS_DECK } from '@/components/wustep/lenses/llms/decks'

const { Page, getStaticPaths, getStaticProps } = makeDeckLensRoute(
  OPUS_DECK,
  'Claude Opus’s Lenses'
)

export { getStaticPaths, getStaticProps }
export default Page
