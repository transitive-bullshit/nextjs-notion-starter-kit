import fetch from 'node-fetch'

export class CloudflareKV {
  accountId: string
  apiKey: string
  namespaceId: string
  _headers: any

  constructor({
    accountId,
    apiKey,
    namespaceId
  }: {
    accountId: string
    apiKey: string
    namespaceId: string
  }) {
    this.accountId = accountId
    this.apiKey = apiKey
    this.namespaceId = namespaceId

    this._headers = {
      Authorization: `Bearer ${this.apiKey}`
    }
  }

  async get(key: string) {
    const url = this._getUrl(key)
    const headers = this._headers

    const res = await fetch(url, {
      headers
    })

    if (res.ok) {
      return res.text()
    } else if (res.status === 404) {
      return undefined
    } else {
      const body = await res.text()

      throw new Error(`Error ${res.status} ${body}`)
    }
  }

  async put(
    key: string,
    value,
    {
      expiration,
      expirationTtl
    }: {
      expiration?: number
      expirationTtl?: number
    } = {}
  ) {
    const url = new URL(this._getUrl(key))
    const headers = this._headers
    const query: any = {}

    if (expiration) {
      query.expiration = expiration
    }

    if (expirationTtl) {
      query.expiration_ttl = Math.max(60, expirationTtl)
    }

    url.search = new URLSearchParams(query).toString()
    const res = await fetch(url.toString(), {
      method: 'PUT',
      body: value,
      headers
    })

    console.log('CLOUDFLARE PUT', { key, value, ok: res.ok })
    if (!res.ok) {
      console.log(await res.text())
    }
    return res.ok
  }

  async delete(key: string): Promise<boolean> {
    const url = this._getUrl(key)
    const headers = this._headers

    const res = await fetch(url, {
      method: 'DELETE',
      headers
    })

    return res.ok
  }

  _getUrl(key: string) {
    const { accountId, namespaceId } = this
    return `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`
  }
}
