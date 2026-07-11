import { makeDeckLensRoute } from '@/components/wustep/lenses/llms/deckPages'
import { GPT_DECK } from '@/components/wustep/lenses/llms/decks'

const { Page, getStaticPaths, getStaticProps } = makeDeckLensRoute(
  GPT_DECK,
  'GPT-5.6 Sol’s Lenses'
)

export { getStaticPaths, getStaticProps }
export default Page
