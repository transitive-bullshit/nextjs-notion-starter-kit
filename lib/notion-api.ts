import { NotionAPI } from 'notion-client'

// Pin Notion's current API host and always send a User-Agent. Requests
// without one are rejected, and a failed refresh leaves the last
// successful page in place.
const notionApiBaseUrl =
  process.env.NOTION_API_BASE_URL || 'https://app.notion.com/api/v3'

export const notion = new NotionAPI({
  apiBaseUrl: notionApiBaseUrl,
  ofetchOptions: {
    headers: {
      'User-Agent': 'tannerjuby.me'
    }
  }
})
