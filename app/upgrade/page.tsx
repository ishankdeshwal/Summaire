"use client";
import Link from "next/link";
import { Sparkles, Crown, Check } from "lucide-react";
import { MotionSection, MotionDiv } from "@/components/common/motion-wrapper";
import { containerVariants, itemVariant } from "@/lib/constants";

export default function UpgradePage() {
    return (
        <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-gradient-to-b from-white to-rose-50">
            <MotionSection variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-3xl rounded-2xl border border-rose-200/50 bg-white shadow-sm p-8 md:p-12 text-center">
                <MotionDiv variants={itemVariant} className="inline-flex items-center gap-2 rounded-full bg-rose-100 text-rose-700 px-3 py-1 text-xs font-medium mb-4">
                    <Sparkles className="h-4 w-4" />
                    Premium Feature
                </MotionDiv>

                <MotionDiv variants={itemVariant} className="flex items-center justify-center gap-3 mb-3">
                    <Crown className="h-7 w-7 text-rose-600" />
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">Unlock Sommaire Pro</h1>
                </MotionDiv>
                <MotionDiv variants={itemVariant}>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                        You’ve reached the limits of the free plan. Upgrade to Pro to enjoy
                        higher limits, faster processing, and priority access to new features.
                    </p>
                </MotionDiv>

                <MotionDiv variants={itemVariant}>
                    <ul className="text-left inline-block mx-auto mb-10 space-y-3">
                        <li className="flex items-center gap-2 text-gray-700">
                            <Check className="h-5 w-5 text-rose-600" /> Unlimited uploads
                        </li>
                        <li className="flex items-center gap-2 text-gray-700">
                            <Check className="h-5 w-5 text-rose-600" /> Faster summaries
                        </li>
                        <li className="flex items-center gap-2 text-gray-700">
                            <Check className="h-5 w-5 text-rose-600" /> Priority support
                        </li>
                    </ul>
                </MotionDiv>

                <MotionDiv variants={itemVariant} className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        href="/#pricing"
                        className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-5 py-3 text-white font-medium shadow-sm hover:bg-rose-700 transition"
                    >
                        View plans & upgrade
                    </Link>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-gray-700 hover:text-gray-900"
                    >
                        Not now
                    </Link>
                </MotionDiv>
            </MotionSection>
        </main>
    );
}


