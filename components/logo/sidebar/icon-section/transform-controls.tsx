"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import * as React from "react";
import { getValue } from "../types";
import { IconComponentProps } from "./types";

export function TransformControls({
  config,
  updateConfig,
  saveHistorySnapshot,
  activeLayerId,
  updateExtraIcon,
  disableCustomIconPreserve: _disableCustomIconPreserve,
}: IconComponentProps) {
  void _disableCustomIconPreserve;
  const activeLayer =
    activeLayerId === "primary"
      ? null
      : config.extraIcons?.find((i) => i.id === activeLayerId);
  const maxOffset = Math.round(getValue(config.size) / 2);

  return (
    <div className="space-y-4">
      <Label className="text-xs font-semibold text-foreground tracking-wide uppercase">
        Transform
      </Label>
      <div className="space-y-4 pl-2 border-l-2 border-muted">
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="text-xs text-muted-foreground">Size</Label>
            <span className="text-xs font-mono text-muted-foreground">
              {activeLayerId === "primary"
                ? getValue(config.iconSize)
                : Math.round(activeLayer?.size ?? 0)}
              %
            </span>
          </div>
          <div onPointerDown={saveHistorySnapshot}>
            <Slider
              value={
                activeLayerId === "primary"
                  ? config.iconSize
                  : [activeLayer?.size ?? 50]
              }
              onValueChange={(v) => {
                if (activeLayerId === "primary") {
                  updateConfig({ iconSize: v as number[] });
                } else if (activeLayer) {
                  updateExtraIcon(activeLayer.id, {
                    size: Array.isArray(v) ? v[0] : v,
                  });
                }
              }}
              min={10}
              max={activeLayerId === "primary" ? 90 : 150}
              step={1}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="text-xs text-muted-foreground">
              Rotation
            </Label>
            <span className="text-xs font-mono text-muted-foreground">
              {activeLayerId === "primary"
                ? getValue(config.rotate)
                : Math.round(activeLayer?.rotate ?? 0)}
              °
            </span>
          </div>
          <div onPointerDown={saveHistorySnapshot}>
            <Slider
              value={
                activeLayerId === "primary"
                  ? config.rotate
                  : [activeLayer?.rotate ?? 0]
              }
              onValueChange={(v) => {
                if (activeLayerId === "primary") {
                  updateConfig({ rotate: v as number[] });
                } else if (activeLayer) {
                  updateExtraIcon(activeLayer.id, {
                    rotate: Array.isArray(v) ? v[0] : v,
                  });
                }
              }}
              min={0}
              max={360}
              step={1}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="text-xs text-muted-foreground">
              X Offset
            </Label>
            <span className="text-xs font-mono text-muted-foreground">
              {Math.round(
                activeLayerId === "primary"
                  ? config.iconPosition?.x ?? 0
                  : activeLayer?.position.x ?? 0
              )}
              px
            </span>
          </div>
          <div onPointerDown={saveHistorySnapshot}>
            <Slider
              value={[
                activeLayerId === "primary"
                  ? config.iconPosition?.x ?? 0
                  : activeLayer?.position.x ?? 0,
              ]}
              onValueChange={(v) => {
                const x = Array.isArray(v) ? v[0] : v;
                if (activeLayerId === "primary") {
                  updateConfig({
                    iconPosition: {
                      ...config.iconPosition,
                      x,
                      y: config.iconPosition?.y ?? 0,
                    },
                  });
                } else if (activeLayer) {
                  updateExtraIcon(activeLayer.id, {
                    position: {
                      ...activeLayer.position,
                      x,
                    },
                  });
                }
              }}
              min={-maxOffset}
              max={maxOffset}
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
              {Math.round(
                activeLayerId === "primary"
                  ? config.iconPosition?.y ?? 0
                  : activeLayer?.position.y ?? 0
              )}
              px
            </span>
          </div>
          <div onPointerDown={saveHistorySnapshot}>
            <Slider
              value={[
                activeLayerId === "primary"
                  ? config.iconPosition?.y ?? 0
                  : activeLayer?.position.y ?? 0,
              ]}
              onValueChange={(v) => {
                const y = Array.isArray(v) ? v[0] : v;
                if (activeLayerId === "primary") {
                  updateConfig({
                    iconPosition: {
                      ...config.iconPosition,
                      x: config.iconPosition?.x ?? 0,
                      y,
                    },
                  });
                } else if (activeLayer) {
                  updateExtraIcon(activeLayer.id, {
                    position: {
                      ...activeLayer.position,
                      y,
                    },
                  });
                }
              }}
              min={-maxOffset}
              max={maxOffset}
              step={1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
