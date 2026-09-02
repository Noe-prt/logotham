"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildLinearGradientCss } from "@/lib/color-utils";
import { type LogoConfig, type LogoExtraIcon } from "@/lib/logo-types";
import * as React from "react";
import { getValue } from "../types";
import { IconComponentProps } from "./types";

export function FillControls({
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

  const applyIconFillUpdate = React.useCallback(
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

  const fillNotSupported =
    currentIconType === "boxicons" ||
    currentIconType === "flaticon" ||
    currentIconType === "fontawesome" ||
    currentIconType === "lineicons";

  if (fillNotSupported) {
    return (
      <div className="space-y-3">
        <Label className="text-xs font-semibold text-foreground tracking-wide uppercase">
          Fill
        </Label>
        <div className="pl-2 border-l-2 border-muted text-xs text-muted-foreground space-y-2">
          <p>
            This icon library only supports a single color, so separate fill
            settings aren&apos;t available. Try switching to Lucide, Heroicons,
            Iconoir, Tabler, Hugeicons, Lineicons, or a custom SVG if you need
            independent stroke and fill colors.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label className="text-xs font-semibold text-foreground tracking-wide uppercase">
        Fill
      </Label>
      <div className="space-y-4 pl-2 border-l-2 border-muted">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Color Mode</Label>
            <Tabs
              value={
                (activeLayerId === "primary"
                  ? config.iconFillColorMode
                  : activeLayer?.iconFillColorMode ??
                    config.iconFillColorMode) ?? "solid"
              }
              onValueChange={(value) => {
                saveHistorySnapshot();
                const mode = value as LogoConfig["iconFillColorMode"];
                const updates: {
                  iconFillColorMode?: "solid" | "gradient";
                  iconFillGradientStart?: string;
                  iconFillGradientEnd?: string;
                } = {
                  iconFillColorMode: mode,
                };
                const currentFill =
                  activeLayerId === "primary"
                    ? config.iconFillColor
                    : activeLayer?.iconFillColor ?? config.iconFillColor;

                if (mode === "gradient") {
                  updates.iconFillGradientStart = currentFill;
                  updates.iconFillGradientEnd = currentFill;
                }
                applyIconFillUpdate(updates);
              }}
              className="w-32"
            >
              <TabsList className="grid grid-cols-2 h-7">
                <TabsTrigger value="solid" className="text-[11px]">
                  Solid
                </TabsTrigger>
                <TabsTrigger value="gradient" className="text-[11px]">
                  Gradient
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {((activeLayerId === "primary"
            ? config.iconFillColorMode
            : activeLayer?.iconFillColorMode ?? config.iconFillColorMode) ??
            "solid") === "solid" ? (
            <div className="flex items-center gap-3">
              <div
                className="relative size-10 rounded-full overflow-hidden border shadow-sm transition-transform active:scale-95 cursor-pointer group"
                onClick={saveHistorySnapshot}
              >
                <input
                  type="color"
                  value={
                    activeLayerId === "primary"
                      ? config.iconFillColor
                      : activeLayer?.iconFillColor ?? config.iconFillColor
                  }
                  onChange={(e) => {
                    const v = e.target.value;
                    applyIconFillUpdate({ iconFillColor: v });
                  }}
                  className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer opacity-0"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundColor:
                      activeLayerId === "primary"
                        ? config.iconFillColor
                        : activeLayer?.iconFillColor ?? config.iconFillColor,
                  }}
                />
              </div>
              <Input
                value={
                  activeLayerId === "primary"
                    ? config.iconFillColor
                    : activeLayer?.iconFillColor ?? config.iconFillColor
                }
                onChange={(e) => {
                  const v = e.target.value;
                  applyIconFillUpdate({ iconFillColor: v });
                }}
                className="flex-1 font-mono uppercase text-xs"
                maxLength={7}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="relative size-10 rounded-full overflow-hidden border shadow-sm cursor-pointer"
                  onClick={saveHistorySnapshot}
                >
                  <input
                    type="color"
                    value={
                      activeLayerId === "primary"
                        ? config.iconFillGradientStart
                        : activeLayer?.iconFillGradientStart ??
                          config.iconFillGradientStart
                    }
                    onChange={(e) => {
                      const v = e.target.value;
                      applyIconFillUpdate({ iconFillGradientStart: v });
                    }}
                    className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer opacity-0"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundColor:
                        activeLayerId === "primary"
                          ? config.iconFillGradientStart
                          : activeLayer?.iconFillGradientStart ??
                            config.iconFillGradientStart,
                    }}
                  />
                </div>
                <div
                  className="relative size-10 rounded-full overflow-hidden border shadow-sm cursor-pointer"
                  onClick={saveHistorySnapshot}
                >
                  <input
                    type="color"
                    value={
                      activeLayerId === "primary"
                        ? config.iconFillGradientEnd
                        : activeLayer?.iconFillGradientEnd ??
                          config.iconFillGradientEnd
                    }
                    onChange={(e) => {
                      const v = e.target.value;
                      applyIconFillUpdate({ iconFillGradientEnd: v });
                    }}
                    className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer opacity-0"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundColor:
                        activeLayerId === "primary"
                          ? config.iconFillGradientEnd
                          : activeLayer?.iconFillGradientEnd ??
                            config.iconFillGradientEnd,
                    }}
                  />
                </div>
                <div
                  className="h-10 flex-1 rounded-md border"
                  style={{
                    backgroundImage: buildLinearGradientCss(
                      (activeLayerId === "primary"
                        ? config.iconFillGradientStart
                        : activeLayer?.iconFillGradientStart ??
                          config.iconFillGradientStart) ?? "#ffffff",
                      (activeLayerId === "primary"
                        ? config.iconFillGradientEnd
                        : activeLayer?.iconFillGradientEnd ??
                          config.iconFillGradientEnd) ?? "#f3f4f6",
                      getValue(
                        (activeLayerId === "primary"
                          ? config.iconFillGradientAngle
                          : activeLayer?.iconFillGradientAngle ??
                            config.iconFillGradientAngle) ?? [90]
                      )
                    ),
                  }}
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Angle</span>
                  <span>
                    {getValue(
                      (activeLayerId === "primary"
                        ? config.iconFillGradientAngle
                        : activeLayer?.iconFillGradientAngle ??
                          config.iconFillGradientAngle) ?? [90]
                    )}
                    °
                  </span>
                </div>
                <div onPointerDown={saveHistorySnapshot}>
                  <Slider
                    value={
                      (activeLayerId === "primary"
                        ? config.iconFillGradientAngle
                        : activeLayer?.iconFillGradientAngle ??
                          config.iconFillGradientAngle) ?? [90]
                    }
                    onValueChange={(v) => {
                      applyIconFillUpdate({
                        iconFillGradientAngle: v as number[],
                      });
                    }}
                    min={0}
                    max={360}
                    step={1}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="text-xs text-muted-foreground">Opacity</Label>
            <span className="text-xs font-mono text-muted-foreground">
              {getValue(
                activeLayerId === "primary"
                  ? config.iconFillOpacity
                  : activeLayer?.iconFillOpacity ?? config.iconFillOpacity
              )}
              %
            </span>
          </div>
          <div onPointerDown={saveHistorySnapshot}>
            <Slider
              value={
                activeLayerId === "primary"
                  ? config.iconFillOpacity
                  : activeLayer?.iconFillOpacity ?? config.iconFillOpacity
              }
              onValueChange={(v) => {
                const val = Array.isArray(v) ? v : [v];
                const newOpacity = val[0];
                const oldOpacity = getValue(
                  activeLayerId === "primary"
                    ? config.iconFillOpacity
                    : activeLayer?.iconFillOpacity ?? config.iconFillOpacity
                );

                const updates: Partial<LogoConfig> & Partial<LogoExtraIcon> = {
                  iconFillOpacity: val as number[],
                };

                if (oldOpacity === 0 && newOpacity > 0) {
                  if (config.iconFillColor === config.iconColor) {
                    updates.iconFillColor = "#cccccc";
                  }
                }

                applyIconFillUpdate(updates);
              }}
              min={0}
              max={100}
              step={1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
