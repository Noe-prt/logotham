"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarSectionProps, getValue } from "./types";


export function BackgroundSection({
  config,
  updateConfig,
  saveHistorySnapshot,
}: SidebarSectionProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-foreground tracking-wide uppercase">
            Background
          </Label>
          <Tabs
            value={config.bgMode}
            onValueChange={(mode) => {
              if (mode === config.bgMode) return;
              saveHistorySnapshot();
              updateConfig({ bgMode: mode as "solid" | "gradient" });
            }}
            className="w-32"
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

        <div className="flex flex-wrap gap-2 mb-4">
          {/* Solid Colors */}
          <button
            className="size-10 rounded-lg border shadow-sm hover:ring-2 hover:ring-primary/50 transition-all relative overflow-hidden group"
            title="Dark Blue"
            onClick={() => {
              saveHistorySnapshot();
              updateConfig({
                bgMode: "solid",
                bgColor: "#1f2937",
              });
            }}
          >
            <div className="absolute inset-0 bg-gray-800" />
          </button>
          <button
            className="size-10 rounded-lg border shadow-sm hover:ring-2 hover:ring-primary/50 transition-all relative overflow-hidden group"
            title="White"
            onClick={() => {
              saveHistorySnapshot();
              updateConfig({
                bgMode: "solid",
                bgColor: "#ffffff",
              });
            }}
          >
            <div className="absolute inset-0 bg-white" />
          </button>
          <button
            className="size-10 rounded-lg border shadow-sm hover:ring-2 hover:ring-primary/50 transition-all relative overflow-hidden group"
            title="Purple"
            onClick={() => {
              saveHistorySnapshot();
              updateConfig({
                bgMode: "solid",
                bgColor: "#7c2d12",
              });
            }}
          >
            <div className="absolute inset-0 bg-orange-900" />
          </button>

          {/* Gradient Colors */}
          <button
            className="size-10 rounded-lg border shadow-sm hover:ring-2 hover:ring-primary/50 transition-all relative overflow-hidden group"
            title="Blue to Purple"
            onClick={() => {
              saveHistorySnapshot();
              updateConfig({
                bgMode: "gradient",
                gradientStart: "#3b82f6",
                gradientEnd: "#8b5cf6",
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
              updateConfig({
                bgMode: "gradient",
                gradientStart: "#f59e0b",
                gradientEnd: "#ec4899",
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
              updateConfig({
                bgMode: "gradient",
                gradientStart: "#8b5cf6",
                gradientEnd: "#f472b6",
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
          {config.bgMode === "solid" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Color</Label>
                <div className="flex items-center gap-3">
                  <div
                    className="relative size-10 rounded-full overflow-hidden border shadow-sm transition-transform active:scale-95 cursor-pointer group"
                    onClick={saveHistorySnapshot}
                  >
                    <input
                      type="color"
                      value={config.bgColor}
                      onChange={(e) =>
                        updateConfig({ bgColor: e.target.value })
                      }
                      className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer opacity-0"
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ backgroundColor: config.bgColor }}
                    />
                  </div>
                  <Input
                    value={config.bgColor}
                    onChange={(e) => updateConfig({ bgColor: e.target.value })}
                    className="flex-1 font-mono uppercase text-xs"
                    maxLength={7}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">
                    Background Opacity
                  </Label>
                  <span className="text-xs font-mono text-muted-foreground">
                    {getValue(config.bgOpacity)}%
                  </span>
                </div>
                <div onPointerDown={saveHistorySnapshot}>
                  <Slider
                    value={config.bgOpacity}
                    onValueChange={(v) =>
                      updateConfig({ bgOpacity: v as number[] })
                    }
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Start</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="relative size-8 rounded-full overflow-hidden border shadow-sm cursor-pointer"
                      onClick={saveHistorySnapshot}
                    >
                      <input
                        type="color"
                        value={config.gradientStart}
                        onChange={(e) =>
                          updateConfig({ gradientStart: e.target.value })
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ backgroundColor: config.gradientStart }}
                      />
                    </div>
                    <Input
                      value={config.gradientStart}
                      onChange={(e) =>
                        updateConfig({ gradientStart: e.target.value })
                      }
                      className="h-8 font-mono uppercase text-[10px] px-2"
                      maxLength={7}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">End</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="relative size-8 rounded-full overflow-hidden border shadow-sm cursor-pointer"
                      onClick={saveHistorySnapshot}
                    >
                      <input
                        type="color"
                        value={config.gradientEnd}
                        onChange={(e) =>
                          updateConfig({ gradientEnd: e.target.value })
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ backgroundColor: config.gradientEnd }}
                      />
                    </div>
                    <Input
                      value={config.gradientEnd}
                      onChange={(e) =>
                        updateConfig({ gradientEnd: e.target.value })
                      }
                      className="h-8 font-mono uppercase text-[10px] px-2"
                      maxLength={7}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">Angle</Label>
                  <span className="text-xs font-mono text-muted-foreground">
                    {getValue(config.gradientAngle)}°
                  </span>
                </div>
                <div onPointerDown={saveHistorySnapshot}>
                  <Slider
                    value={config.gradientAngle}
                    onValueChange={(v) =>
                      updateConfig({ gradientAngle: v as number[] })
                    }
                    min={0}
                    max={360}
                    step={1}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">
                    Background Opacity
                  </Label>
                  <span className="text-xs font-mono text-muted-foreground">
                    {getValue(config.bgOpacity)}%
                  </span>
                </div>
                <div onPointerDown={saveHistorySnapshot}>
                  <Slider
                    value={config.bgOpacity}
                    onValueChange={(v) =>
                      updateConfig({ bgOpacity: v as number[] })
                    }
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
