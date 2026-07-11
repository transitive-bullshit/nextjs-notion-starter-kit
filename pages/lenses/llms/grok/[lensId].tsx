import { makeDeckLensRoute } from '@/components/wustep/lenses/llms/deckPages'
import { GROK_DECK } from '@/components/wustep/lenses/llms/decks'

const { Page, getStaticPaths, getStaticProps } = makeDeckLensRoute(
  GROK_DECK,
  'Grok 4.5’s Lenses'
)

export { getStaticPaths, getStaticProps }
export default Page
