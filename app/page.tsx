import BgGradient from "@/components/common/BgGradient";
import CTASection from "@/components/Home/CTASection";
import DemoSection from "@/components/Home/DemoSection";
import HeroSections from "@/components/Home/HeroSections";
import HowItWorks from "@/components/Home/HowItWorks";
import PricingSection from "@/components/Home/PricingSection";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative w-full">
      <BgGradient />
   <div className="flex flex-col">
     <HeroSections /> 
     <DemoSection />  
    <HowItWorks />
    <PricingSection />
    <CTASection />
    </div> 
    </div>
  );
}
