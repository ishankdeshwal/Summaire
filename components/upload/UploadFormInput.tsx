"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
interface UploadFromInputProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
export default function UploadFormInput({ onSubmit }: UploadFromInputProps) {
  return (
    <form className="flex  flex-col gap-6" onSubmit={onSubmit}>
      <div className="flex justify-end items-center gap-2 ">
        <Input
          type="file"
          id="file"
          name="file"
          accept="application/pdf"
          required
          className=""
        />
        <Button>Upload Your PDF</Button>
      </div>
    </form>
  );
}
