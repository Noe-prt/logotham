"use client";

import { auditLogo, type AuditResult } from "@/app/actions/audit-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import type { LogoConfig } from "@/lib/logo-types";
import { cn } from "@/lib/utils";
import {
  IconAlertTriangle,
  IconBrain,
  IconBulb,
  IconCircleCheck,
  IconCircleX,
  IconEye,
  IconLoader2,
  IconTrendingUp,
} from "@tabler/icons-react";
import * as React from "react";
import { toast } from "sonner";

interface AuditLogoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentConfig: LogoConfig;
}

export function AuditLogoDialog({
  open,
  onOpenChange,
  currentConfig,
}: AuditLogoDialogProps) {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const isAuthenticated = Boolean(session?.user);
  const [auditResult, setAuditResult] = React.useState<AuditResult | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) {
      setAuditResult(null);
      setError(null);
    }
  }, [open]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as AuditResult;
      if (parsed && typeof parsed.score === "number") {
        setAuditResult(parsed);
      }
    } catch (error) {
      console.warn("Failed to parse stored audit result", error);
      window.localStorage.removeItem(AUDIT_STORAGE_KEY);
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!auditResult) {
      window.localStorage.removeItem(AUDIT_STORAGE_KEY);
      return;
    }
    try {
      window.localStorage.setItem(
        AUDIT_STORAGE_KEY,
        JSON.stringify(auditResult)
      );
    } catch (error) {
      console.warn("Failed to persist audit result", error);
    }
  }, [auditResult]);

  const handleAudit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await auditLogo(currentConfig);

      if (!response.success) {
        throw new Error(response.error);
      }

      const result = response.result;
      setAuditResult(result);

      // Show toast notification based on score
      if (result.score >= 80) {
        toast.success(`Excellent design! Score: ${result.score}/100`);
      } else if (result.score >= 60) {
        toast.info(
          `Good design with room for improvement. Score: ${result.score}/100`
        );
      } else {
        toast.warning(`Design needs attention. Score: ${result.score}/100`);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to audit logo";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "error";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return IconCircleCheck;
    if (score >= 60) return IconAlertTriangle;
    return IconCircleX;
  };

const AUDIT_STORAGE_KEY = "logotham:audit-result";

const ScoreIcon = auditResult ? getScoreIcon(auditResult.score) : IconBrain;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-3 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconBrain className="h-5 w-5" stroke={1.7} />
            AI Design Audit
          </DialogTitle>
          <DialogDescription>
            Get professional design feedback on your logo configuration from AI.
            This costs 1 credit.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!auditResult && !isLoading && (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <IconBrain
                  className="h-8 w-8 text-muted-foreground"
                  stroke={1.7}
                />
              </div>
              <h3 className="text-lg font-medium mb-2">
                Ready to audit your logo?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Our AI will analyze your logo for color harmony, scalability,
                and uniqueness, then provide actionable improvement suggestions.
              </p>
              <Button
                onClick={handleAudit}
                size="lg"
                className="gap-2"
                disabled={!isAuthenticated || isSessionLoading}
              >
                <IconTrendingUp className="h-4 w-4" stroke={1.7} />
                {isSessionLoading
                  ? "Loading..."
                  : !isAuthenticated
                  ? "Sign in to Audit"
                  : "Start Audit (1 Credit)"}
              </Button>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <IconLoader2
                  className="h-8 w-8 animate-spin text-muted-foreground"
                  stroke={1.7}
                />
              </div>
              <h3 className="text-lg font-medium mb-2">
                Analyzing your logo...
              </h3>
              <p className="text-muted-foreground">
                Our AI is examining color harmony, scalability, and uniqueness.
              </p>
              <div className="mt-6 space-y-2">
                <Skeleton className="h-2 w-full max-w-md mx-auto" />
                <Skeleton className="h-2 w-4/5 max-w-md mx-auto" />
                <Skeleton className="h-2 w-3/5 max-w-md mx-auto" />
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <IconCircleX className="h-8 w-8 text-destructive" stroke={1.7} />
              </div>
              <h3 className="text-lg font-medium mb-2">Audit failed</h3>
              <p className="text-muted-foreground text-sm mb-4">{error}</p>
              <Button onClick={handleAudit} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {auditResult && !isLoading && (
            <div className="space-y-6">
              {/* Score Display */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 mb-2">
                  <ScoreIcon
                    className={cn("h-6 w-6", getScoreColor(auditResult.score))}
                    stroke={1.7}
                  />
                  <span className="text-3xl font-bold">
                    {auditResult.score}/100
                  </span>
                </div>
                <Badge
                  variant={getScoreBadgeVariant(auditResult.score)}
                  className="text-sm m-4"
                >
                  {auditResult.score >= 80
                    ? "Excellent Design"
                    : auditResult.score >= 60
                    ? "Good Design"
                    : "Needs Improvement"}
                </Badge>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <IconEye className="h-4 w-4" stroke={1.7} />
                  Design Analysis
                </h4>

                <div className="grid gap-4">
                  <div className="p-4 rounded-lg border bg-card">
                    <h5 className="font-medium mb-2 text-sm">Color Harmony</h5>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {auditResult.critique.colorHarmony}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border bg-card">
                    <h5 className="font-medium mb-2 text-sm">Scalability</h5>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {auditResult.critique.scalability}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border bg-card">
                    <h5 className="font-medium mb-2 text-sm">Uniqueness</h5>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {auditResult.critique.uniqueness}
                    </p>
                  </div>
                </div>
              </div>

              {/* Improvement Suggestions */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <IconBulb className="h-4 w-4" stroke={1.7} />
                  Improvement Suggestions
                </h4>

                <div className="space-y-2">
                  {auditResult.improvements.map((improvement, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-muted/50 border"
                    >
                      <p className="text-sm leading-relaxed">{improvement}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => onOpenChange(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
                <Button onClick={handleAudit} className="flex-1">
                  Re-audit (1 Credit)
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
