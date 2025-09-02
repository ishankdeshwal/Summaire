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
