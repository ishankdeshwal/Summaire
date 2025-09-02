export default function SummaryCardSkeleton() {
    return (
        <div className="relative h-full px-5 py-4 sm:py-6 gap-4 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-gray-200 animate-pulse" />
                    <div className="flex-1 min-w-0 space-y-2">
                        <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
                <div className="w-20 h-8 rounded-md bg-gray-200 animate-pulse" />
            </div>
            <div className="mt-4 space-y-2">
                <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-5/6 bg-gray-100 rounded animate-pulse" />
            </div>
        </div>
    )
}


