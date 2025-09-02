import { BrainCircuit, FileOutput, FileText, MoveRight } from "lucide-react";
import { ReactNode } from "react";
import { MotionSection, MotionDiv } from "@/components/common/motion-wrapper";
import { containerVariants, itemVariant } from "@/lib/constants";

type Step = {
  icon: ReactNode;
  label: string;
  description: string;
};

const steps: Step[] = [
  {
    icon: <FileText size={64} strokeWidth={1.5} />,
    label: "Upload Your PDF",
    description: "Simply drag and drip your PDF Document or click to upload",
  },
  {
    icon: <BrainCircuit size={64} strokeWidth={1.5} />,
    label: "AI Analysis",
    description:
      "Our Advanced AI proccess and analyzes your document instantly",
  },
  {
    icon: <FileOutput size={64} strokeWidth={1.5} />,
    label: "Get Summary",
    description: "Receive a clear,concise summary of your document",
  },
];
export default function HowItWorks() {
  return (
    <MotionSection id="HowItWorks" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="relative overflow-hidden bg-gray-50">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        >
          <div
            className="relative left-[calc(50%-36rem)] aspect-[1155/678] w-[36.125rem]
                     -translate-x-1/2 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500
                     opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.14% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0%, 80.7% 2%, 72.5% 32.5%, 66.2% 44.2%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 54.2%, 27.5% 76.7%, 11.6% 94.6%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <MotionDiv variants={itemVariant} className="text-center mb-16 ">
          <h2 className="font-bold text-xl uppercase mb-4 text-rose-500">
            HOW IT WORKS
          </h2>
          <h3 className="font-bold text-3xl max-w-2xl mx-auto">
            Transform any PDF into an easy-to-digest summary in three simmple
            steps
          </h3>
        </MotionDiv>
        <div className="grid grid-cols-1 md:grid-cols-3  gap-8 max-w-6xl mx-auto relative ">
          {steps.map((step, idx) => (
            <MotionDiv variants={itemVariant} className="relative flex items-stretch" key={idx}>
              <StepItem  {...step} />
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <MoveRight
                    size={32}
                    strokeWidth={1}
                    className="text-rose-500"
                  />
                </div>
              )}
            </MotionDiv>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}

function StepItem({ icon, label, description }: Step) {
  return (
    <div className="relative p-6  rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10 hover:border-rose-500 transition-colors group w-full">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex items-center justify-center h-24 w-24 mx-auto rounded-2xl bg-linear-to-br from-rose-500/10 to-transparent group-hover:from-rose-500/20  transition-colors">
          <div className="text-rose-500">{icon}</div>
        </div>
        <div className="flex flex-col flex-1 gap-2 justify-between">
          <h4 className="text-center font-bold text-xl">{label}</h4>
          <p className="text-center text-gray text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}
