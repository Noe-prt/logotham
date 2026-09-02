"use client";

import { joinWaitlist, type WaitlistState } from "@/app/actions/waitlist";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { toast } from "sonner";

interface WaitlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WaitlistDialog({ open, onOpenChange }: WaitlistDialogProps) {
  const [, formAction, isPending] = useActionState<
    WaitlistState | null,
    FormData
  >(async (prevState, formData) => {
    const result = await joinWaitlist(prevState, formData);
    if (result?.success) {
      toast.success(result.message);
      if (typeof window !== "undefined") {
        localStorage.setItem("logotham-waitlist-interaction", "true");
      }
      onOpenChange(false);
    } else if (result?.error) {
      toast.error(result.error);
    }
    return result;
  }, null);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      if (typeof window !== "undefined") {
        localStorage.setItem("logotham-waitlist-interaction", "true");
      }
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-3">
        <DialogHeader>
          <DialogTitle>Join the Waitlist</DialogTitle>
          <DialogDescription>
            We&apos;re building more features like AI generation and others. Get
            notified when they&apos;re ready!
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="waitlist-email">Email</Label>
            <Input
              id="waitlist-email"
              name="email"
              placeholder="you@example.com"
              type="email"
              required
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => handleOpenChange(false)}
            >
              No thanks
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Join Waitlist
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
