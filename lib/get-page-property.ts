import * as types from './types'
import { getTextContent } from 'notion-utils'

// Add feature: get date property.
export function getPagePropertyExtend(
  propertyName: string,
  block: types.Block,
  recordMap: types.ExtendedRecordMap
): string | null {
  if (!block.properties) {
    // TODO: check parent page?
    return null
  }

  const collection = recordMap.collection[block.parent_id]?.value

  if (collection) {
    const propertyId = Object.keys(collection.schema).find(
      (key) => collection.schema[key]?.name === propertyName
    )

    if (propertyId) {
      const propertyValue = block.properties[propertyId]
      const ret = getTextContent(propertyValue)

      try {
        // date property.
        const value = propertyValue[0][1][0][1]['start_date']
        if (value) {
          return value
        }
      } catch (e) {
      } finally {
      }

      return ret || propertyValue
    }
  }

  console.groupEnd()
  return null
}
