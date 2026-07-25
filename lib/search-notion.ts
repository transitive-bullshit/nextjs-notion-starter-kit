import ExpiryMap from 'expiry-map'
import pMemoize from 'p-memoize'

import type * as types from './types'
import { api } from './config'

export const searchNotion = pMemoize(searchNotionImpl, {
  // Key on the whole params object, not just `query` — `ancestorIds`, filters
  // and limit all change the result set, so keying on the query string alone
  // let two structurally different searches collide and serve each other's
  // results. Matches the server-side `search` in ./notion.ts.
  cacheKey: (args) => JSON.stringify(args[0]),
  cache: new ExpiryMap(10_000)
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
  })
    .then((res) => {
      if (res.ok) {
        return res
      }

      // convert non-2xx HTTP responses into errors
      const error: Error & { response?: Response } = new Error(res.statusText)
      error.response = res
      throw error
    })
    .then((res) => res.json() as Promise<types.SearchResults>)

  // return ky
  //   .post(api.searchNotion, {
  //     json: params
  //   })
  //   .json()
}
