"use client";

import { FileText } from "lucide-react";
import Link from "next/link";

export default function EmptyPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="bg-pink-100 p-6 rounded-full shadow-md mb-6">
        <FileText className="w-12 h-12 text-pink-600" />
      </div>

      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
        No Summaries Found
      </h1>
      <p className="text-gray-500 mt-2 max-w-md">
        You haven&apos;t generated any summaries yet. Start by uploading a file or
        creating a new summary to see it here.
      </p>

      <button className="mt-6 px-6 py-3 bg-pink-600 text-white text-sm font-medium rounded-xl shadow-lg hover:bg-pink-700 transition duration-300">
        <Link href={"/upload"} className="hover:no-underline">
          Generate Summary
        </Link>
      </button>
    </div>
  );
}
