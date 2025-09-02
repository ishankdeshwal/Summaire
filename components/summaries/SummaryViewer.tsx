"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { NavigationControls } from "./NavigationControls";
import ProgressBar from "./ProgressBar";
import { parseSection } from "@/utils/summaryHelper";
import ContentSection from "./ContentSection";

const SectionTitle = ({ title }: { title: string }) => {
  return (
    <motion.div
      key={title}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-2 mb-6 sticky top-0  pb-4 bg-background/80 backdrop-blur-xs z-10"
    >
      <h2 className="text-3xl lg:text-4xl font-bold  text-center flex items-center justify-center gap-2">{title}</h2>
    </motion.div>
  )
}

export function SummaryViewer({ summary_text }: { summary_text: string }) {

  const [currentSection, setCurrentSection] = useState(0);
  const handleNext = () => setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1))
  const handlePrev = () => setCurrentSection((prev) => Math.max(prev - 1, 0))
  const sections = summary_text
    .split("\n#")
    .map((section) => section.trim())
    .filter(Boolean)
    .map(parseSection);

  return (
    <Card className="relative px-2 h-[500px] sm:h-[600px] lg:h-[700px] w-full max-w-3xl 
        overflow-hidden bg-linear-to-br from-background via-background/95 to-rose-100
        backdrop-blur-lg shadow-2xl rounded-2xl  mx-auto ">
      <ProgressBar sections={sections} currentSection={currentSection} />
      <div className="h-full overflow-y-auto scrollbar-hide pt-12 sm:pt-16 pb-20 sm:pb-24">
        <div className="px-4 sm:px-6">
          <SectionTitle title={sections[currentSection]?.title || ''} />
          <ContentSection
            key={`section-${currentSection}`}
            title={sections[currentSection]?.title || ''}
            points={sections[currentSection]?.points || []}
          />
        </div>
      </div>
      <NavigationControls
        currentSection={currentSection}
        totalSections={sections.length}
        onPrevious={handlePrev}
        onNext={handleNext}
        onSectionSelect={setCurrentSection}
      />

    </Card>
  );
}
