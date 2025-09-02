'use client';

import { Badge } from "@/components/ui/badge";
import { Crown, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { getPlanInfo } from "@/actions/PlanActions";

interface PlanInfo {
    planName: string;
    priceId: string | null;
    planType: 'free' | 'basic' | 'pro';
}

export default function PlanBadge() {
    const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user, isLoaded } = useUser();

    useEffect(() => {
        const fetchPlanInfo = async () => {
            try {
                if (!user?.id) {
                    setIsLoading(false);
                    return;
                }

                const email = user.emailAddresses[0].emailAddress;
                if (!email) {
                    setIsLoading(false);
                    return;
                }

                // Fetch plan info using server action
                const result = await getPlanInfo(email);

                if (result.success && result.data) {
                    setPlanInfo(result.data);
                } else {
                    // Fallback to free plan
                    setPlanInfo({
                        planName: "Buy a plan",
                        priceId: null,
                        planType: 'free'
                    });
                }
            } catch (error) {
                console.error('Error fetching plan info:', error);
                // Fallback to free plan
                setPlanInfo({
                    planName: "Buy a plan",
                    priceId: null,
                    planType: 'free'
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (isLoaded && user) {
            fetchPlanInfo();
        } else if (isLoaded && !user) {
            setIsLoading(false);
        }
    }, [user, isLoaded]);

    // Show loading only when Clerk is still loading
    if (!isLoaded || isLoading) {
        return (
            <Badge variant="outline" className="hidden lg:flex flex-row items-center">
                <Crown className="w-3 h-3 mr-1 text-gray-400" />
                Loading...
            </Badge>
        );
    }

    // Show plan info
    if (planInfo) {
        const { planName, planType, priceId } = planInfo;

        // If no plan, show "Buy a plan" with link to pricing
        if (!priceId) {
            return (
                <Link href="/#pricing">
                    <Badge variant="outline" className="hidden lg:flex flex-row items-center gap-2 cursor-pointer hover:bg-gray-100">
                        <Crown className="w-3 h-3 text-red-600" />
                        <span>{planName}</span>
                    </Badge>
                </Link>
            );
        }

        // If has plan, show plan name with appropriate styling
        return (
            <Badge
                variant="secondary"
                className={cn(
                    "hidden lg:flex flex-row items-center gap-2",
                    planType === 'pro'
                        ? "bg-amber-200 border border-amber-400 text-rose-800 border-rose-200"
                        : "bg-blue-200 border border-blue-400 text-blue-800 border-blue-200"
                )}
            >
                {planType === 'pro' ? (
                    <Crown className="w-3 h-3 text-amber-600" />
                ) : (
                    <Zap className="w-3 h-3 text-blue-600" />
                )}
                <span>{planName}</span>
            </Badge>
        );
    }

    // Fallback
    return (
        <Link href="/#pricing">
            <Badge variant="outline" className="hidden lg:flex flex-row items-center gap-2 cursor-pointer hover:bg-gray-100">
                <Crown className="w-3 h-3 text-red-600" />
                <span>Buy a plan</span>
            </Badge>
        </Link>
    );
}
