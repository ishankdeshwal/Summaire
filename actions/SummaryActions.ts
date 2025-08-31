"use server";

import { GetDbConnection } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteSummaryAction({ summaryId }: { summaryId: string }) {
  try {
    const user = await currentUser();
    const userId = user?.id;
    if (!userId) {
      throw new Error("User not found");
    }
    // delete from database
    const sql = await GetDbConnection();
    const result =
      await sql`DELETE FROM pdf_summaries WHERE id=${summaryId} AND user_id=${userId} RETURNING id;`;
    // revalidatePath
    if (result.length > 0) {
      revalidatePath("/dashboard");
      return {
        success: true,
      };
    }
    return {
      success: false,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
    };
  }
}
