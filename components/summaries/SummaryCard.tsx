import Link from "next/link";
import { Card } from "../ui/card";
import DeleteButton from "./DeleteButton";
import { FileIcon, FileText } from "lucide-react";
import { cn, formatFileName } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns'
const Summaryheader = ({
  fileUrl,
  title,
  createdAt,
}: {
  fileUrl: string;
  title: string;
  createdAt: string;
}) => {
  return (
    <div className="flex items-start gap-2 sm:gap-4 flex-1 min-w-0">
      <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-rose-400 mt-1 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="text-base xl:text-lg font-semibold text-gray-900 truncate">
          {title || formatFileName(fileUrl)}
        </h3>
        <p className="text-sm text-gray-500">{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</p>
      </div>
    </div>
  );
};
const StatusBadge = ({ status }: { status: string }) => {
  return <span className={cn('px-3 py-1 text-xs font-medium rounded-full capitalize', status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')}>
    {status}
  </span>
}
export default function SummaryCard({ summary }: { summary: Record<string, unknown> }) {
  return (
    <div>
      <Card className="relative h-full px-5 py-2 sm:py-6 gap-4">
        <div className="flex items-start justify-between gap-4">
          <Summaryheader
            fileUrl={summary.original_file_url as string}
            title={summary.title as string}
            createdAt={summary.created_at as string}
          />
          <DeleteButton summaryId={summary.id as string} />
        </div>
        <Link href={`summaries/${summary.id as string}`} className="block">
          <div className="flex flex-col gap-3 sm:gap-4">
            <p className="text-sm line-clamp-2 sm:text-base pl-2 text-gray-500">
              {summary.summary_text as string}
            </p>
            <div className="flex justify-between items-center mt-2 sm:mt-4">
              <StatusBadge status={summary.status as string} />
            </div>
          </div>
        </Link>
      </Card>
    </div>
  );
}
