"use client";

import { submitFeedback, type FeedbackState } from "@/app/actions/feedback";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import React, { useActionState, useState } from "react";
import { toast } from "sonner";

type FeedbackDialogProps = {
  children?: React.ReactNode;
  trigger?: React.ReactElement;
  onSuccess?: () => void;
};

export function FeedbackDialog({
  children,
  trigger,
  onSuccess,
}: FeedbackDialogProps) {
  const [open, setOpen] = useState(false);
  const [, formAction, isPending] = useActionState<FeedbackState | null, FormData>(
    async (prevState: FeedbackState | null, formData: FormData) => {
      const result = await submitFeedback(prevState, formData);

      if (result?.success) {
        toast.success(result.message);
        setOpen(false);
        onSuccess?.();
      } else if (result?.error) {
        toast.error(result.error);
      }

      return result;
    },
    null
  );

  const customTrigger =
    trigger ?? (React.isValidElement(children) ? children : null);
  const triggerLabel = customTrigger ? null : children ?? "Feedback";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {customTrigger ?? (
          <Button variant="ghost" type="button">
            {triggerLabel}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-3">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            Found a bug or have a feature request? Let us know!
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              name="email"
              placeholder="you@example.com"
              type="email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="I think it would be cool if..."
              required
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Feedback
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
