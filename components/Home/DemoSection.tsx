import { Pizza } from "lucide-react";
import { SummaryViewer } from "@/components/summaries/SummaryViewer";
import { MotionSection, MotionDiv } from "@/components/common/motion-wrapper";
import { containerVariants, itemVariant } from "@/lib/constants";

export default function DemoSection() {
  return (
    <MotionSection id="Demo" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="relative">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        >
          <div
            className="relative right-[calc(50%-36rem)] aspect-[1155/678] w-[36.125rem]
                     -translate-x-1/2 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500
                     opacity-30 sm:left-[calc(90%-36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.14% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0%, 80.7% 2%, 72.5% 32.5%, 66.2% 44.2%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 54.2%, 27.5% 76.7%, 11.6% 94.6%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        <div className="flex flex-col items-center text-center space-y-4">
          <MotionDiv variants={itemVariant} className="inline-flex items-center justify-center  p-2 rounded-2xl bg-gray-100/80 backdrop-blur-xs border border-gray-500/20 mb-4">
            <Pizza className="w-6 h-6 text-rose-600" />
          </MotionDiv>
          <MotionDiv variants={itemVariant} className="text-center mb-10 sm:mb-16">
            <h3 className="font-bold text-3xl max-w-2xl mx-auto px-4 sm:px-6">
              Watch how Sommaire transforms <span className="bg-linear-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent">this Next.js course PDF</span> into an easy-to-read summary !
            </h3>
          </MotionDiv>
          <MotionDiv variants={itemVariant} className="flex justify-center items-center px-2 sm:px-4 lg:px-6 w-full">
            <div className="w-full">
              <SummaryViewer summary_text={demoSummary} />
            </div>
          </MotionDiv>
        </div>
      </div>
    </MotionSection>
  );
}

const demoSummary = `# Course Overview
• Comprehensive introduction to Next.js 14 app router
• Learn routing, layouts, and server actions
• Build production-ready React apps faster

# Project Setup
• Initialize Next.js project with TypeScript
• Configure Tailwind CSS and ESLint
• Set up environment variables securely

# Routing & Layouts
• Create nested routes and shared layouts
• Use dynamic segments and route groups
• Implement metadata and loading states

# Data Fetching
• Leverage server components for secure data access
• Use async/await directly in components
• Cache and revalidate with fetch options

# Forms & Actions
• Implement server actions for mutations
• Validate inputs and handle errors gracefully
• Provide optimistic UI updates

# Authentication
• Protect routes with middleware and providers
• Access user on the server safely
• Persist sessions across reloads

# Deployment
• Environment-aware configs (dev/prod)
• Enable edge/runtime optimizations
• Monitor logs and errors after release`;
