import { SourceInfo } from "@/components/summaries/SourceInfo";
import { SummaryHeader } from "@/components/summaries/summary-header";
import { SummaryViewer } from "@/components/summaries/SummaryViewer";
import { GetSummaryById } from "@/lib/summaries";
import { FileText } from "lucide-react";
import { notFound } from "next/navigation";
import { MotionDiv, MotionSection } from "@/components/common/motion-wrapper";
import { containerVariants, itemVariant } from "@/lib/constants";

export default async function SummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch summary by ID
  const summary = await GetSummaryById(id);

  // If summary not found → show 404 page
  if (!summary) {
    notFound();
  }

  const { title, summary_text, file_name, word_count, created_at, original_file_url } = summary;
  const reading_time = Math.ceil((word_count || 0) / 150)
  return (
    <div className="relative isolate min-h-screen bg-gradient-to-b from-rose-50/40 to-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-full w-64 z-[-10] transform-gpu overflow-hidden blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          }}
          className="relative aspect-[1155/678] w-full bg-gradient-to-br from-rose-300 via-rose-200 to-white opacity-40"
        />
      </div>

      <div className="container mx-auto flex flex-col items-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <MotionSection variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-4xl flex flex-col gap-6">
          <MotionDiv variants={itemVariant}>
            <SummaryHeader title={title} createdAt={created_at} readingTime={reading_time} />
          </MotionDiv>

          {file_name && (
            <MotionDiv variants={itemVariant}>
              <SourceInfo title={title} file_name={file_name} created_at={created_at} original_file_url={original_file_url} summary_text={summary_text} />
            </MotionDiv>
          )}

          <MotionDiv variants={itemVariant} className="relative">
            <div className="relative p-6 sm:p-8 lg:p-10 bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-rose-100/30 transition-all duration-300 hover:shadow-2xl hover:bg-white/90">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-50/40 via-orange-50/30 to-transparent opacity-40 rounded-2xl sm:rounded-3xl" />

              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground bg-white/90 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-rose-400" />
                {word_count?.toLocaleString()} words
              </div>

              <div className="relative mt-4 sm:mt-6">
                <SummaryViewer summary_text={summary_text} />
              </div>
            </div>
          </MotionDiv>
        </MotionSection>
      </div>
    </div>
  );
}
