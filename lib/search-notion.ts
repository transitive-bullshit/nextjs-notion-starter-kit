// import ky from 'ky'
import ExpiryMap from 'expiry-map'
import fetch from 'isomorphic-unfetch'
import pMemoize from 'p-memoize'

import * as types from './types'
import { api } from './config'

export const searchNotion = pMemoize(searchNotionImpl, {
  cacheKey: (args) => args[0]?.query,
  cache: new ExpiryMap(10000)
})

async function searchNotionImpl(
  params: types.SearchParams
): Promise<types.SearchResults> {
  return fetch(api.searchNotion, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'content-type': 'application/json'
    }
  }).then((res) => {
    if (res.ok) {
      return res.json()
    }

    return new Promise((resolve) => {
      res.json().then((json) => {
        // convert non-2xx HTTP responses into errors
        // react-notion-x expects an "error" key present in the response
        // https://github.com/NotionX/react-notion-x/blob/e1f03de6100f2cd33c146eb1c5e67ec4d4afe522/packages/react-notion-x/src/components/search-dialog.tsx#L211
        json.error = res.statusText
        resolve(json)
      })
    })
  })
}
