import { FileText, Github, Twitter, Mail, ArrowRight } from "lucide-react";
import NavLink from "./navLink";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs/server";
import { hasActivePlan, hasReachedUploadLimit } from "@/lib/user";
import { MotionDiv, MotionSection } from "./motion-wrapper";
import { containerVariants, itemVariant } from "@/lib/constants";

export default async function Footer() {
    const year = new Date().getFullYear();
    const user = await currentUser();
    // Do NOT redirect from a global footer; handle guests gracefully
    const userId = user?.id || null;
    let hasReachedLimit = false;
    let hasActiveSubscription = false;
    if (userId) {
        const uploadInfo = await hasReachedUploadLimit(userId);
        hasReachedLimit = uploadInfo.hasReachedLimit;
        hasActiveSubscription = await hasActivePlan(user!.emailAddresses[0].emailAddress);
    }
    return (
        <footer className="border-t bg-gradient-to-b from-white to-rose-50/60">
            <div className="container mx-auto px-2 lg:px-8">
                <div className="relative isolate -mt-6 translate-y-6">
                    <MotionDiv variants={itemVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-2xl border bg-white/80 backdrop-blur-md shadow-sm ring-1 ring-gray-200 overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(40rem_12rem_at_120%_-10%,rgba(244,63,94,0.12),transparent),radial-gradient(30rem_10rem_at_-10%_120%,rgba(14,165,233,0.12),transparent)]" />
                        <div className="relative px-4 sm:px-8 py-8 md:py-10 flex flex-col md:flex-row items-center md:items-stretch gap-6">
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 text-rose-600 px-3 py-1 text-xs font-medium ring-1 ring-rose-200">
                                    <Mail className="w-3.5 h-3.5" />
                                    <span>New</span>
                                </div>
                                <h3 className="mt-3 text-xl md:text-2xl font-semibold tracking-tight text-gray-900">
                                    Turn long PDFs into crisp summaries in seconds
                                </h3>
                                <p className="mt-1 text-sm text-gray-600 max-w-2xl">
                                    Try Sommaire free. No credit card required.
                                </p>
                            </div>
                            {!hasReachedLimit  && (
                                <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full md:w-auto">
                                    <Link href="/upload">
                                        <Button className="w-full sm:w-auto inline-flex items-center gap-2">
                                            Start summarizing
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                    <Link href="/#pricing" className="w-full sm:w-auto">
                                        <Button variant="outline" className="w-full sm:w-auto">See pricing</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </MotionDiv>
                </div>

                <MotionSection variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="py-14 md:py-16">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
                        <MotionDiv variants={itemVariant} className="col-span-2 md:col-span-2 flex flex-col gap-4">
                            <Link href="/" className="flex items-center gap-2">
                                <FileText className="w-6 h-6 text-gray-900" />
                                <span className="font-extrabold text-gray-900 text-lg">Sommaire</span>
                            </Link>
                            <p className="text-sm text-gray-600 max-w-sm">
                                Summarize PDFs and documents instantly with clean, readable outputs.
                            </p>
                            {/* <form
                                action="#"
                                className="mt-2 flex items-center gap-2"
                            >
                                <div className="relative flex-1">
                                    <input
                                        type="email"
                                        placeholder="Join our newsletter"
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
                                    />
                                </div>
                                <Button type="submit" variant="secondary" className="shrink-0">
                                    Subscribe
                                </Button>
                            </form> */}
                        </MotionDiv>

                        <MotionDiv variants={itemVariant} className="flex flex-col gap-3">
                            <span className="text-sm font-semibold text-gray-900">Product</span>
                            <NavLink href="/upload">Upload</NavLink>
                            <NavLink href="/#pricing">Pricing</NavLink>

                        </MotionDiv>

                        <MotionDiv variants={itemVariant} className="flex flex-col gap-3">
                            <span className="text-sm font-semibold text-gray-900">Company</span>
                            <NavLink href="/#HowItWorks">About</NavLink>

                            <NavLink href="mailto:deshwalishank@gmail.com">Contact</NavLink>
                        </MotionDiv>

                        <MotionDiv variants={itemVariant} className="flex flex-col gap-3">
                            <span className="text-sm font-semibold text-gray-900">Resources</span>
                            <NavLink href="/#Demo">Guides</NavLink>
                            <NavLink href="/">Help Center</NavLink>

                        </MotionDiv>
                    </div>

                    <MotionDiv variants={itemVariant} className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <Link
                                href="https://github.com/"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center w-9 h-9 rounded-full border text-gray-700 hover:text-rose-600 hover:border-rose-300 transition-colors"
                            >
                                <Github className="w-5 h-5" />
                            </Link>
                            <Link
                                href="https://twitter.com/"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center w-9 h-9 rounded-full border text-gray-700 hover:text-rose-600 hover:border-rose-300 transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="text-xs text-gray-500">
                            <p>© {year} Sommaire. All rights reserved.</p>
                        </div>
                    </MotionDiv>
                </MotionSection>
            </div>
        </footer>
    );
}

