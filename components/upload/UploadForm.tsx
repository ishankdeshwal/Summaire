"use client";
import z from "zod";
import UploadFormInput from "./UploadFormInput";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import { useRef, useState, useTransition } from "react";
import { generatePDFSummary, storePdfSummaryAction } from "@/actions/UploadActions";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "./LoadingSkeleton";
const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "File size mus be less than 20MB"
    )
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});

export default function UploadForm() {
  const uploadToastId = useRef<string | number | undefined>(undefined);
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const { startUpload } = useUploadThing('pdfUploader', {
    onClientUploadComplete: () => {
      console.log('Uploaded Successfully');
      // Don't show success toast here - we'll handle it after PDF processing
    },
    onUploadError: (err) => {
      console.error('Error Occured', err);
      toast.error('Upload failed, please try again ❌', { id: uploadToastId.current });
      uploadToastId.current = undefined;
      setIsProcessing(false)
    },
    onUploadBegin: (file) => {
      console.log('upload has begun for', file);
      setIsProcessing(true)
    }
  })
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const file = formData.get("file") as File;
    // Validation of file
    const validatedFields = schema.safeParse({ file });
    if (!validatedFields.success) {
      toast.error(
        validatedFields.error.flatten().fieldErrors.file?.[0] ?? "Invalid File"
      );
      return;
    }
    // show a persistent processing toast and start the upload
    uploadToastId.current = toast.loading('Processing PDF…. ✨', { duration: Infinity });
    const res = await startUpload([file]);
    if (!res || res.length === 0) {
      toast.error("Upload failed, please try again ❌", { id: uploadToastId.current });
      uploadToastId.current = undefined;
      setIsProcessing(false)
      return;
    }
    const uploadedFile = res[0];
    const fileUrl = uploadedFile.url;

    // success/error toasts are handled in callbacks above using the same toast id
    // parse the pdf to langChain
    const summaryResult = await generatePDFSummary([uploadedFile]);
    console.log(summaryResult);
    const { data = null, message = null } = summaryResult || {}
    // summarise the PDF using AI

    if (!summaryResult.success) {
      toast.error(summaryResult.message, { id: uploadToastId.current });
      uploadToastId.current = undefined;
      setIsProcessing(false)
      return;
    }

    console.log("PDF text extracted:", summaryResult.data?.text?.substring(0, 200) + "...");
    toast.success("PDF processed successfully! ✅", {
      id: uploadToastId.current,
      duration: 4000 // Toast will disappear after 4 seconds
    });
    uploadToastId.current = undefined;
    // save the summary to DB
    if (data?.summary) {
      const storeResults = await storePdfSummaryAction({
        fileUrl,
        summary: data.summary,
        title: data.fileName,
        fileName: data.fileName,
      });

      if (storeResults.success && storeResults.data?.id) {
        toast.success('Your PDF has been successfully summarized and saved!✨😊');
        formEl.reset();
        router.push(`/summaries/${storeResults.data.id}`);
      } else {
        toast.error(storeResults.message || 'Failed to save summary');
      }
    }
    // redirect to [id] summary Page
    setIsProcessing(false)
  };
  return (
    <>
      <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
        <UploadFormInput onSubmit={handleSubmit} disabled={isProcessing} />
      </div>
      {isProcessing && <LoadingSkeleton />}
    </>

  );
}
