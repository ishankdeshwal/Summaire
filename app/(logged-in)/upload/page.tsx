import BgGradient from "@/components/common/BgGradient";
import { Badge } from "@/components/ui/badge";
import UploadHeader from "@/components/upload/upload-header";
import UploadForm from "@/components/upload/UploadForm";
import { hasReachedUploadLimit } from "@/lib/user";
import { currentUser } from "@clerk/nextjs/server";
import { Sparkle } from "lucide-react";
import { redirect } from "next/navigation";
import { MotionSection, MotionDiv } from "@/components/common/motion-wrapper";
import { containerVariants, itemVariant } from "@/lib/constants";

export default async function Page() {
  const user = await currentUser()
  if (!user?.id) {
    redirect('/sign-in')
  }
  const userId = user.id
  const userEmail = user.emailAddresses[0].emailAddress
  const { hasReachedLimit } = await hasReachedUploadLimit(userId, userEmail)
  if (hasReachedLimit) {
    redirect('/dashboard')
  }
  return (
    <MotionSection variants={containerVariants} initial="hidden" animate="visible" className="min-h-screen">
      <BgGradient />
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <MotionDiv variants={itemVariant}>
            <UploadHeader />
          </MotionDiv>
          <MotionDiv variants={itemVariant}>
            <UploadForm />
          </MotionDiv>
        </div>
      </div>
    </MotionSection>
  );
}
