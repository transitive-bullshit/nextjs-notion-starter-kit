import * as types from 'lib/types'
import { getTextContent } from 'notion-utils'

export function getPageDescription(
  block: types.Block,
  recordMap: types.RecordMap
): string | null {
  const collection = recordMap.collection[block.parent_id]?.value

  if (collection) {
    const descriptionKey = Object.keys(collection.schema).find(
      (key) => collection.schema[key].name === 'Description'
    )

    if (descriptionKey) {
      return getTextContent(block.properties[descriptionKey])
    }
  }

  return null
}
