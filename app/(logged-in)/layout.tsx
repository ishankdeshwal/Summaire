import UpgradeRequired from "@/components/common/UpgradeRequired";
import { getSubscriptionStatus, hasActivePlan } from "@/lib/user";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { GetDbConnection } from "@/lib/db";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const user = await currentUser()
    if (!user) {
        redirect('sign-in')
    }

    // Ensure user exists in database (fallback if webhook failed)
    try {
        const sql = await GetDbConnection();
        const primaryEmail = user.emailAddresses.find(
            email => email.id === user.primaryEmailAddressId
        )?.emailAddress;

        if (primaryEmail) {
            // Check if user exists in database
            const existingUser = await sql`SELECT * FROM users WHERE email = ${primaryEmail}`;
            
            if (existingUser.length === 0) {
                // Create new user with default inactive status
                await sql`
                    INSERT INTO users (
                        email,
                        full_name,
                        status
                    ) VALUES (
                        ${primaryEmail},
                        ${user.fullName || null},
                        'inactive'
                    )
                `;
                console.log(`New user created in layout: ${primaryEmail}`);
            } else {
                console.log(`Existing user found: ${primaryEmail}`);
            }
        }
    } catch (error) {
        console.error("Error ensuring user exists in layout:", error);
        // Don't block the user from accessing the app if this fails
    }

    // Allow all authenticated users to access basic features
    // The individual pages will handle their own access controls
    return <>{children}</>
}