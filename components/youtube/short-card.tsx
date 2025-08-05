"use client"

import { Calendar, Eye, Play } from "lucide-react"
import { useState } from "react"

interface Short {
    id: string
    title: string
    thumbnail: string
    viewCount: string
    publishedAt: string
    channelTitle: string
    duration: string
}

interface ShortCardProps {
    short: Short
    onPlay: (videoId: string, title: string) => void
}

export default function ShortCard({ short, onPlay }: ShortCardProps) {
    const [isHovered, setIsHovered] = useState(false)

    const handlePlay = () => {
        onPlay(short.id, short.title)
    }

    const formatViewCount = (count: string) => {
        const num = Number.parseInt(count)
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`
        }
        return count
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - date.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) return "1 day ago"
        if (diffDays < 7) return `${diffDays} days ago`
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
        return `${Math.floor(diffDays / 365)} years ago`
    }

    return (
        <div
            className="group overflow-hidden rounded-xl border border-slate-700/50 bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/20"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Video Thumbnail */}
            <div className="group/video relative aspect-[9/16] cursor-pointer" onClick={handlePlay}>
                <img
                    src={short.thumbnail || "/placeholder.svg?height=640&width=360"}
                    alt={short.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover/video:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-all duration-300 group-hover/video:from-black/90" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className={`rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 p-4 shadow-lg transition-all duration-300 ${isHovered ? "scale-110 shadow-cyan-500/40" : "scale-100 shadow-black/50"
                            }`}
                    >
                        <Play className="h-8 w-8 fill-white text-white" />
                    </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 rounded-md bg-black/90 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {short.duration}
                </div>

                {/* Play Indicator */}
                <div className="absolute left-3 top-3 opacity-0 transition-opacity duration-300 group-hover/video:opacity-100">
                    <div className="rounded-md bg-cyan-600/90 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        Click to play
                    </div>
                </div>
            </div>

            {/* Card Content */}
            <div className="p-4">
                <h3 className="mb-3 line-clamp-2 text-sm font-semibold leading-relaxed text-white">{short.title}</h3>

                <div className="flex items-center gap-4 text-xs text-cyan-200">
                    <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{formatViewCount(short.viewCount)} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(short.publishedAt)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
