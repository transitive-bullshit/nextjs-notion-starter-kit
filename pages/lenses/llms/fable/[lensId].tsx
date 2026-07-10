import { makeDeckLensRoute } from '@/components/wustep/lenses/llms/deckPages'
import { FABLE_DECK } from '@/components/wustep/lenses/llms/decks'

const { Page, getStaticPaths, getStaticProps } = makeDeckLensRoute(
  FABLE_DECK,
  'Claude Fable’s Lenses'
)

export { getStaticPaths, getStaticProps }
export default Page
