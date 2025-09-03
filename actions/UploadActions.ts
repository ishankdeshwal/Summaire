"use server";

import { GetDbConnection } from "@/lib/db";
import { generateSummary } from "@/lib/GeminiAi";
import { fetchAndExtractText } from "@/lib/langChain";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


interface PDFSummaryType {
  userId: string;
  userName: string;
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
    url?: string; // deprecated by uploadthing v9
    ufsUrl?: string; // preferred public URL
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
    ufsUrl,
  } = uploadResponse[0];

  if (!pdfUrl && !ufsUrl && !url) {
    return {
      success: false,
      message: "File Upload Failed",
      data: null,
    };
  }
  try {
    // Use the URL from the uploadRespons
    const fileUrl = pdfUrl || ufsUrl || url!;

    if (!fileUrl) {
      console.error("No valid file URL found");
      return {
        success: false,
        message: "No valid file URL provided",
        data: null,
      };
    }

    const pdfText = await fetchAndExtractText(fileUrl);
    const summary = await generateSummary(pdfText);
    if (!summary) {
      return {
        success: false,
        message: "File Upload Failed",
        data: null,
      };
    }
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
      message: `Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
      data: null,
    };
  }
}
export async function savePDFSummary({
  userId,
  userName,
  fileUrl,
  summary,
  title,
  fileName,
}: PDFSummaryType) {
  try {
    const sql = await GetDbConnection();
    const result = await sql`INSERT INTO pdf_summaries (user_id, user_name, original_file_url, summary_text, title, file_name)
VALUES (
    ${userId},
    ${userName},
    ${fileUrl},
    ${summary},
    ${title},
    ${fileName}
) RETURNING id;
`;
    return result[0];
  } catch (error) {
    console.error("Error saving PDF summary", error);
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
  // user is logged in and has userId
  // save PDF summary
  let savedSummary: any;
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "User not found",
      };
    }
    
    // Get user's name from Clerk using currentUser
    const user = await currentUser();
    const userName = user?.fullName || user?.firstName || user?.lastName || 'Unknown User';
    
    savedSummary = await savePDFSummary({
      userId,
      userName,
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

export async function generateAISummaryAction(pdfText: string) {
  try {
    const { generateSummary } = await import("@/lib/GeminiAi");
    const summary = await generateSummary(pdfText);
    return {
      success: true,
      summary,
    };
  } catch (error) {
    console.error("Error generating AI summary:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to generate summary",
    };
  }
}
