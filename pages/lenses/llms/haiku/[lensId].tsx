import { makeDeckLensRoute } from '@/components/wustep/lenses/llms/deckPages'
import { HAIKU_DECK } from '@/components/wustep/lenses/llms/decks'

const { Page, getStaticPaths, getStaticProps } = makeDeckLensRoute(
  HAIKU_DECK,
  'Claude Haiku’s Lenses'
)

export { getStaticPaths, getStaticProps }
export default Page
