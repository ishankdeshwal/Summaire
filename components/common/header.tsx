import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavLink from "./navLink";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import PlanBadge from "./PlanBadge";

export default function Header() {
  return (
    <nav className="container flex items-center justify-between py-4 lg:px-8 px-2 mx-auto">
      <div className="flex lg:flex-1">
        <NavLink className="flex items-center gap-1 lg:gap-2 shrink-0" href="/">
          <FileText className="w-5 h-5 lg:w-8 lg:h-8 text-gray-900 hover:rotate-12 transform-transition duration-200 ease-in-out" />
          <span className="font-extrabold text-gray-900 lg:text-xl">
            {" "}
            Sommaire
          </span>
        </NavLink>
      </div>
      <div className="flex lg:justify-center gap-4 lg:gap-12 lg:items-center ">
        <NavLink className="hidden md:block" href="/#pricing">
          Pricing
        </NavLink>
        <SignedIn>
          {" "}
          <NavLink href="/dashboard">Your Summaries</NavLink>
        </SignedIn>
      </div>
      <div className="flex lg:justify-end lg:flex-1 gap-2 lg:gap-4">
        <SignedIn>
          <div className="flex gap-4 items-center">
            <NavLink
              className="flex justify-center items-center gap-2"
              href="/upload"
            >
              {" "}
              <span className="block lg:hidden">
                <Upload />
              </span>
              <span className="hidden lg:block">Upload a PDF</span>
            </NavLink>
            <PlanBadge />
            <UserButton />
          </div>
        </SignedIn>
        <SignedOut>
          <div className="">
            <NavLink href="/sign-in">Sign In</NavLink>
          </div>
        </SignedOut>
      </div>
    </nav>
  );
}
