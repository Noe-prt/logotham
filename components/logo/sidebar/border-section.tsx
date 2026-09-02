"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildLinearGradientCss } from "@/lib/color-utils";
import type { LogoConfig } from "@/lib/logo-types";
import { SidebarSectionProps, getValue } from "./types";

const borderPresets = [
  {
    name: "Clean",
    width: 2,
    mode: "solid" as const,
    color: "#e2e8f0",
  },
  {
    name: "Bold",
    width: 6,
    mode: "solid" as const,
    color: "#6366f1",
  },
  {
    name: "Accent",
    width: 4,
    mode: "solid" as const,
    color: "#f97316",
  },
  {
    name: "Neo",
    width: 5,
    mode: "gradient" as const,
    gradientStart: "#34d399",
    gradientEnd: "#14b8a6",
    gradientAngle: 120,
  },
  {
    name: "Sunset",
    width: 7,
    mode: "gradient" as const,
    gradientStart: "#f97316",
    gradientEnd: "#fb7185",
    gradientAngle: 135,
  },
  {
    name: "Aurora",
    width: 8,
    mode: "gradient" as const,
    gradientStart: "#8b5cf6",
    gradientEnd: "#0ea5e9",
    gradientAngle: 90,
  },
];

export function BorderSection({
  config,
  updateConfig,
  saveHistorySnapshot,
}: SidebarSectionProps) {
  const currentBorderWidth = getValue(config.borderWidth);
  const borderMode = config.borderColorMode ?? "solid";

  return (
    <section className="space-y-4">
      <div className="space-y-4">
        <Label className="text-xs font-semibold text-foreground tracking-wide uppercase">
          Border
        </Label>
        <div className="space-y-4 pl-2 border-l-2 border-muted">
          <div className="grid grid-cols-3 gap-2">
            {borderPresets.map((preset) => {
              const gradientPreview =
                preset.mode === "gradient"
                  ? buildLinearGradientCss(
                      preset.gradientStart ?? "#000000",
                      preset.gradientEnd ?? "#000000",
                      preset.gradientAngle ?? 90
                    )
                  : undefined;
              return (
                <button
                  key={preset.name}
                  className="aspect-[3/2] rounded-lg border shadow-sm p-2 text-left hover:ring-2 hover:ring-primary/50 transition-all flex flex-col justify-between"
                  onClick={() => {
                    saveHistorySnapshot();
                    const updates: Partial<LogoConfig> = {
                      borderWidth: [preset.width],
                      borderColorMode: preset.mode,
                    };
                    if (preset.mode === "solid") {
                      updates.borderColor = preset.color;
                    } else {
                      updates.borderGradientStart = preset.gradientStart;
                      updates.borderGradientEnd = preset.gradientEnd;
                      updates.borderGradientAngle = [
                        preset.gradientAngle ?? 90,
                      ];
                    }
                    updateConfig(updates);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {preset.name}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {preset.width}px
                    </span>
                  </div>
                  <div
                    className="h-6 rounded-full border bg-muted/40"
                    style={{
                      borderWidth: `${Math.max(preset.width / 2, 1)}px`,
                      borderColor:
                        preset.mode === "solid" ? preset.color : "transparent",
                      backgroundImage: gradientPreview,
                    }}
                  />
                </button>
              );
            })}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Color</Label>
              <Tabs
                value={borderMode}
                onValueChange={(mode) => {
                  if (mode === borderMode) return;
                  saveHistorySnapshot();
                  updateConfig({
                    borderColorMode: mode as "solid" | "gradient",
                  });
                }}
                className="w-28"
              >
                <TabsList className="grid grid-cols-2 h-7">
                  <TabsTrigger value="solid" className="text-[10px]">
                    Solid
                  </TabsTrigger>
                  <TabsTrigger value="gradient" className="text-[10px]">
                    Gradient
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {borderMode === "solid" ? (
              <div className="flex items-center gap-3">
                <div
                  className="relative size-10 rounded-full overflow-hidden border shadow-sm transition-transform active:scale-95 cursor-pointer group"
                  onClick={saveHistorySnapshot}
                >
                  <input
                    type="color"
                    value={config.borderColor}
                    onChange={(e) =>
                      updateConfig({ borderColor: e.target.value })
                    }
                    className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer opacity-0"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ backgroundColor: config.borderColor }}
                  />
                </div>
                <Input
                  value={config.borderColor}
                  onChange={(e) =>
                    updateConfig({ borderColor: e.target.value })
                  }
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
                      value={config.borderGradientStart ?? config.borderColor}
                      onChange={(e) =>
                        updateConfig({ borderGradientStart: e.target.value })
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundColor:
                          config.borderGradientStart ?? config.borderColor,
                      }}
                    />
                  </div>
                  <div
                    className="relative size-10 rounded-full overflow-hidden border shadow-sm cursor-pointer"
                    onClick={saveHistorySnapshot}
                  >
                    <input
                      type="color"
                      value={config.borderGradientEnd ?? config.borderColor}
                      onChange={(e) =>
                        updateConfig({ borderGradientEnd: e.target.value })
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundColor:
                          config.borderGradientEnd ?? config.borderColor,
                      }}
                    />
                  </div>
                  <div
                    className="h-10 flex-1 rounded-md border"
                    style={{
                      backgroundImage: buildLinearGradientCss(
                        config.borderGradientStart ?? config.borderColor,
                        config.borderGradientEnd ?? config.borderColor,
                        getValue(config.borderGradientAngle ?? [90])
                      ),
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Angle</span>
                    <span>{getValue(config.borderGradientAngle ?? [90])}°</span>
                  </div>
                  <div onPointerDown={saveHistorySnapshot}>
                    <Slider
                      value={config.borderGradientAngle ?? [90]}
                      onValueChange={(v) =>
                        updateConfig({
                          borderGradientAngle: v as number[],
                        })
                      }
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
              <Label className="text-xs text-muted-foreground">Width</Label>
              <span className="text-xs font-mono text-muted-foreground">
                {currentBorderWidth}px
              </span>
            </div>
            <div onPointerDown={saveHistorySnapshot}>
              <Slider
                value={config.borderWidth}
                onValueChange={(v) =>
                  updateConfig({ borderWidth: v as number[] })
                }
                min={0}
                max={20}
                step={1}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
