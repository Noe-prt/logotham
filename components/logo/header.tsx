"use client";

import { AILogoGeneratorDialog } from "@/components/ai-logo-generator-dialog";
import { AuditLogoDialog } from "@/components/audit-logo-dialog";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/menu";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  autoExportOptions,
  defaultAutoExportSelection,
  type AutoExportVariant,
} from "@/lib/auto-export-options";
import { encodeConfigToUrl } from "@/lib/logo-helpers";
import { LogoConfig, presets } from "@/lib/logo-types";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  FileJson,
  RotateCcw,
  RotateCw,
  Upload,
} from "lucide-react";
import {
  IconBrain,
  IconCheck,
  IconDownload,
  IconLayoutDashboard,
  IconLock,
  IconShare3,
  IconSparkles,
  IconWand,
} from "@tabler/icons-react";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

interface LogoHeaderProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  updateConfig: (config: Partial<LogoConfig>, saveHistory?: boolean) => void;
  saveHistorySnapshot: () => void;
  currentConfig: LogoConfig;
  onReset: () => void;
  onRandomize: (options: {
    keepIcon?: boolean;
    keepBackground?: boolean;
    keepText?: boolean;
    keepPosition?: boolean;
    keepIconColor?: boolean;
    keepIconFillColor?: boolean;
    keepTextColor?: boolean;
  }) => void;
  onDownload: (
    format: "png" | "svg" | "bundle" | "brand" | "favicon" | "json" | "mockup"
  ) => void;
  onAutoBundleDownload: (variants: AutoExportVariant[]) => void;
  exportsRemaining?: number | null;
  isAuthenticated?: boolean;
  planName?: string;
}

export function LogoHeader({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  updateConfig,
  saveHistorySnapshot,
  currentConfig,
  onReset,
  onRandomize,
  onDownload,
  onAutoBundleDownload,
  exportsRemaining,
  isAuthenticated = false,
  planName = "free",
}: LogoHeaderProps) {
  const [hasCopied, setHasCopied] = React.useState(false);
  const [activePresetTab, setActivePresetTab] = React.useState<
    "icons" | "typography"
  >("icons");

  const [keepIcon, setKeepIcon] = React.useState(false);
  const [keepBackground, setKeepBackground] = React.useState(false);
  const [keepText, setKeepText] = React.useState(false);
  const [keepTextColor, setKeepTextColor] = React.useState(false);
  const [keepPosition, setKeepPosition] = React.useState(false);
  const [keepIconColor, setKeepIconColor] = React.useState(false);
  const [keepIconFillColor, setKeepIconFillColor] = React.useState(false);
  const [autoBundleDialogOpen, setAutoBundleDialogOpen] = React.useState(false);
  const [isAiDialogOpen, setIsAiDialogOpen] = React.useState(false);
  const [isAuditDialogOpen, setIsAuditDialogOpen] = React.useState(false);
  const [autoBundleSelection, setAutoBundleSelection] = React.useState<
    string[]
  >(defaultAutoExportSelection);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Determine if exports are blocked
  // null/undefined = unlimited, 0 = out of exports, > 0 = has exports
  const hasExportsRemaining =
    exportsRemaining === null ||
    exportsRemaining === undefined ||
    exportsRemaining > 0;
  const isExportBlocked = isAuthenticated && !hasExportsRemaining;
  const requiresAuth = !isAuthenticated;

  // Plan-based feature restrictions
  const isPro = planName.toLowerCase() === "pro";
  const canExportBrandKit = isPro;
  const canExportBundle = isPro || planName.toLowerCase() === "starter";

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("logotham:autoBundleSelection");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setAutoBundleSelection(parsed);
        }
      } catch (error) {
        console.warn("Failed to parse auto bundle selection", error);
      }
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      "logotham:autoBundleSelection",
      JSON.stringify(autoBundleSelection)
    );
  }, [autoBundleSelection]);

  const toggleAutoBundleOption = (id: string, checked: boolean) => {
    setAutoBundleSelection((prev) => {
      if (checked) {
        return prev.includes(id) ? prev : [...prev, id];
      }
      return prev.filter((item) => item !== id);
    });
  };

  const selectedAutoBundleVariants = React.useMemo(
    () =>
      autoExportOptions.filter((option) =>
        autoBundleSelection.includes(option.id)
      ),
    [autoBundleSelection]
  );

  const handleAutoBundleExport = () => {
    if (!selectedAutoBundleVariants.length) return;
    onAutoBundleDownload(selectedAutoBundleVariants);
    setAutoBundleDialogOpen(false);
  };

  const handleImportJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedConfig = JSON.parse(content);

        if (
          typeof importedConfig === "object" &&
          importedConfig !== null &&
          "iconType" in importedConfig &&
          "size" in importedConfig
        ) {
          updateConfig(importedConfig, true);
          toast.success("Logo configuration imported successfully!");
        } else {
          toast.error(
            "Invalid JSON file. Please upload a valid Logotham config."
          );
        }
      } catch (error) {
        console.error("Failed to parse JSON", error);
        toast.error("Failed to read JSON file.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const iconPresets = React.useMemo(
    () => presets.filter((p) => !p.config.texts?.length),
    []
  );
  const textPresets = React.useMemo(
    () => presets.filter((p) => (p.config.texts?.length ?? 0) > 0),
    []
  );

  const isPresetSelected = (presetConfig: Partial<LogoConfig>) => {
    return Object.keys(presetConfig).every((key) => {
      const k = key as keyof LogoConfig;
      const v1 = presetConfig[k];
      const v2 = currentConfig[k];

      if (Array.isArray(v1) && Array.isArray(v2)) {
        return (
          v1.length === v2.length && v1.every((val, index) => val === v2[index])
        );
      }

      if (
        typeof v1 === "object" &&
        v1 !== null &&
        typeof v2 === "object" &&
        v2 !== null
      ) {
        return JSON.stringify(v1) === JSON.stringify(v2);
      }

      return v1 === v2;
    });
  };

  const handleShare = async () => {
    const queryString = encodeConfigToUrl(currentConfig);
    const url = `${window.location.origin}${window.location.pathname}${queryString}`;

    try {
      await navigator.clipboard.writeText(url);
      setHasCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setHasCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL", err);
      toast.error("Failed to copy link");
    }
  };

  const renderDialogPresetButton = (preset: (typeof presets)[0]) => {
    const isSelected = isPresetSelected(preset.config);
    return (
      <DialogTrigger asChild key={preset.name}>
        <Button
          variant="outline"
          className={cn(
            "justify-start h-14 px-4 gap-3 transition-all",
            isSelected &&
              "border-primary ring-1 ring-primary bg-primary/5 text-primary"
          )}
          onClick={() => {
            saveHistorySnapshot();
            updateConfig(preset.config);
          }}
        >
          <div
            className="size-4 rounded-full border shrink-0"
            style={{
              background:
                preset.config.bgMode === "gradient"
                  ? `linear-gradient(${preset.config.gradientAngle?.[0]}deg, ${preset.config.gradientStart}, ${preset.config.gradientEnd})`
                  : preset.config.bgColor,
            }}
          />
          <span className="font-medium truncate w-full text-left">
            {preset.name}
          </span>
        </Button>
      </DialogTrigger>
    );
  };

  // Render the download button based on auth/export state
  const renderDownloadButton = () => {
    // Not authenticated - link to login
    if (requiresAuth) {
      return (
        <Button size="sm" className="gap-2" asChild>
          <Link href="/login?redirect=/">
            <IconDownload className="h-4 w-4" stroke={1.7} />
            Download
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Link>
        </Button>
      );
    }

    // Authenticated but out of exports - link to pricing
    if (isExportBlocked) {
      return (
        <Button size="sm" className="gap-2" asChild>
          <Link href="/pricing">
            <IconDownload className="h-4 w-4" stroke={1.7} />
            Download
            <span className="text-xs opacity-70">(0)</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Link>
        </Button>
      );
    }

    // Has exports remaining - show normal dropdown trigger
    return null; // Will use the dropdown menu version
  };

  // Handle clicking on a locked feature
  const handleLockedFeatureClick = (featureName: string) => {
    toast.error(`${featureName} requires Pro plan`, {
      action: {
        label: "Upgrade",
        onClick: () => {
          window.location.href = "/pricing";
        },
      },
    });
  };

  return (
    <header className="flex items-center justify-between h-16 px-4 border-b bg-background shrink-0 gap-4 overflow-x-auto">
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-md border bg-muted/50 p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onUndo}
            disabled={!canUndo}
            className="h-7 w-7"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="sr-only">Undo</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRedo}
            disabled={!canRedo}
            className="h-7 w-7"
          >
            <RotateCw className="h-4 w-4" />
            <span className="sr-only">Redo</span>
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={onReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Default
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Import JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDownload("json")}>
              <FileJson className="mr-2 h-4 w-4" />
              Export JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".json"
          onChange={handleImportJson}
        />
      </div>

      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <IconLayoutDashboard className="h-4 w-4" stroke={1.7} />
              Presets
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl gap-0 p-0">
            <DialogHeader className="border-b px-6 py-4">
              <DialogTitle>All Presets</DialogTitle>
            </DialogHeader>
            <Tabs
              value={activePresetTab}
              onValueChange={(value) =>
                setActivePresetTab(value as "icons" | "typography")
              }
              className="flex w-full flex-col"
            >
              <div className="border-b bg-muted/30 px-6 py-2">
                <TabsList>
                  <TabsTrigger value="icons">Icons</TabsTrigger>
                  <TabsTrigger value="typography">Typography</TabsTrigger>
                </TabsList>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-6">
                <TabsContent value="icons" className="mt-0">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {iconPresets.map(renderDialogPresetButton)}
                  </div>
                </TabsContent>
                <TabsContent value="typography" className="mt-0">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {textPresets.map(renderDialogPresetButton)}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </DialogContent>
        </Dialog>
        <ButtonGroup>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              onRandomize({
                keepIcon,
                keepBackground,
                keepText,
                keepPosition,
                keepIconColor,
                keepIconFillColor,
                keepTextColor,
              });

              if (
                typeof window !== "undefined" &&
                !window.localStorage.getItem("logotham:hasShownRandomTip")
              ) {
                toast.info("Pro Tip: Press 'R' to randomize again!");
                window.localStorage.setItem(
                  "logotham:hasShownRandomTip",
                  "true"
                );
              }
            }}
          >
            <IconSparkles className="h-4 w-4" stroke={1.7} />
            Random
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="px-2">
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Lock Settings</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={keepIcon}
                  onCheckedChange={setKeepIcon}
                >
                  Keep Icon
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={keepIconColor}
                  onCheckedChange={setKeepIconColor}
                >
                  Keep Icon Color
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={keepIconFillColor}
                  onCheckedChange={setKeepIconFillColor}
                >
                  Keep Icon Fill Color
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={keepBackground}
                  onCheckedChange={setKeepBackground}
                >
                  Keep Background
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={keepText}
                  onCheckedChange={setKeepText}
                >
                  Keep Text
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={keepTextColor}
                  onCheckedChange={setKeepTextColor}
                >
                  Keep Text Color
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={keepPosition}
                  onCheckedChange={setKeepPosition}
                >
                  Keep Position
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>

        <AILogoGeneratorDialog
          open={isAiDialogOpen}
          onOpenChange={setIsAiDialogOpen}
          onSelect={(config) => updateConfig(config, true)}
        />
        <AuditLogoDialog
          open={isAuditDialogOpen}
          onOpenChange={setIsAuditDialogOpen}
          currentConfig={currentConfig}
        />
        <Button
          size="sm"
          className="gap-2 bg-gradient-to-r from-[#ffe66d] via-[#ffd23f] to-[#ffb347] text-black hover:brightness-105 border-0"
          onClick={() => setIsAiDialogOpen(true)}
        >
          <IconWand className="h-4 w-4" stroke={1.7} />
          <span className="hidden sm:inline">AI Gen</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setIsAuditDialogOpen(true)}
        >
          <IconBrain className="h-4 w-4" stroke={1.7} />
          <span className="hidden sm:inline">Audit</span>
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleShare}
        >
          {hasCopied ? (
            <IconCheck className="h-4 w-4" stroke={1.7} />
          ) : (
            <IconShare3 className="h-4 w-4" stroke={1.7} />
          )}
          <span className="hidden sm:inline">Share</span>
        </Button>

        {requiresAuth || isExportBlocked ? (
          renderDownloadButton()
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="gap-2">
                <IconDownload className="h-4 w-4" stroke={1.7} />
                Download
                {exportsRemaining != null && exportsRemaining > 0 && (
                  <span className="text-xs opacity-70">({exportsRemaining})</span>
                )}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => onDownload("png")}>
                Download PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload("svg")}>
                Download SVG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload("favicon")}>
                Download Favicon
              </DropdownMenuItem>
              {canExportBrandKit ? (
                <DropdownMenuItem onClick={() => onDownload("brand")}>
                  Download Brand Kit
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="text-muted-foreground"
                  onClick={() => handleLockedFeatureClick("Brand Kit")}
                >
                  <IconLock className="mr-2 h-3 w-3" stroke={1.7} />
                  Brand Kit
                  <span className="ml-auto text-xs">Pro</span>
                </DropdownMenuItem>
              )}
              {canExportBundle ? (
                <DropdownMenuItem onClick={() => onDownload("bundle")}>
                  Download Assets Bundle
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="text-muted-foreground"
                  onClick={() => handleLockedFeatureClick("Assets Bundle")}
                >
                  <IconLock className="mr-2 h-3 w-3" stroke={1.7} />
                  Assets Bundle
                  <span className="ml-auto text-xs">Starter+</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {canExportBundle ? (
                <DropdownMenuItem onClick={() => setAutoBundleDialogOpen(true)}>
                  Configure Auto Export...
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="text-muted-foreground"
                  onClick={() => handleLockedFeatureClick("Auto Export")}
                >
                  <IconLock className="mr-2 h-3 w-3" stroke={1.7} />
                  Configure Auto Export
                  <span className="ml-auto text-xs">Starter+</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <Dialog
        open={autoBundleDialogOpen}
        onOpenChange={setAutoBundleDialogOpen}
      >
        <DialogContent className="sm:max-w-lg p-3">
          <DialogHeader>
            <DialogTitle>Auto export bundle</DialogTitle>
            <DialogDescription>
              Pick the outputs you want zipped together. We&apos;ll remember
              your selection for next time.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[50vh] overflow-auto pr-1">
            {autoExportOptions.map((option) => {
              const checked = autoBundleSelection.includes(option.id);
              return (
                <label
                  key={option.id}
                  className="flex items-start gap-4 rounded-xl border px-4 py-3"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(value) =>
                      toggleAutoBundleOption(option.id, value === true)
                    }
                    className="mt-1"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {option.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setAutoBundleSelection(autoExportOptions.map((o) => o.id))
              }
            >
              Select all
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAutoBundleSelection([])}
            >
              Clear
            </Button>
            <Button
              className="ml-auto"
              disabled={!selectedAutoBundleVariants.length}
              onClick={handleAutoBundleExport}
            >
              Export bundle (.zip)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
