"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (sessionId) {
            setIsLoading(false);
        } else {
            window.location.href = "/pricing";
        }
    }, [sessionId]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Verifying payment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Payment Successful!
                </h1>
                <p className="text-gray-600 mb-6">
                    Thank you for your purchase. Your subscription is now active and you can start using our PDF summarization service.
                </p>
                <div className="space-y-3">
                    <a
                        href="/"
                        className="block w-full bg-rose-500 text-white py-2 px-4 rounded-lg hover:bg-rose-600 transition-colors"
                    >
                        Go to Dashboard
                    </a>
                    <a
                        href="/pricing"
                        className="block w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        View Plans
                    </a>
                </div>
                {sessionId && (
                    <p className="text-xs text-gray-500 mt-4">
                        Session ID: {sessionId}
                    </p>
                )}
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    )
}
