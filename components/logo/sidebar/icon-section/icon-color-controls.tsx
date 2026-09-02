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

export function IconColorControls({
  config,
  updateConfig,
  saveHistorySnapshot,
  activeLayerId,
  updateExtraIcon,
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
    <div className="space-y-4">
      <Label className="text-xs font-semibold text-foreground tracking-wide uppercase">
        Icon
      </Label>

      <div className="flex flex-wrap gap-2 mb-2">
        {/* Solid Colors */}
        <button
          className="size-10 rounded-lg border shadow-sm hover:ring-2 hover:ring-primary/50 transition-all relative overflow-hidden group"
          title="White"
          onClick={() => {
            saveHistorySnapshot();
            applyIconStyleUpdate({
              iconColorMode: "solid",
              iconColor: "#ffffff",
            });
          }}
        >
          <div className="absolute inset-0 bg-white" />
        </button>
        <button
          className="size-10 rounded-lg border shadow-sm hover:ring-2 hover:ring-primary/50 transition-all relative overflow-hidden group"
          title="Black"
          onClick={() => {
            saveHistorySnapshot();
            applyIconStyleUpdate({
              iconColorMode: "solid",
              iconColor: "#000000",
            });
          }}
        >
          <div className="absolute inset-0 bg-black" />
        </button>
        <button
          className="size-10 rounded-lg border shadow-sm hover:ring-2 hover:ring-primary/50 transition-all relative overflow-hidden group"
          title="Blue"
          onClick={() => {
            saveHistorySnapshot();
            applyIconStyleUpdate({
              iconColorMode: "solid",
              iconColor: "#3b82f6",
            });
          }}
        >
          <div className="absolute inset-0 bg-blue-500" />
        </button>

        {/* Gradient Colors */}
        <button
          className="size-10 rounded-lg border shadow-sm hover:ring-2 hover:ring-primary/50 transition-all relative overflow-hidden group"
          title="Blue to Purple"
          onClick={() => {
            saveHistorySnapshot();
            applyIconStyleUpdate({
              iconColorMode: "gradient",
              iconColorGradientStart: "#3b82f6",
              iconColorGradientEnd: "#8b5cf6",
            });
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            }}
          />
        </button>
        <button
          className="size-10 rounded-lg border shadow-sm hover:ring-2 hover:ring-primary/50 transition-all relative overflow-hidden group"
          title="Orange to Pink"
          onClick={() => {
            saveHistorySnapshot();
            applyIconStyleUpdate({
              iconColorMode: "gradient",
              iconColorGradientStart: "#f59e0b",
              iconColorGradientEnd: "#ec4899",
            });
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #f59e0b, #ec4899)",
            }}
          />
        </button>
        <button
          className="size-10 rounded-lg border shadow-sm hover:ring-2 hover:ring-primary/50 transition-all relative overflow-hidden group"
          title="Purple to Pink"
          onClick={() => {
            saveHistorySnapshot();
            applyIconStyleUpdate({
              iconColorMode: "gradient",
              iconColorGradientStart: "#8b5cf6",
              iconColorGradientEnd: "#f472b6",
            });
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #8b5cf6, #f472b6)",
            }}
          />
        </button>
      </div>

      <div className="space-y-4 pl-2 border-l-2 border-muted">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Color Mode
            </Label>
            <Tabs
              value={
                (activeLayerId === "primary"
                  ? config.iconColorMode
                  : activeLayer?.iconColorMode ?? config.iconColorMode) ??
                "solid"
              }
              onValueChange={(value) => {
                saveHistorySnapshot();
                const mode = value as LogoConfig["iconColorMode"];
                const updates: {
                  iconColorMode?: "solid" | "gradient";
                  iconColorGradientStart?: string;
                  iconColorGradientEnd?: string;
                } = {
                  iconColorMode: mode,
                };
                const currentColor =
                  activeLayerId === "primary"
                    ? config.iconColor
                    : activeLayer?.iconColor ?? config.iconColor;

                if (mode === "gradient") {
                  updates.iconColorGradientStart = currentColor;
                  updates.iconColorGradientEnd = currentColor;
                }
                applyIconStyleUpdate(updates);
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
            ? config.iconColorMode
            : activeLayer?.iconColorMode ?? config.iconColorMode) ??
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
                      ? config.iconColor
                      : activeLayer?.iconColor ?? config.iconColor
                  }
                  onChange={(e) => {
                    applyIconStyleUpdate({ iconColor: e.target.value });
                  }}
                  className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer opacity-0"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundColor:
                      activeLayerId === "primary"
                        ? config.iconColor
                        : activeLayer?.iconColor ?? config.iconColor,
                  }}
                />
              </div>
              <Input
                value={
                  activeLayerId === "primary"
                    ? config.iconColor
                    : activeLayer?.iconColor ?? config.iconColor
                }
                onChange={(e) => {
                  applyIconStyleUpdate({ iconColor: e.target.value });
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
                        ? config.iconColorGradientStart
                        : activeLayer?.iconColorGradientStart ??
                          config.iconColorGradientStart
                    }
                    onChange={(e) => {
                      const v = e.target.value;
                      applyIconStyleUpdate({ iconColorGradientStart: v });
                    }}
                    className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer opacity-0"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundColor:
                        activeLayerId === "primary"
                          ? config.iconColorGradientStart
                          : activeLayer?.iconColorGradientStart ??
                            config.iconColorGradientStart,
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
                        ? config.iconColorGradientEnd
                        : activeLayer?.iconColorGradientEnd ??
                          config.iconColorGradientEnd
                    }
                    onChange={(e) => {
                      const v = e.target.value;
                      applyIconStyleUpdate({ iconColorGradientEnd: v });
                    }}
                    className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer opacity-0"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundColor:
                        activeLayerId === "primary"
                          ? config.iconColorGradientEnd
                          : activeLayer?.iconColorGradientEnd ??
                            config.iconColorGradientEnd,
                    }}
                  />
                </div>
                <div
                  className="h-10 flex-1 rounded-md border"
                  style={{
                    backgroundImage: buildLinearGradientCss(
                      (activeLayerId === "primary"
                        ? config.iconColorGradientStart
                        : activeLayer?.iconColorGradientStart ??
                          config.iconColorGradientStart) ?? "#ffffff",
                      (activeLayerId === "primary"
                        ? config.iconColorGradientEnd
                        : activeLayer?.iconColorGradientEnd ??
                          config.iconColorGradientEnd) ?? "#f3f4f6",
                      getValue(
                        (activeLayerId === "primary"
                          ? config.iconColorGradientAngle
                          : activeLayer?.iconColorGradientAngle ??
                            config.iconColorGradientAngle) ?? [90]
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
                        ? config.iconColorGradientAngle
                        : activeLayer?.iconColorGradientAngle ??
                          config.iconColorGradientAngle) ?? [90]
                    )}
                    °
                  </span>
                </div>
                <div onPointerDown={saveHistorySnapshot}>
                  <Slider
                    value={
                      (activeLayerId === "primary"
                        ? config.iconColorGradientAngle
                        : activeLayer?.iconColorGradientAngle ??
                          config.iconColorGradientAngle) ?? [90]
                    }
                    onValueChange={(v) => {
                      applyIconStyleUpdate({
                        iconColorGradientAngle: v as number[],
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
            <Label className="text-xs text-muted-foreground">
              Opacity
            </Label>
            <span className="text-xs font-mono text-muted-foreground">
              {getValue(
                activeLayerId === "primary"
                  ? config.iconOpacity
                  : activeLayer?.iconOpacity ?? config.iconOpacity
              )}
              %
            </span>
          </div>
          <div onPointerDown={saveHistorySnapshot}>
            <Slider
              value={
                activeLayerId === "primary"
                  ? config.iconOpacity
                  : activeLayer?.iconOpacity ?? config.iconOpacity
              }
              onValueChange={(v) => {
                applyIconStyleUpdate({ iconOpacity: v as number[] });
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
