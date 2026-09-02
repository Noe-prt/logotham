import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter">404</h1>
        <p className="text-xl font-medium text-muted-foreground">
          Page not found
        </p>
        <p className="text-sm text-muted-foreground max-w-[500px]">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
      </div>
      <Button asChild className="mt-4">
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
}
