import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { LogoConfig, LogoExtraIcon } from "@/lib/logo-types";
import { getValue } from "./utils";
import { Trash2, XIcon } from "lucide-react";

type FloatingQuickAdjustPanelProps = {
  layerId: string;
  anchor: { x: number; y: number };
  containerWidth: number;
  containerHeight: number;
  config: LogoConfig;
  onUpdateConfig: (partial: Partial<LogoConfig>, saveHistory?: boolean) => void;
  onClose: () => void;
};

const PANEL_WIDTH = 260;
const PANEL_HEIGHT = 200;

export function FloatingQuickAdjustPanel({
  layerId,
  anchor,
  containerWidth,
  containerHeight,
  config,
  onUpdateConfig,
  onClose,
}: FloatingQuickAdjustPanelProps) {
  const isPrimary = layerId === "primary";
  const layer = !isPrimary
    ? config.extraIcons?.find((icon) => icon.id === layerId)
    : null;

  if (!isPrimary && !layer) {
    return null;
  }

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const left = clamp(
    anchor.x - PANEL_WIDTH / 2,
    8,
    Math.max(containerWidth - PANEL_WIDTH - 8, 8)
  );
  const top = clamp(
    anchor.y + 16,
    8,
    Math.max(containerHeight - PANEL_HEIGHT - 8, 8)
  );

  const iconSize = isPrimary
    ? getValue(config.iconSize)
    : Math.round(layer?.size ?? 0);
  const xOffset = isPrimary
    ? config.iconPosition?.x ?? 0
    : layer?.position.x ?? 0;
  const yOffset = isPrimary
    ? config.iconPosition?.y ?? 0
    : layer?.position.y ?? 0;
  const maxOffset = Math.round(getValue(config.size) / 2);

  const captureHistory = () => onUpdateConfig({}, true);

  const updatePrimaryPosition = (axis: "x" | "y", value: number) => {
    onUpdateConfig({
      iconPosition: {
        x: axis === "x" ? value : config.iconPosition?.x ?? 0,
        y: axis === "y" ? value : config.iconPosition?.y ?? 0,
      },
    });
  };

  const updateExtraIcon = (partial: Partial<LogoExtraIcon>) => {
    if (!layer) return;
    const nextIcons = (config.extraIcons ?? []).map((icon) =>
      icon.id === layer.id ? { ...icon, ...partial } : icon
    );
    onUpdateConfig({ extraIcons: nextIcons });
  };

  return (
    <div
      className="pointer-events-auto absolute z-30 w-[260px] rounded-2xl border border-border bg-background/95 p-4 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-background/80"
      style={{ left, top }}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Icon Controls
          </p>
          <p className="text-sm font-medium">
            {isPrimary ? "Primary Icon" : "Layer"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {!isPrimary && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => {
                if (!layer) return;
                const nextIcons = (config.extraIcons ?? []).filter(
                  (icon) => icon.id !== layer.id
                );
                onUpdateConfig({ extraIcons: nextIcons }, true);
                onClose();
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete layer</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground"
            onClick={onClose}
          >
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close quick controls</span>
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-4 text-xs text-muted-foreground">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span>Size</span>
            <span className="font-mono text-muted-foreground">
              {iconSize}%
            </span>
          </div>
          <div onPointerDown={captureHistory}>
            <Slider
              value={[iconSize]}
              min={10}
              max={isPrimary ? 90 : 150}
              step={1}
              onValueChange={(val) => {
                const target = Array.isArray(val) ? val[0] : val;
                if (isPrimary) {
                  onUpdateConfig({ iconSize: [target] });
                } else {
                  updateExtraIcon({ size: target });
                }
              }}
            />
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span>X Offset</span>
            <span className="font-mono text-muted-foreground">
              {Math.round(xOffset)}px
            </span>
          </div>
          <div onPointerDown={captureHistory}>
            <Slider
              value={[xOffset]}
              min={-maxOffset}
              max={maxOffset}
              step={1}
              onValueChange={(val) => {
                const target = Array.isArray(val) ? val[0] : val;
                if (isPrimary) {
                  updatePrimaryPosition("x", target);
                } else {
                  updateExtraIcon({
                    position: { ...layer!.position, x: target },
                  });
                }
              }}
            />
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span>Y Offset</span>
            <span className="font-mono text-muted-foreground">
              {Math.round(yOffset)}px
            </span>
          </div>
          <div onPointerDown={captureHistory}>
            <Slider
              value={[yOffset]}
              min={-maxOffset}
              max={maxOffset}
              step={1}
              onValueChange={(val) => {
                const target = Array.isArray(val) ? val[0] : val;
                if (isPrimary) {
                  updatePrimaryPosition("y", target);
                } else {
                  updateExtraIcon({
                    position: { ...layer!.position, y: target },
                  });
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
