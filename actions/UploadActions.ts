"use server";

import { GetDbConnection } from "@/lib/db";
import { generateSummary } from "@/lib/GeminiAi";
import { fetchAndExtractText } from "@/lib/langChain";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


interface PDFSummaryType {
  userId: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}
interface StorePDFSummaryInput {
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}
export async function generatePDFSummary(
  uploadResponse: {
    serverData: {
      userId: string;
      file: string;
    };
    name: string;
    url: string;
  }[]
) {
  if (!uploadResponse) {
    return {
      success: false,
      message: "File Upload Failed",
      data: null,
    };
  }
  const {
    serverData: { userId, file: pdfUrl },
    name: fileName,
    url,
  } = uploadResponse[0];

  if (!pdfUrl && !url) {
    return {
      success: false,
      message: "File Upload Failed",
      data: null,
    };
  }
  try {
    // Use the URL from the uploadRespons
    const fileUrl = pdfUrl || url;
    const pdfText = await fetchAndExtractText(fileUrl);
    console.log({ pdfText });
    const summary = await generateSummary(pdfText);
    if (!summary) {
      return {
        success: false,
        message: "File Upload Failed",
        data: null,
      };
    }
    console.log("Summary of this pdf is ", summary);
    // Return the extracted text for now
    return {
      success: true,
      message: "PDF processed successfully",
      data: {
        text: pdfText,
        summary,
        fileName,
        userId,
        pdfUrl: fileUrl,
      },
    };
  } catch (error) {
    console.error("Error processing PDF:", error);
    return {
      success: false,
      message: "Failed to process PDF",
      data: null,
    };
  }
}
export async function savePDFSummary({
  userId,
  fileUrl,
  summary,
  title,
  fileName,
}: PDFSummaryType) {
  try {
    const sql = await GetDbConnection();
    const result = await sql`INSERT INTO pdf_summaries (user_id, original_file_url, summary_text, title, file_name)
VALUES (
    ${userId},
    ${fileUrl},
    ${summary},
    ${title},
    ${fileName}
) RETURNING id;
`;
    return result[0];
  } catch (error) {
    console.error("Error savig PDF summary", error);
    throw error;
  }
}
export async function getPdfText({ fileUrl, fileName }: {
  fileUrl: string;
  fileName: string
}) {
  if (!fileUrl) {
    return {
      success: false,
      message: 'File Upload failed',
      data: null
    }
  }

}
export async function storePdfSummaryAction({
  fileUrl,
  summary,
  title,
  fileName,
}: StorePDFSummaryInput) {
  // user is logged in adn has userId
  // save  PDFsummary
  // save PDF summary()
  let savedSummary: any;
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "User not found",
      };
    }
    savedSummary = await savePDFSummary({
      userId,
      fileUrl,
      summary,
      title,
      fileName,
    });
    if (!savedSummary) {
      return {
        success: false,
        message: "failed to save Summary,Please Try Again",
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error saving PDF summary",
    };
  }
  // revalidating the cache
  revalidatePath(`/summaries/${savedSummary.id}`);
  return {
    success: true,
    message: 'PDF summary saved successfully',
    data: {
      id: savedSummary.id
    }
  };
}
