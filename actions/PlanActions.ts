"use server";

import { getPriceIdForActiveUser } from "@/lib/user";
import { pricingPlans } from "@/lib/constants";

export async function getPlanInfo(email: string) {
    try {
        const priceId = await getPriceIdForActiveUser(email);

        // Determine plan type
        let planType: 'free' | 'basic' | 'pro' = 'free';
        let planName = "Buy a plan";

        if (priceId) {
            const plan = pricingPlans.find(p => p.priceId === priceId);
            if (plan) {
                planType = plan.id as 'basic' | 'pro';
                planName = plan.name;
            }
        }

        return {
            success: true,
            data: {
                planName,
                priceId,
                planType
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

export async function getPlanStatus(userId: string, email: string) {
    try {
        const { getUserUploadCount } = await import("@/lib/summaries");
        const { hasReachedUploadLimit } = await import("@/lib/user");

        const priceId = await getPriceIdForActiveUser(email);
        const currentCount = await getUserUploadCount(userId);
        const { uploadLimit } = await hasReachedUploadLimit(userId, email);

        // Determine plan type
        let planType: 'free' | 'basic' | 'pro' = 'free';
        if (priceId) {
            const plan = pricingPlans.find(p => p.priceId === priceId);
            planType = plan?.id as 'basic' | 'pro' || 'free';
        }

        return {
            success: true,
            data: {
                planType,
                currentCount,
                uploadLimit
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
