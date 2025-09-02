import pdf from "pdf-parse";

export async function fetchAndExtractText(fileUrl: string) {
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const parsed = await pdf(buffer);
    return parsed.text || "";
}