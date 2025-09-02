'use client';

import { Badge } from "@/components/ui/badge";
import { Crown, Zap, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getPlanStatus } from "@/actions/PlanActions";

interface PlanStatus {
    planType: 'free' | 'basic' | 'pro';
    currentCount: number;
    uploadLimit: number;
}

export default function CurrentPlanStatus() {
    const [planStatus, setPlanStatus] = useState<PlanStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user, isSignedIn } = useUser();

    useEffect(() => {
        const fetchPlanStatus = async () => {
            if (!isSignedIn || !user) {
                setIsLoading(false);
                return;
            }

            try {
                const email = user.emailAddresses[0].emailAddress;
                const result = await getPlanStatus(user.id, email);

                if (result.success && result.data) {
                    setPlanStatus(result.data);
                }
            } catch (error) {
                console.error('Error fetching plan status:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlanStatus();
    }, [user, isSignedIn]);

    if (!isSignedIn || isLoading || !planStatus) {
        return null;
    }

    const { planType, currentCount, uploadLimit } = planStatus;
    const remainingUploads = uploadLimit - currentCount;

    const getPlanIcon = () => {
        switch (planType) {
            case 'pro':
                return <Crown className="h-4 w-4 text-yellow-600" />;
            case 'basic':
                return <Zap className="h-4 w-4 text-blue-600" />;
            default:
                return <Upload className="h-4 w-4 text-gray-600" />;
        }
    };

    const getPlanName = () => {
        switch (planType) {
            case 'pro':
                return 'Pro Plan';
            case 'basic':
                return 'Basic Plan';
            default:
                return 'Free Plan';
        }
    };

    return (
        <div className="text-center mb-8">
            <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2 text-sm">
                {getPlanIcon()}
                <span>Current Plan: {getPlanName()}</span>
                <span className="text-xs opacity-75">
                    ({currentCount}/{uploadLimit} uploads used)
                </span>
            </Badge>
            {remainingUploads <= 2 && remainingUploads > 0 && (
                <p className="text-sm text-yellow-600 mt-2">
                    ⚠️ You're close to your upload limit. Consider upgrading for more uploads.
                </p>
            )}
            {remainingUploads === 0 && (
                <p className="text-sm text-red-600 mt-2">
                    🚫 You've reached your upload limit. Upgrade your plan to continue.
                </p>
            )}
        </div>
    );
}
