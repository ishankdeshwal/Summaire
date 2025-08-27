"use client";
import z from "zod";
import UploadFormInput from "./UploadFormInput";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import { useRef } from "react";
import { generatePDFSummary } from "@/actions/UploadActions";
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

  const { startUpload } = useUploadThing('pdfUploader', {
    onClientUploadComplete: () => {
      console.log('Uploaded Successfully');
      toast.success("Upload successful ✅", { id: uploadToastId.current });
      uploadToastId.current = undefined;
    },
    onUploadError: (err) => {
      console.error('Error Occured', err);
      toast.error('Upload failed, please try again ❌', { id: uploadToastId.current });
      uploadToastId.current = undefined;
    },
    onUploadBegin: (file) => {
      console.log('upload has begun for', file);
    }
  })
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
    const formData = new FormData(e.currentTarget);
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
    await startUpload([file]);
    // success/error toasts are handled in callbacks above using the same toast id
    // parsr the pdf to langChain
    const summary=await generatePDFSummary(res);
    
    // summarise the PDF using AI
    // save the summary to DB
    // redirect to [id] summary Page
  };
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput onSubmit={handleSubmit} />
    </div>
  );
}
