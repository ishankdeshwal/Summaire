import { pricingPlans } from "@/lib/constants";
import { getPriceIdForActiveUser } from "@/lib/user";
import { currentUser } from "@clerk/nextjs/server";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function PlanBadge() {
    const user = await currentUser();
    if (!user?.id) return null;
    const email = user?.emailAddresses?.[0].emailAddress;
    let priceId: string | null = null;

    if (email) {
        priceId = await getPriceIdForActiveUser(email);
    }



    let planName = "Buy a plan";
    const plan = pricingPlans.find((plan) => plan.priceId === priceId);
    if (plan) {
        planName = plan.name;
    }
    return (
        <Badge
            variant={priceId ? "secondary" : "outline"}
            className={
                priceId
                    ? "bg-amber-200 border border-amber-400 text-rose-800 border-rose-200 hidden lg:flex flex-row items-center"
                    : "bg-linear-to-r from-red-100 to-red-200 border-red-300 text-gray-600 border-gray-200 hidden lg:flex flex-row items-center"
            }
        >
            <Crown className={cn('w-3 h-3 mr-1 text-amber-600', !priceId && 'text-red-600')} />
            {planName}
        </Badge>
    );
}
