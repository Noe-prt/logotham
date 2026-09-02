"use client";

import {
  requestExportSlot,
  type ExportFormat,
} from "@/app/actions/exports";
import { LogoHeader } from "@/components/logo/header";
import { LogoPreview } from "@/components/logo/preview";
import { LogoSidebar, type SidebarTab } from "@/components/logo/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { WaitlistDialog } from "@/components/waitlist-dialog";
import { useLogoHistory } from "@/hooks/use-logo-history";
import { useIsMobile } from "@/hooks/use-mobile";
import type { AutoExportVariant } from "@/lib/auto-export-options";
import { generateRandomConfig } from "@/lib/logo-helpers";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

type PlanLimitsProps = {
  planName?: string;
  maxExportSize?: number | null;
  exportsRemaining?: number | null;
  isAuthenticated?: boolean;
};

type LogoGeneratorProps = {
  planLimits?: PlanLimitsProps;
};

type ExportActionOptions = {
  autoBundleVariants?: AutoExportVariant[];
};

type DownloadOptions = {
  watermark?: boolean;
};

export function LogoGenerator({ planLimits }: LogoGeneratorProps = {}) {
  const {
    config,
    updateConfig,
    saveHistorySnapshot,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    isLoaded,
  } = useLogoHistory();
  const isMobile = useIsMobile();
  const router = useRouter();
  const [, startExportTransition] = React.useTransition();

  const [isWaitlistOpen, setIsWaitlistOpen] = React.useState(false);
  const [sidebarWidth, setSidebarWidth] = React.useState(480);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isResizing, setIsResizing] = React.useState(false);
  const [activeLayerId, setActiveLayerId] = React.useState<string>("primary");
  const [activeSidebarTab, setActiveSidebarTab] = React.useState<SidebarTab>("icon");
  // Track exports remaining locally for optimistic UI updates
  const [localExportsRemaining, setLocalExportsRemaining] = React.useState<
    number | null
  >(planLimits?.exportsRemaining ?? null);

  // Sync with server state when planLimits changes
  React.useEffect(() => {
    setLocalExportsRemaining(planLimits?.exportsRemaining ?? null);
  }, [planLimits?.exportsRemaining]);

  const previewRef = React.useRef<{
    handleDownload: (
      format?:
        | "png"
        | "svg"
        | "bundle"
        | "brand"
        | "favicon"
        | "json"
        | "mockup",
      options?: DownloadOptions
    ) => void;
    handleAutoBundle: (
      variants: AutoExportVariant[],
      options?: DownloadOptions
    ) => Promise<void>;
    getExportRequestMeta: (
      format: ExportFormat,
      options?: ExportActionOptions
    ) => { maxDimension: number | null };
  }>(null);
  const planMaxExportSize = planLimits?.maxExportSize ?? null;

  const checkWaitlist = React.useCallback(() => {
    if (
      typeof window !== "undefined" &&
      !localStorage.getItem("logotham-waitlist-interaction")
    ) {
      setTimeout(() => setIsWaitlistOpen(true), 1000);
    }
  }, []);

  const runExportAction = React.useCallback(
    (
      format: ExportFormat,
      action: (downloadOptions: DownloadOptions) => Promise<void>,
      options?: ExportActionOptions
    ) => {
      const requestMeta = previewRef.current
        ? previewRef.current.getExportRequestMeta(format, {
            autoBundleVariants: options?.autoBundleVariants,
          })
        : { maxDimension: null };
      const requestedSize = requestMeta?.maxDimension ?? null;

      if (
        planMaxExportSize &&
        requestedSize &&
        requestedSize > planMaxExportSize
      ) {
        const label =
          planLimits?.planName && planLimits.planName !== "free"
            ? planLimits.planName
            : "current";
        toast.error(
          `Your ${label} plan supports exports up to ${planMaxExportSize}px. Upgrade for larger outputs.`
        );
        return;
      }

      startExportTransition(async () => {
        try {
          const result = await requestExportSlot(format, {
            maxDimension: requestedSize,
          });

          if (!result.success) {
            throw new Error(result.error);
          }

          const allowance = result;
          const downloadOptions: DownloadOptions = {
            watermark: allowance.watermark ?? false,
          };

          await action(downloadOptions);

          // Update local exports remaining for optimistic UI
          if (allowance.remaining != null) {
            setLocalExportsRemaining(allowance.remaining);
          }

          const remaining = allowance.remaining;
          if (remaining != null && remaining <= 3) {
            const unit = remaining === 1 ? "export" : "exports";
            const resetHint =
              allowance.resetsAt != null
                ? `Renews ${new Date(allowance.resetsAt).toLocaleDateString()}`
                : null;
            toast.warning(
              `${remaining} ${unit} left this month${
                resetHint ? ` · ${resetHint}` : ""
              }`
            );
          }
          checkWaitlist();
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Unable to export right now.";
          toast.error(message);
          if (message.toLowerCase().includes("sign in")) {
            router.push("/login?redirect=/");
          }
        }
      });
    },
    [checkWaitlist, planLimits, planMaxExportSize, router, startExportTransition]
  );

  const startResizing = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = React.useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = React.useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = e.clientX;
        if (newWidth > 280 && newWidth < 800) {
          setSidebarWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  React.useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  // Handle layer selection from preview - switch to Icon tab
  const handleLayerSelectFromPreview = React.useCallback((layerId: string) => {
    setActiveLayerId(layerId);
    // Auto-switch to Icon tab when selecting a layer from the canvas
    setActiveSidebarTab("icon");
  }, []);

  if (!isLoaded) {
    return (
      <div className="relative flex min-h-[calc(100vh-5rem)] w-full items-center justify-center overflow-hidden bg-background">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage: [
              "radial-gradient(circle at 20% 25%, hsl(var(--primary) / 0.35) 0%, transparent 45%)",
              "radial-gradient(circle at 75% 15%, hsl(var(--primary) / 0.25) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 80%, hsl(var(--primary) / 0.15) 0%, transparent 55%)",
            ].join(", "),
            filter: "blur(30px)",
          }}
        />
        <div className="relative flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-background/80 px-10 py-12 shadow-xl backdrop-blur">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Spinner className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-1 text-center">
            <p className="text-lg font-semibold text-foreground">
              Booting the workshop…
            </p>
            <p className="text-sm text-muted-foreground">
              Loading 24k icons and your last edits.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col w-full h-[calc(100vh-5rem)] lg:overflow-hidden">
        <LogoHeader
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          updateConfig={updateConfig}
          saveHistorySnapshot={saveHistorySnapshot}
          currentConfig={config}
          onReset={reset}
          onRandomize={(options) => {
            saveHistorySnapshot();
            updateConfig(generateRandomConfig(config, options));
          }}
          onDownload={(format) => {
            runExportAction(format, async (downloadOptions) => {
              await previewRef.current?.handleDownload(format, downloadOptions);
            });
          }}
          onAutoBundleDownload={(variants: AutoExportVariant[]) => {
            runExportAction(
              "bundle",
              async (downloadOptions) => {
                await previewRef.current?.handleAutoBundle(
                  variants,
                  downloadOptions
                );
              },
              { autoBundleVariants: variants }
            );
          }}
          exportsRemaining={localExportsRemaining}
          isAuthenticated={planLimits?.isAuthenticated ?? false}
          planName={planLimits?.planName ?? "free"}
        />
        <div
          className="flex flex-1 w-full flex-col lg:flex-row overflow-y-auto"
          style={
            { "--sidebar-width": `${sidebarWidth}px` } as React.CSSProperties
          }
        >
          <div
            className={cn(
              "flex flex-col border-b lg:border-b-0 lg:border-r border-border bg-background order-1 lg:order-none shrink-0 transition-[width] duration-300 ease-in-out will-change-[width] lg:overflow-visible",
              isResizing && "duration-0 transition-none",
              isSidebarOpen
                ? "w-full lg:w-[var(--sidebar-width)]"
                : "w-full lg:w-0 lg:border-none lg:overflow-hidden"
            )}
          >
            <LogoSidebar
              config={config}
              updateConfig={updateConfig}
              saveHistorySnapshot={saveHistorySnapshot}
              activeLayerId={activeLayerId}
              setActiveLayerId={setActiveLayerId}
              activeTab={activeSidebarTab}
              onTabChange={setActiveSidebarTab}
            />
          </div>

          <div
            className="hidden lg:flex w-4 -ml-2 z-50 items-center justify-center cursor-col-resize group order-none relative hover:bg-primary/5 transition-colors shrink-0"
            onMouseDown={startResizing}
          >
            <div className="w-px h-full bg-border group-hover:bg-primary/50 transition-colors" />

            <div className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-muted-foreground">
              <GripVertical className="h-4 w-4" />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsSidebarOpen(!isSidebarOpen);
              }}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 bg-background border border-border rounded-full flex items-center justify-center shadow-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all z-50 focus:outline-none focus:ring-2 focus:ring-ring",
                isSidebarOpen ? "w-6 h-6 -left-3" : "w-8 h-8 left-2"
              )}
              title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isSidebarOpen ? (
                <ChevronLeft className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </div>

          <div
            className={cn(
              "logo-preview-shell w-full flex-none pb-4 lg:flex-1 lg:h-full bg-muted/10 relative order-2 lg:order-none overflow-y-auto lg:overflow-hidden",
              isMobile && "pb-4"
            )}
          >
            <LogoPreview
              ref={previewRef}
              config={config}
              onUpdateConfig={updateConfig}
              activeLayerId={activeLayerId}
              onLayerSelect={handleLayerSelectFromPreview}
              maxExportSize={planMaxExportSize}
            />
          </div>
        </div>
      </div>
      <WaitlistDialog open={isWaitlistOpen} onOpenChange={setIsWaitlistOpen} />
    </>
  );
}
