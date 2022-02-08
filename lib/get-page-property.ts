import * as types from './types'
import { getTextContent } from 'notion-utils'

// TODO:
// 返回日期，并测试
export function getPagePropertyExtend(
  propertyName: string,
  block: types.Block,
  recordMap: types.ExtendedRecordMap
): string | null {
  console.group('getPagePropertyExtend')
  if (!block.properties) {
    // TODO: check parent page?
    console.groupEnd()
    return null
  }

  const collection = recordMap.collection[block.parent_id]?.value

  if (collection) {
    const propertyId = Object.keys(collection.schema).find(
      (key) => collection.schema[key]?.name === propertyName
    )

    console.log('propertyId', propertyId)

    if (propertyId) {
      const propertyValue = block.properties[propertyId]
      const ret = getTextContent(propertyValue)
      console.log('text', ret, JSON.stringify(propertyValue))
      console.log('properties', JSON.stringify(block.properties))
      console.log('block', JSON.stringify(block))
      
      try {
        const value = propertyValue[0][1][0][1]['start_date']
        if (value) {
          console.log('date value', value)
          console.groupEnd()
          return value
        }
      } catch (e) {
        console.log(e)
        console.log(propertyValue)
      } finally {
      }

      console.groupEnd()
      return ret || propertyValue
    }
  }

  console.groupEnd()
  return null
}
