"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { type LogoConfig, type LogoExtraIcon } from "@/lib/logo-types";
import * as React from "react";
import { getValue } from "../types";
import { IconComponentProps } from "./types";

export function StrokeControls({
  config,
  updateConfig,
  saveHistorySnapshot,
  activeLayerId,
  updateExtraIcon,
  currentIconType,
  disableCustomIconPreserve,
}: IconComponentProps) {
  const activeLayer =
    activeLayerId === "primary"
      ? null
      : config.extraIcons?.find((i) => i.id === activeLayerId);

  const applyIconStyleUpdate = React.useCallback(
    (updates: Partial<LogoConfig> & Partial<LogoExtraIcon>) => {
      if (activeLayerId === "primary") {
        disableCustomIconPreserve("primary");
        updateConfig(updates);
      } else {
        disableCustomIconPreserve(activeLayerId);
        updateExtraIcon(activeLayerId, updates);
      }
    },
    [
      activeLayerId,
      disableCustomIconPreserve,
      updateConfig,
      updateExtraIcon,
    ]
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <Label className="text-xs text-muted-foreground">Width</Label>
          <span className="text-xs font-mono text-muted-foreground">
            {getValue(
              activeLayerId === "primary"
                ? config.strokeWidth
                : activeLayer?.strokeWidth ?? config.strokeWidth
            )}
            px
          </span>
        </div>
        {!(currentIconType !== "boxicons" && currentIconType !== "flaticon") && (
          <span className="text-[10px] text-muted-foreground">
            Not supported for{" "}
            {currentIconType === "boxicons" ? "Boxicons" : "Flaticon"} icons.
          </span>
        )}
      </div>
      <div onPointerDown={saveHistorySnapshot}>
        <Slider
          value={
            activeLayerId === "primary"
              ? config.strokeWidth
              : activeLayer?.strokeWidth ?? config.strokeWidth
          }
          onValueChange={(v) => {
            applyIconStyleUpdate({ strokeWidth: v as number[] });
          }}
          min={0.5}
          max={4}
          step={0.1}
          disabled={
            !(currentIconType !== "boxicons" && currentIconType !== "flaticon")
          }
        />
      </div>
    </div>
  );
}
