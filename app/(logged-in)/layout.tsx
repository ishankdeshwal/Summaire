import UpgradeRequired from "@/components/common/UpgradeRequired";
import { getSubscriptionStatus, hasActivePlan } from "@/lib/user";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function Layout({ children }: { children: React.ReactNode }) {
    const user = await currentUser()
    if (!user) {
        redirect('sign-in')
    }

    // Allow all authenticated users to access basic features
    // The individual pages will handle their own access controls
    return <>{children}</>
}