"use client";

export async function extractTextFromPDF(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const arrayBuffer = event.target?.result as ArrayBuffer;

                // Load PDF.js from CDN to avoid bundling issues
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';

                script.onload = async () => {
                    try {
                        // @ts-ignore - PDF.js is loaded globally
                        const pdfjsLib = window.pdfjsLib;

                        // Set up worker
                        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

                        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
                        let text = "";

                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const content = await page.getTextContent();
                            text += (content.items as any[]).map((it: any) => it.str || "").join(" ") + "\n";
                        }

                        resolve(text);
                    } catch (error) {
                        reject(new Error(`Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`));
                    }
                };

                script.onerror = () => reject(new Error("Failed to load PDF.js library"));
                document.head.appendChild(script);
            } catch (error) {
                reject(new Error(`Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`));
            }
        };

        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsArrayBuffer(file);
    });
}
