import ShortsGrid from "@/components/youtube/shorts-grid"

export default function YoutubeBoard() {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Channel Header */}
                <div className="text-center mb-12">
                    <p className="text-gray-600 text-lg mb-2">Your favorite kook</p>
                </div>

                <ShortsGrid />
            </div>
        </div>
    )
}
