import * as types from 'lib/types'

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
      return block.properties[descriptionKey]
    }
  }

  return null
}
