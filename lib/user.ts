import { User } from "@clerk/nextjs/server";
import { pricingPlans } from "./constants";
import { GetDbConnection } from "./db";
import { getUserUploadCount } from "./summaries";

export async function getPriceIdForActiveUser(email: string) {
    const sql = await GetDbConnection()
    const query = await sql`SELECT price_id FROM users where email=${email} AND status ='active'`
    const result = query?.[0]?.price_id || null
    return result
}
export async function hasActivePlan(email: string) {
    const sql = await GetDbConnection()
    const query = await sql`SELECT price_id,status FROM users where email=${email} AND status ='active' AND price_id IS NOT NULL`
    return query && query.length > 0
}
export async function hasReachedUploadLimit(userId: string, userEmail?: string) {
    const uploadCount = await getUserUploadCount(userId)
    let priceId: string | null = null
    if (userEmail) {
        priceId = await getPriceIdForActiveUser(userEmail);
    }
    const isPro = pricingPlans.find((plan) => plan.priceId === priceId)?.id === 'pro'
    const hasAnyPlan = Boolean(priceId)
    const uploadLimit: number = isPro ? 1000 : hasAnyPlan ? 5 : 3
    return { hasReachedLimit: uploadCount >= uploadLimit, uploadLimit }
}
export async function getSubscriptionStatus(user: User) {
    const hasSubscription = await hasActivePlan(user.emailAddresses[0].emailAddress)
    return hasSubscription
}