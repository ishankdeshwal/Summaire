"use client";
import { Trash, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState, useTransition } from "react";
import { deleteSummaryAction } from "@/actions/SummaryActions";
import { toast } from "sonner";
interface DeleteButtonProps {
  summaryId: string;
}
export default function DeleteButton({ summaryId }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      // delete summary
      // await delete (summaryid)
      const res = await deleteSummaryAction({ summaryId });
      if (!res.success) {
        toast.error("Failed to delete Summary");
      }
      toast.success("Summary PDF Deleted Successfully!😊");
      // close dialog

      setOpen(false);
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="text-gray-400 bg-gray-50 border border-gray-200 hover:text-rose-600 hover:bg-rose-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Summary?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this summary? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={"ghost"}
            onClick={() => setOpen(false)}
            className="bg-gray-50  border border-gray-200 hover:text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            variant={"destructive"}
            onClick={handleDelete}
            className=" bg-gray-900   hover:bg-rose-600"
          >
           {isPending?'Deleting ...':'Delete'} 
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
