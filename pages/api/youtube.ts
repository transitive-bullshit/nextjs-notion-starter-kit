import type { NextApiRequest, NextApiResponse } from "next"

interface YouTubeVideo {
    id: {
        videoId: string
    }
    snippet: {
        title: string
        description: string
        thumbnails: {
            high: {
                url: string
            }
        }
        publishedAt: string
        channelTitle: string
    }
}

interface YouTubeVideoDetails {
    id: string
    statistics: {
        viewCount: string
    }
    contentDetails: {
        duration: string
    }
}

async function getChannelShorts(channelUrl: string, offset = 0, limit = 4) {
    const API_KEY = "AIzaSyALffkBo9yJGheIuHfuQqAfGHSiiGNcQpo"

    if (!API_KEY) {
        throw new Error("YouTube API key not configured")
    }

    try {
        // Extract channel ID from URL
        const channelId = await getChannelIdFromUrl(channelUrl, API_KEY)

        if (!channelId) {
            throw new Error("Could not extract channel ID from URL")
        }

        // Calculate maxResults to fetch more videos initially to filter for shorts
        const maxResults = Math.min(50, (offset + limit) * 3)

        // Search for videos from the channel
        const searchResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?` +
            `key=${API_KEY}&channelId=${channelId}&part=snippet&order=date&maxResults=${maxResults}&type=video`,
        )

        if (!searchResponse.ok) {
            throw new Error("Failed to fetch videos from YouTube API")
        }

        const searchData = await searchResponse.json()
        const videos: YouTubeVideo[] = searchData.items || []

        if (videos.length === 0) {
            return []
        }

        // Get video details to filter for Shorts (duration < 60 seconds)
        const videoIds = videos.map((video) => video.id.videoId).join(",")
        const detailsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?` + `key=${API_KEY}&id=${videoIds}&part=contentDetails,statistics`,
        )

        if (!detailsResponse.ok) {
            throw new Error("Failed to fetch video details from YouTube API")
        }

        const detailsData = await detailsResponse.json()
        const videoDetails: YouTubeVideoDetails[] = detailsData.items || []

        // Filter for Shorts (videos under 60 seconds) and combine data
        const allShorts = videos
            .map((video) => {
                const details = videoDetails.find((d) => d.id === video.id.videoId)
                if (!details) return null

                const duration = parseDuration(details.contentDetails.duration)
                if (duration > 60) return null // Not a Short

                return {
                    id: video.id.videoId,
                    title: video.snippet.title,
                    thumbnail: video.snippet.thumbnails.high.url,
                    viewCount: details.statistics.viewCount || "0",
                    publishedAt: video.snippet.publishedAt,
                    channelTitle: video.snippet.channelTitle,
                    duration: formatDuration(duration),
                }
            })
            .filter(Boolean)

        // Apply pagination to the filtered shorts
        const paginatedShorts = allShorts.slice(offset, offset + limit)

        return paginatedShorts
    } catch (error) {
        console.error("Error fetching YouTube Shorts:", error)
        throw error
    }
}

async function getChannelIdFromUrl(channelUrl: string, apiKey: string): Promise<string | null> {
    try {
        if (channelUrl.includes("/@")) {
            // Handle @username format
            const username = channelUrl.split("/@")[1]?.split("/")[0]
            if (username) {
                const response = await fetch(
                    `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&forHandle=${username}&part=id`,
                )
                const data = await response.json()
                return data.items?.[0]?.id || null
            }
        } else if (channelUrl.includes("/channel/")) {
            // Direct channel ID
            const channelIdentifier = channelUrl.split("/channel/")[1]?.split("/")[0] || ""
            return channelIdentifier
        } else if (channelUrl.includes("/c/") || channelUrl.includes("/user/")) {
            // Custom URL or username
            const customName = channelUrl.split("/c/")[1]?.split("/")[0] || channelUrl.split("/user/")[1]?.split("/")[0]
            if (customName) {
                const response = await fetch(
                    `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&forUsername=${customName}&part=id`,
                )
                const data = await response.json()
                return data.items?.[0]?.id || null
            }
        }

        return null
    } catch (error) {
        console.error("Error extracting channel ID:", error)
        return null
    }
}

function parseDuration(duration: string): number {
    // Parse ISO 8601 duration format (PT1M30S)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return 0

    const hours = Number.parseInt(match[1] || "0")
    const minutes = Number.parseInt(match[2] || "0")
    const seconds = Number.parseInt(match[3] || "0")

    return hours * 3600 + minutes * 60 + seconds
}

function formatDuration(seconds: number): string {
    if (seconds < 60) {
        return `0:${seconds.toString().padStart(2, "0")}`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    const { channelUrl, offset = "0", limit = "4" } = req.query

    if (!channelUrl || typeof channelUrl !== "string") {
        return res.status(400).json({ error: "Channel URL is required" })
    }

    try {
        const shorts = await getChannelShorts(
            channelUrl,
            Number.parseInt(offset as string),
            Number.parseInt(limit as string),
        )
        return res.status(200).json({ shorts })
    } catch (error) {
        console.error("API Error:", error)
        return res.status(500).json({ error: "Failed to fetch YouTube Shorts" })
    }
}
