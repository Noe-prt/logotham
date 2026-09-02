"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter">
          Something went wrong!
        </h1>
        <p className="text-sm text-muted-foreground max-w-[500px]">
          An unexpected error has occurred. Our team has been notified.
        </p>
      </div>
      <div className="flex gap-2 mt-4">
        <Button onClick={() => reset()} variant="default">
          Try again
        </Button>
        <Button
          onClick={() => (window.location.href = "/")}
          variant="outline"
        >
          Go back home
        </Button>
      </div>
    </div>
  );
}
