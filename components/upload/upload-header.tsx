import BgGradient from "@/components/common/BgGradient";
import { Badge } from "@/components/ui/badge";
import { Sparkle } from "lucide-react";

export default function UploadHeader() {
  return (
   
        <div className="flex flex-col items-center justify-center gap-6 text-center ">
          <div className="relative p-[1px] overflow-hidden rounded-full bg-linear-to-r from-rose-200 via-rose-500 to-rose-800 animate-gradient-x group">
            <Badge
              className="relative px-6 py-2 text-base bg-white font-medium rounded-full group-hover:bg-rose-50 transition-colors"
              variant={"secondary"}
            >
              <Sparkle className="h-6 w-6 mr-2 text-rose-600 animate-pulse" />
              <span>AI-Powered Content Creation</span>
            </Badge>
          </div>
          <div className="capitalize text-3xl font-bold text-gray-900 sm:text-4xl">
            {" "}
            Start Uploading
            <span className="relative inline-block">
              <span className="relative z-10 px-2">Your PDF's</span>
              <span
                className="absolute inset-0 bg-rose-200/50 -rotate-2 rounded-lg transofrm -skew-y-1"
                aria-hidden="true"
              ></span>
            </span>
          </div>
          <div className="mt-2 text-lg leading-8 text-gray-600 max-w-2xl text-center">
            Upload your PDF and let our AI do the magic!✨
          </div>
        </div>
      
  );
}
