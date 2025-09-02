import BgGradient from "@/components/common/BgGradient";
import EmptyPage from "@/components/summaries/EmptySummary";
import SummaryCard from "@/components/summaries/SummaryCard";
import { Button } from "@/components/ui/button";
import { getSummaries } from "@/lib/summaries";
import { hasReachedUploadLimit, getPriceIdForActiveUser } from "@/lib/user";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MotionDiv, MotionSection } from "@/components/common/motion-wrapper";
import { containerVariants, itemVariant } from "@/lib/constants";
import SummaryCardSkeleton from "@/components/summaries/SummaryCardSkeleton";
import { pricingPlans } from "@/lib/constants";

export default async function DashboardPage() {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) {
    return redirect("/sign-in");
  }
  const { hasReachedLimit, uploadLimit } = await hasReachedUploadLimit(userId);
  const summaries = await getSummaries(userId);
  const isLoading = false; // kept for future streaming/loading state

  // Get user's current upload count
  const { getUserUploadCount } = await import("@/lib/summaries");
  const currentCount = await getUserUploadCount(userId);

  // Determine plan type
  const userEmail = user.emailAddresses[0].emailAddress;
  const priceId = await getPriceIdForActiveUser(userEmail);
  let planType: 'free' | 'basic' | 'pro' = 'free';
  if (priceId) {
    const plan = pricingPlans.find(p => p.priceId === priceId);
    planType = plan?.id as 'basic' | 'pro' || 'free';
  }

  return (
    <main className="min-h-screen mb-40">
      <BgGradient />
      <MotionSection variants={containerVariants} initial="hidden" animate="visible" className="container mx-auto flex flex-col mb-2 ">
        <div className="px-2 py-4 sm:py-14 ">
          <div className="flex gap-2  justify-between">
            <MotionDiv variants={itemVariant} className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-gray-600 to-gray-900 bg-clip-text text-transparent">
                Your summaries
              </h1>
              <p className="text-gray-600">
                Transform your PDFs into concise, actionable insights
              </p>
            </MotionDiv>

            {!hasReachedLimit && (
              <MotionDiv variants={itemVariant}>
                <Button
                  variant="link"
                  className="bg-linear-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 hover:scale-105 transition-all  duration-300 group hover:no-underline"
                >
                  <Link href="/upload" className="flex items-center text-white ">
                    <Plus className="w-5 h-5 mr-2" /> New Summary
                  </Link>
                </Button>
              </MotionDiv>
            )}
          </div>
        </div>

        {hasReachedLimit && (
          <MotionDiv variants={itemVariant} className="mb-6 px-2">
            <div className="bg-rose-100 border border-rose-200 rounded-lg p-4 text-rose-700">
              <p className="text-sm">
                You've reached the limit of {uploadLimit} uploads on the {planType === 'free' ? 'free' : planType} plan.
                <Link
                  href="/#pricing"
                  className="text-rose-800 underline font-medium underline-offset-4 inline-flex items-center"
                >
                  {" "}
                  Click here to upgrade to PRO{" "}
                  <ArrowRight className="w-4 h-4 inline-block" />{" "}
                </Link>
                for unlimited uploads.
              </p>
            </div>
          </MotionDiv>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 sm:px-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <MotionDiv key={i} variants={itemVariant}>
                <SummaryCardSkeleton />
              </MotionDiv>
            ))}
          </div>
        ) : summaries.length === 0 ? (
          <MotionDiv variants={itemVariant}>
            <EmptyPage />
          </MotionDiv>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 sm:px-0">
            {summaries.map((summary, idx) => (
              <MotionDiv key={idx} variants={itemVariant}>
                <SummaryCard summary={summary} />
              </MotionDiv>
            ))}
          </div>
        )}
      </MotionSection>
    </main>
  );
}
