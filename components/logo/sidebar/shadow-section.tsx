"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { SidebarSectionProps, getValue } from "./types";
import { cn } from "@/lib/utils";

export function ShadowSection({
  config,
  updateConfig,
  saveHistorySnapshot,
}: SidebarSectionProps) {
  const shadowContentRef = React.useRef<HTMLDivElement>(null);

  const currentShadowBlur = getValue(config.shadowBlur);
  const currentShadowOpacity = getValue(config.shadowOpacity);
  const currentShadowX = getValue(config.shadowX);
  const currentShadowY = getValue(config.shadowY);

  React.useEffect(() => {
    if (config.shadowEnabled && shadowContentRef.current) {
      requestAnimationFrame(() => {
        const element = shadowContentRef.current;
        if (!element) return;

        const scrollContainer = element.closest(
          '[data-slot="scroll-area-viewport"]'
        );
        if (scrollContainer) {
          const containerRect = scrollContainer.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          const offset =
            elementRect.top - containerRect.top + scrollContainer.scrollTop;

          scrollContainer.scrollTo({
            top: offset - 20,
            behavior: "smooth",
          });
        } else {
          element.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      });
    }
  }, [config.shadowEnabled]);

  return (
    <section className="space-y-4">
      <div className="space-y-4">
        <Label className="text-xs font-semibold text-foreground tracking-wide uppercase">
          Shadow
        </Label>

        <div className="grid grid-cols-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 text-[10px]",
              !config.shadowEnabled && "border-primary bg-primary/5"
            )}
            onClick={() => {
              saveHistorySnapshot();
              updateConfig({ shadowEnabled: false });
            }}
          >
            None
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 text-[10px]",
              config.shadowEnabled &&
                currentShadowBlur === 24 &&
                "border-primary bg-primary/5"
            )}
            onClick={() => {
              saveHistorySnapshot();
              updateConfig({
                shadowEnabled: true,
                shadowBlur: [24],
                shadowOpacity: [0.15],
                shadowX: [0],
                shadowY: [8],
              });
            }}
          >
            Soft
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 text-[10px]",
              config.shadowEnabled &&
                currentShadowBlur === 0 &&
                "border-primary bg-primary/5"
            )}
            onClick={() => {
              saveHistorySnapshot();
              updateConfig({
                shadowEnabled: true,
                shadowBlur: [0],
                shadowOpacity: [0.2],
                shadowX: [4],
                shadowY: [4],
              });
            }}
          >
            Hard
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 text-[10px]",
              config.shadowEnabled &&
                currentShadowBlur === 32 &&
                "border-primary bg-primary/5"
            )}
            onClick={() => {
              saveHistorySnapshot();
              updateConfig({
                shadowEnabled: true,
                shadowBlur: [32],
                shadowOpacity: [0.2],
                shadowX: [0],
                shadowY: [16],
              });
            }}
          >
            Float
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">Custom Settings</Label>
        <Switch
          checked={config.shadowEnabled}
          onCheckedChange={(c) => updateConfig({ shadowEnabled: c }, true)}
        />
      </div>
      {config.shadowEnabled && (
        <div
          ref={shadowContentRef}
          className="space-y-4 pl-2 border-l-2 border-muted animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Color</Label>
            <div className="flex items-center gap-3">
              <div
                className="relative size-10 rounded-full overflow-hidden border shadow-sm transition-transform active:scale-95 cursor-pointer group"
                onClick={saveHistorySnapshot}
              >
                <input
                  type="color"
                  value={config.shadowColor}
                  onChange={(e) =>
                    updateConfig({ shadowColor: e.target.value })
                  }
                  className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer opacity-0"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ backgroundColor: config.shadowColor }}
                />
              </div>
              <Input
                value={config.shadowColor}
                onChange={(e) => updateConfig({ shadowColor: e.target.value })}
                className="flex-1 font-mono uppercase text-xs"
                maxLength={7}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="text-xs text-muted-foreground">Blur</Label>
              <span className="text-xs font-mono text-muted-foreground">
                {currentShadowBlur}px
              </span>
            </div>
            <div onPointerDown={saveHistorySnapshot}>
              <Slider
                value={config.shadowBlur}
                onValueChange={(v) =>
                  updateConfig({ shadowBlur: v as number[] })
                }
                min={0}
                max={100}
                step={1}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="text-xs text-muted-foreground">Opacity</Label>
              <span className="text-xs font-mono text-muted-foreground">
                {Math.round(currentShadowOpacity * 100)}%
              </span>
            </div>
            <div onPointerDown={saveHistorySnapshot}>
              <Slider
                value={config.shadowOpacity}
                onValueChange={(v) =>
                  updateConfig({ shadowOpacity: v as number[] })
                }
                min={0}
                max={1}
                step={0.01}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="text-xs text-muted-foreground">
                  X Offset
                </Label>
                <span className="text-xs font-mono text-muted-foreground">
                  {currentShadowX}px
                </span>
              </div>
              <div onPointerDown={saveHistorySnapshot}>
                <Slider
                  value={config.shadowX}
                  onValueChange={(v) =>
                    updateConfig({ shadowX: v as number[] })
                  }
                  min={-50}
                  max={50}
                  step={1}
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="text-xs text-muted-foreground">
                  Y Offset
                </Label>
                <span className="text-xs font-mono text-muted-foreground">
                  {currentShadowY}px
                </span>
              </div>
              <div onPointerDown={saveHistorySnapshot}>
                <Slider
                  value={config.shadowY}
                  onValueChange={(v) =>
                    updateConfig({ shadowY: v as number[] })
                  }
                  min={-50}
                  max={50}
                  step={1}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
