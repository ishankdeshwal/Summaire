import Link from "next/link";
import { Sparkles } from "lucide-react";
import { MotionDiv } from "../common/motion-wrapper";
import { itemVariant } from "@/lib/constants";

export default function UpgradeRequired() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-6">
            <MotionDiv variants={itemVariant} initial="hidden" animate="visible" className="w-full max-w-2xl text-center border border-rose-200/60 rounded-xl p-8 bg-white">
                <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 text-rose-700 px-3 py-1 text-xs font-medium mb-4">
                    <Sparkles className="h-4 w-4" /> Premium required
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Upgrade to continue</h2>
                <p className="text-gray-600 mb-6">Access this feature and more with Sommaire Pro.</p>
                <div className="flex items-center justify-center gap-3">
                    <Link href="/upgrade" className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-5 py-3 text-white font-medium shadow-sm hover:bg-rose-700 transition">
                        See benefits
                    </Link>
                    <Link href="/" className="text-gray-700 hover:text-gray-900">Go home</Link>
                </div>
            </MotionDiv>
        </div>
    )
}