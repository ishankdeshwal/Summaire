import BgGradient from "@/components/common/BgGradient";
import UploadHeader from "@/components/upload/upload-header";
import UploadForm from "@/components/upload/UploadForm";
import { hasReachedUploadLimit, getPriceIdForActiveUser } from "@/lib/user";
import { currentUser } from "@clerk/nextjs/server";
import { Crown, Check, ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";
import { MotionSection, MotionDiv } from "@/components/common/motion-wrapper";
import { containerVariants, itemVariant } from "@/lib/constants";
import { pricingPlans } from "@/lib/constants";
import Link from "next/link";

export default async function Page() {
  const user = await currentUser()
  if (!user?.id) {
    redirect('/sign-in')
  }
  const userId = user.id
  const userEmail = user.emailAddresses[0].emailAddress

  // Get user's current upload count first
  const { getUserUploadCount } = await import("@/lib/summaries");
  const currentCount = await getUserUploadCount(userId);

  // Determine plan type
  const priceId = await getPriceIdForActiveUser(userEmail);
  let planType: 'free' | 'basic' | 'pro' = 'free';
  if (priceId) {
    const plan = pricingPlans.find(p => p.priceId === priceId);
    planType = plan?.id as 'basic' | 'pro' || 'free';
  }

  const { hasReachedLimit, uploadLimit } = await hasReachedUploadLimit(userId, userEmail)

  return (
    <MotionSection variants={containerVariants} initial="hidden" animate="visible" className="min-h-screen">
      <BgGradient />
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <MotionDiv variants={itemVariant}>
            <UploadHeader />
          </MotionDiv>

          {hasReachedLimit ? (
            <MotionDiv variants={itemVariant}>
              <div className="w-full max-w-2xl mx-auto">
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 text-rose-700 px-3 py-1 text-sm font-medium mb-4">
                    <Crown className="h-4 w-4" />
                    Upgrade Required
                  </div>

                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    You&apos;ve reached your upload limit
                  </h2>

                  <p className="text-gray-600 mb-6">
                    You&apos;ve used all {uploadLimit} uploads on your {planType === 'free' ? 'free' : planType} plan.
                    Upgrade to continue uploading and summarizing PDFs.
                  </p>

                  <div className="space-y-3 mb-6 text-left inline-block">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Check className="h-5 w-5 text-rose-600" />
                      <span>Basic Plan: 5 uploads per month</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Check className="h-5 w-5 text-rose-600" />
                      <span>Pro Plan: 1000 uploads per month</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      href="/#pricing"
                      className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-6 py-3 text-white font-medium shadow-sm hover:bg-rose-700 transition-colors"
                    >
                      View Plans & Upgrade
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 transition-colors"
                    >
                      Back to Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </MotionDiv>
          ) : (
            <MotionDiv variants={itemVariant}>
              <UploadForm />
            </MotionDiv>
          )}
        </div>
      </div>
    </MotionSection>
  );
}
