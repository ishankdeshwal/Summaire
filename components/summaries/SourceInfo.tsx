import { ExternalLink, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { DownloadSummaryButton } from "./DownloadSummaryButton";

export function SourceInfo({
    title,
  file_name,
  original_file_url,
  summary_text,
  created_at,
}: {
    title: string;
  file_name: string;
  original_file_url: string;
  summary_text: string;
  created_at: string;
}) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <div className="flex items-center justify-center gap-2">
        <FileText className="h-4 w-4 text-rose-400" />
        <span>Source:{file_name}</span>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50 "
          asChild
        >
            <a href={original_file_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1"/> View Original
            </a>
        </Button>
        <DownloadSummaryButton title={title} summaryText={summary_text} fileName={file_name} createdAt={created_at} />
      </div>
    </div>
  );
}
