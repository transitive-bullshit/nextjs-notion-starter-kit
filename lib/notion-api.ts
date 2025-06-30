import { NotionAPI } from '@genthegreat/notion-client'
import pMap from 'p-map'

export const notion = new NotionAPI({
  apiBaseUrl: process.env.NOTION_API_BASE_URL
})

// Rate-limited wrapper for getPage
export async function getPageWithRetry(pageId: string, maxRetries = 3): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`notion getPage ${pageId} (attempt ${attempt})`)
      return await notion.getPage(pageId)
    } catch (error: any) {
      if (error?.response?.status === 429 && attempt < maxRetries) {
        // Exponential backoff: wait 2^attempt seconds
        const delay = Math.pow(2, attempt) * 1000
        console.log(`Rate limited, retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      
      console.error(`page load error`, { pageId }, error?.message)
      if (attempt === maxRetries) {
        throw error
      }
    }
  }
}

// Throttled batch processing
export async function getPages(pageIds: string[]): Promise<{ [pageId: string]: any }> {
  console.log(`Fetching ${pageIds.length} pages with rate limiting...`)
  
  const results = await pMap(
    pageIds,
    async (pageId) => {
      try {
        const page = await getPageWithRetry(pageId)
        return { pageId, page }
      } catch (error) {
        console.error(`Failed to load page ${pageId}:`, error)
        return { pageId, page: null }
      }
    },
    { 
      concurrency: 3, // Limit to 3 concurrent requests
      stopOnError: false // Continue processing remaining items if an error occurs
    }
  )

  return results.reduce((acc, { pageId, page }) => {
    if (page) acc[pageId] = page
    return acc
  }, {} as { [pageId: string]: any })
}
