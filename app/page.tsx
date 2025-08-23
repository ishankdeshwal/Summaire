import BgGradient from "@/components/common/BgGradient";
import DemoSection from "@/components/Home/DemoSection";
import HeroSections from "@/components/Home/HeroSections";
import HowItWorks from "@/components/Home/HowItWorks";
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
    </div> 
    </div>
  );
}
