import { GetDbConnection } from "./db";

export async function getSummaries(userId: string) {
  const sql = await GetDbConnection();
  const summaries =
    await sql`SELECT * from pdf_summaries where user_id=${userId} ORDER BY created_at DESC`;
  return summaries;
}
export async function GetSummaryById(id: string) {
  try {
    const sql = await GetDbConnection();
    const [summary] = await sql`
      SELECT 
        id,
        user_id,
        title,
        original_file_url,
        summary_text,
        file_name,
        created_at,
        updated_at,
        status,
        LENGTH(summary_text) - LENGTH(REPLACE(summary_text, ' ', '')) + 1 AS word_count
      FROM pdf_summaries 
      WHERE id = ${id}
    `;
    return summary;
  } catch (error) {
    return null;
  }
}

export async function getUserUploadCount(userId: string) {
  const sql = await GetDbConnection()
  try {
    const [result] = await sql`SELECT COUNT(*) as count FROM pdf_summaries WHERE user_id=${userId}`
    return result?.count || 0
  } catch (error) {
    console.error('Error fetching user upload count:', error)
    return 0
  }
}