import * as pdfjsLib from "pdfjs-dist";

export async function fetchAndExtractText(fileUrl: string) {
    const response = await fetch(fileUrl);
    const data = new Uint8Array(await response.arrayBuffer());
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += (content.items as any[]).map((it: any) => it.str || "").join(" ") + "\n";
    }
    return text;
}