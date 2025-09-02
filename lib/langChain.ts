export async function fetchAndExtractText(fileUrl: string) {
    try {
        // For now, return the URL to be processed on the client side
        // This avoids server-side PDF parsing issues
        return `PDF_URL:${fileUrl}`;
    } catch (error) {
        throw new Error(`Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}