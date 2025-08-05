"use client"

import ShortCard from "@/components/youtube/short-card"
import VideoPlayerModal from "@/components/youtube/video-player-modal"
import { getSiteConfig } from "@/lib/get-config-value"
import { Loader2, Waves } from "lucide-react"
import { useEffect, useState } from "react"

interface Short {
  id: string
  title: string
  thumbnail: string
  viewCount: string
  publishedAt: string
  channelTitle: string
  duration: string
}

const CHANNEL_URL = `https://www.youtube.com/${getSiteConfig("youtube")}`
const OFFSET_SIZE = 4

export default function ShortsGrid() {
  const [shorts, setShorts] = useState<Short[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)

  // Video player state
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null)
  const [currentVideoTitle, setCurrentVideoTitle] = useState("")

  const loadShorts = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true)
      } else {
        setLoading(true)
        setShorts([])
        setOffset(0)
      }

      const currentOffset = isLoadMore ? offset : 0
      const response = await fetch(
        `/api/youtube?channelUrl=${encodeURIComponent(CHANNEL_URL)}&offset=${currentOffset}&limit=${OFFSET_SIZE}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch shorts")
      }

      const data = await response.json()

      if (data.shorts && data.shorts.length > 0) {
        if (isLoadMore) {
          setShorts((prev) => [...prev, ...data.shorts])
          setOffset((prev) => prev + OFFSET_SIZE)
        } else {
          setShorts(data.shorts)
          setOffset(OFFSET_SIZE)
        }

        setHasMore(data.shorts.length === OFFSET_SIZE)
      } else {
        setHasMore(false)
        if (!isLoadMore) {
          setShorts([])
        }
      }

      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setHasMore(false)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handlePlayVideo = (videoId: string, title: string) => {
    setCurrentVideoId(videoId)
    setCurrentVideoTitle(title)
  }

  const handleCloseVideo = () => {
    setCurrentVideoId(null)
    setCurrentVideoTitle("")
  }

  useEffect(() => {
    loadShorts()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Loading Header */}
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-cyan-200">
            <Waves className="h-6 w-6 animate-bounce" />
            <span className="text-lg font-medium">Loading surfing content...</span>
            <Waves className="h-6 w-6 animate-bounce [animation-delay:200ms]" />
          </div>
        </div>

        {/* Loading Skeleton Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: OFFSET_SIZE }).map((_, i) => (
            <div key={i} className="aspect-[9/16] animate-pulse rounded-xl border border-cyan-700/30 bg-slate-800/50" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-6xl">🌊</div>
        <p className="mb-2 text-lg text-red-300">Waves are too rough!</p>
        <p className="mb-6 text-sm text-cyan-300">{error}</p>
        <button
          onClick={() => loadShorts()}
          className="transform rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 text-white transition-all hover:scale-105 hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Try Catching Another Wave
        </button>
      </div>
    )
  }

  if (shorts.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-6xl">🏄‍♂️</div>
        <p className="mb-2 text-lg text-cyan-200">No waves to ride today</p>
        <p className="text-sm text-cyan-300">Check back later for more surfing content!</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-8">
        {/* Shorts Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shorts.map((short) => (
            <ShortCard key={short.id} short={short} onPlay={handlePlayVideo} />
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center">
            <button
              onClick={() => loadShorts(true)}
              disabled={loadingMore}
              className="mx-auto flex transform items-center gap-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Catching More Waves...
                </>
              ) : (
                "Load More"
              )}
            </button>
          </div>
        )}

        {/* End Message */}
        {!hasMore && shorts.length > 0 && (
          <div className="py-6 text-center">
            <div className="mb-2 text-4xl">🌅</div>
            <p className="text-sm text-cyan-300">{"That's all the waves for now!"}</p>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal videoId={currentVideoId} title={currentVideoTitle} onClose={handleCloseVideo} />
    </>
  )
}
