"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

type UpgradePlanButtonProps = {
  planName: string;
  label?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  className?: string;
};

export function UpgradePlanButton({
  planName,
  label = "Upgrade",
  variant = "default",
  className,
}: UpgradePlanButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleUpgrade = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const successQuery = new URLSearchParams({
        billing: "success",
        plan: planName,
      });
      const cancelQuery = new URLSearchParams({
        billing: "failed",
        plan: planName,
      });
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: planName,
          successUrl: `${origin}/settings?${successQuery.toString()}`,
          cancelUrl: `${origin}/pricing?${cancelQuery.toString()}`,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upgrade failed.");
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
        return;
      }

      toast.success("Subscription updated. Redirecting to settings…");
      window.location.href = `${origin}/settings`;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to start checkout. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className={className}
      variant={variant}
      disabled={isLoading}
      onClick={handleUpgrade}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Redirecting…
        </>
      ) : (
        <>{label}</>
      )}
    </Button>
  );
}
