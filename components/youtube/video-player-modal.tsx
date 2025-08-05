"use client"

import type React from "react"

import { ExternalLink, X } from "lucide-react"
import { useEffect, useState } from "react"

interface VideoPlayerModalProps {
    videoId: string | null
    title: string
    onClose: () => void
}

export default function VideoPlayerModal({ videoId, title, onClose }: VideoPlayerModalProps) {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768) // md breakpoint is 768px
        }

        checkMobile()
        window.addEventListener("resize", checkMobile)

        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    useEffect(() => {
        if (videoId) {
            // Prevent body scroll when modal is open
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [videoId])

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose()
            }
        }

        if (videoId) {
            document.addEventListener("keydown", handleEscape)
        }

        return () => {
            document.removeEventListener("keydown", handleEscape)
        }
    }, [videoId, onClose])

    if (!videoId) return null

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    const openInYouTube = () => {
        window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank")
    }

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <div className="relative w-full max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white text-lg font-semibold line-clamp-2 flex-1 mr-4">{title}</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={openInYouTube}
                            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                            title="Open in YouTube"
                        >
                            <ExternalLink className="w-5 h-5 text-white" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                            title="Close (Esc)"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Single Video Player - Responsive */}
                <div
                    className={`relative w-full ${isMobile ? "max-w-sm mx-auto" : ""}`}
                    style={{ paddingBottom: isMobile ? "177.78%" : "56.25%" }}
                >
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                        title={title}
                        className="absolute inset-0 w-full h-full rounded-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    )
}
