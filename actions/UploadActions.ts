"use server";

import { fetchAndExtractText } from "@/lib/langChain";

export async function generatePDFSummary(
  uploadResponse: [
    {
      serverData: {
        userId: string;
        file: {
          url: string;
          name: string;
        };
      };
    }
  ]
) {
  if (!uploadResponse) {
    return {
      success: false,
      message: "File Upload Failed",
      data: null,
    };
  }
  const {
    serverData: {
      userId,
      file: { url: pdfUrl, name: fileName },
    },
  } = uploadResponse[0];

  if (!pdfUrl) {
    return {
      success: false,
      message: "File Upload Failed",
      data: null,
    };
  }
  try {
    const pdfText=await fetchAndExtractText(pdfUrl)
  } catch (error) {
     return {
      success: false,
      message: "File Upload Failed",
      data: null,
    };
  }
}
