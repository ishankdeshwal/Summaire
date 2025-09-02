export default function LoadingSkeleton() {
    return (
        <div className="relative mt-10 px-2 h-[400px] sm:h-[300px] lg:h-[400px] w-full max-w-3xl overflow-hidden bg-linear-to-br from-background via-background/95 to-rose-100 backdrop-blur-lg shadow-2xl rounded-2xl mx-auto border border-rose-100/30">
            {/* Top progress bar placeholder */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-rose-100/60 overflow-hidden rounded-t-2xl">
                <div className="h-full w-1/3 bg-rose-300/80 animate-[loading_1.2s_ease-in-out_infinite]" />
            </div>

            <div className="h-full overflow-hidden pt-10 sm:pt-14 pb-16 sm:pb-20">
                <div className="px-4 sm:px-6 space-y-4">
                    {/* Title line */}
                    <div className="sticky top-0 z-10 bg-background/60 backdrop-blur-xs pb-4">
                        <div className="mx-auto h-7 sm:h-8 w-48 sm:w-64 rounded-md bg-gray-200/70 animate-pulse" />
                    </div>

                    {/* Content lines */}
                    <div className="space-y-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="group relative">
                                <div className="relative bg-linear-to-br from-gray-200/50 to-gray-300/30 p-3 rounded-2xl border border-gray-300/50">
                                    <div className="flex items-start gap-3">
                                        <div className="h-5 w-5 rounded bg-gray-300/80 animate-pulse" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 w-3/4 rounded bg-gray-200/80 animate-pulse" />
                                            <div className="h-3 w-1/2 rounded bg-gray-200/70 animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(50%); }
                    100% { transform: translateX(120%); }
                }
            `}</style>
        </div>
    )
}