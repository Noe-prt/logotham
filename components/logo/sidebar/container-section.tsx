"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { SidebarSectionProps, getValue } from "./types";
import { Square, Circle, Squircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContainerSection({
  config,
  updateConfig,
  saveHistorySnapshot,
}: SidebarSectionProps) {
  const currentSize = getValue(config.size);
  const currentExportSize = getValue(config.exportSize ?? config.size);
  const currentRadius = getValue(config.radius);

  const isCircle = currentRadius >= currentSize / 2;
  const isSquare = currentRadius === 0;
  const isRounded = !isCircle && !isSquare;

  return (
    <section className="space-y-4">
      <div className="space-y-4">
        <Label className="text-xs font-semibold text-foreground tracking-wide uppercase">
          Dimensions
        </Label>

        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex flex-col h-16 gap-1",
              isSquare && "border-primary bg-primary/5"
            )}
            onClick={() => {
              saveHistorySnapshot();
              updateConfig({ radius: [0] });
            }}
          >
            <Square className="h-5 w-5" />
            <span className="text-[10px] font-normal">Square</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex flex-col h-16 gap-1",
              isRounded && "border-primary bg-primary/5"
            )}
            onClick={() => {
              saveHistorySnapshot();
              updateConfig({ radius: [Math.min(32, currentSize / 2)] });
            }}
          >
            <Squircle className="h-5 w-5" />
            <span className="text-[10px] font-normal">Rounded</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex flex-col h-16 gap-1",
              isCircle && "border-primary bg-primary/5"
            )}
            onClick={() => {
              saveHistorySnapshot();
              updateConfig({ radius: [currentSize / 2] });
            }}
          >
            <Circle className="h-5 w-5" />
            <span className="text-[10px] font-normal">Circle</span>
          </Button>
        </div>

        <div className="space-y-4 pl-2 border-l-2 border-muted pt-2">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="text-xs text-muted-foreground">
                Export Size
              </Label>
              <span className="text-xs font-mono text-muted-foreground">
                {currentExportSize}px
              </span>
            </div>
            <div onPointerDown={saveHistorySnapshot}>
              <Slider
                value={config.exportSize ?? config.size}
                onValueChange={(val) => {
                  updateConfig({ exportSize: val as number[] });
                }}
                min={64}
                max={2048}
                step={16}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="text-xs text-muted-foreground">
                Padding
              </Label>
              <span className="text-xs font-mono text-muted-foreground">
                {getValue(config.padding)}px
              </span>
            </div>
            <div onPointerDown={saveHistorySnapshot}>
              <Slider
                value={config.padding ?? [0]}
                onValueChange={(v) => updateConfig({ padding: v as number[] })}
                min={0}
                max={currentSize / 2 - 20}
                step={4}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="text-xs text-muted-foreground">
                Border Radius
              </Label>
              <span className="text-xs font-mono text-muted-foreground">
                {currentRadius}px
              </span>
            </div>
            <div onPointerDown={saveHistorySnapshot}>
              <Slider
                value={config.radius}
                onValueChange={(v) => updateConfig({ radius: v as number[] })}
                min={0}
                max={currentSize / 2}
                step={1}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
