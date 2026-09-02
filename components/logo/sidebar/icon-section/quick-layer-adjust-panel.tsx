"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { type LogoConfig, type LogoExtraIcon } from "@/lib/logo-types";
import { XIcon } from "lucide-react";
import { getValue } from "../types";

type QuickLayerAdjustPanelProps = {
  layerId: string;
  config: LogoConfig;
  extraIcons: LogoExtraIcon[];
  updateConfig: (partial: Partial<LogoConfig>) => void;
  updateExtraIcon: (id: string, partial: Partial<LogoExtraIcon>) => void;
  saveHistorySnapshot: () => void;
  onClose: () => void;
};

export function QuickLayerAdjustPanel({
  layerId,
  config,
  extraIcons,
  updateConfig,
  updateExtraIcon,
  saveHistorySnapshot,
  onClose,
}: QuickLayerAdjustPanelProps) {
  const isPrimary = layerId === "primary";
  const layer = isPrimary ? null : extraIcons.find((icon) => icon.id === layerId);
  const hasIcon =
    (isPrimary && config.iconType !== "none") || (!isPrimary && Boolean(layer));
  const maxOffset = Math.round(getValue(config.size) / 2);

  if (!hasIcon) {
    return null;
  }

  const sizeValue = isPrimary
    ? getValue(config.iconSize)
    : Math.round(layer?.size ?? 0);
  const xOffset = isPrimary
    ? config.iconPosition?.x ?? 0
    : layer?.position.x ?? 0;
  const yOffset = isPrimary
    ? config.iconPosition?.y ?? 0
    : layer?.position.y ?? 0;

  const handleSizeChange = (value: number) => {
    if (isPrimary) {
      updateConfig({ iconSize: [value] });
    } else if (layer) {
      updateExtraIcon(layer.id, { size: value });
    }
  };

  const handleOffsetChange = (axis: "x" | "y", value: number) => {
    if (isPrimary) {
      updateConfig({
        iconPosition: {
          x: axis === "x" ? value : config.iconPosition?.x ?? 0,
          y: axis === "y" ? value : config.iconPosition?.y ?? 0,
        },
      });
      return;
    }

    if (layer) {
      updateExtraIcon(layer.id, {
        position: {
          ...layer.position,
          [axis]: value,
        },
      });
    }
  };

  return (
    <div className="mt-3 rounded-xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Quick Transform
          </p>
          <p className="text-sm font-medium">
            {isPrimary ? "Primary icon" : "Layer"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onClose}
        >
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Close quick transform</span>
        </Button>
      </div>
      <div className="mt-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Size</span>
            <span className="font-mono">{sizeValue}%</span>
          </div>
          <div onPointerDown={saveHistorySnapshot}>
            <Slider
              value={[sizeValue]}
              min={10}
              max={isPrimary ? 90 : 150}
              step={1}
              onValueChange={(val) =>
                handleSizeChange(Array.isArray(val) ? val[0] : val)
              }
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>X Offset</span>
            <span className="font-mono">{Math.round(xOffset)}px</span>
          </div>
          <div onPointerDown={saveHistorySnapshot}>
            <Slider
              value={[xOffset]}
              min={-maxOffset}
              max={maxOffset}
              step={1}
              onValueChange={(val) =>
                handleOffsetChange("x", Array.isArray(val) ? val[0] : val)
              }
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Y Offset</span>
            <span className="font-mono">{Math.round(yOffset)}px</span>
          </div>
          <div onPointerDown={saveHistorySnapshot}>
            <Slider
              value={[yOffset]}
              min={-maxOffset}
              max={maxOffset}
              step={1}
              onValueChange={(val) =>
                handleOffsetChange("y", Array.isArray(val) ? val[0] : val)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
