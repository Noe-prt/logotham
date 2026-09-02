"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

type ManageBillingButtonProps = {
  className?: string;
};

export function ManageBillingButton({ className }: ManageBillingButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const result = await authClient.subscription.billingPortal({
        returnUrl: origin ? `${origin}/billing` : "/billing",
      });

      if (result.error || !result.data?.url) {
        throw new Error(
          result.error?.message ?? "Unable to open the billing portal."
        );
      }

      window.location.href = result.data.url;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to open billing portal.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className={className}
      variant="secondary"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Opening portal…
        </>
      ) : (
        "Manage Subscription"
      )}
    </Button>
  );
}
