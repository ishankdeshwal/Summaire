"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
interface UploadFromInputProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
export default function UploadFormInput({ onSubmit }: UploadFromInputProps) {
  const [isPending, startTransition] = useTransition();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      await onSubmit(e);
    });
  };

  return (
    <form className="flex  flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex justify-end items-center gap-2 ">
        <Input
          type="file"
          id="file"
          name="file"
          accept="application/pdf"
          required
          className=""
          disabled={isPending}
        />
        <Button
          type="submit"
          disabled={isPending}
          className={`transition-colors ${isPending ? "opacity-70 cursor-not-allowed" : ""
            }`}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload Your PDF"
          )}
        </Button>
      </div>
    </form>
  );
}
