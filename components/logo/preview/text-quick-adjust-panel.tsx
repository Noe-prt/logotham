import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { LogoConfig, LogoText } from "@/lib/logo-types";
import { getValue } from "./utils";
import { Trash2, XIcon } from "lucide-react";

type FloatingTextQuickAdjustPanelProps = {
  text: LogoText;
  anchor: { x: number; y: number };
  containerWidth: number;
  containerHeight: number;
  config: LogoConfig;
  onUpdateConfig: (partial: Partial<LogoConfig>, saveHistory?: boolean) => void;
  onClose: () => void;
};

const PANEL_WIDTH = 260;
const PANEL_HEIGHT = 230;

export function FloatingTextQuickAdjustPanel({
  text,
  anchor,
  containerWidth,
  containerHeight,
  config,
  onUpdateConfig,
  onClose,
}: FloatingTextQuickAdjustPanelProps) {
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

  const maxOffset = Math.round(getValue(config.size) / 2);
  const captureHistory = () => onUpdateConfig({}, true);

  const updateText = (partial: Partial<LogoText>) => {
    const nextTexts = config.texts?.map((t) =>
      t.id === text.id ? { ...t, ...partial } : t
    );
    onUpdateConfig({ texts: nextTexts });
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
            Text Controls
          </p>
          <p className="text-sm font-medium line-clamp-1">{text.text}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={() => {
              const nextTexts = (config.texts ?? []).filter(
                (t) => t.id !== text.id
              );
              onUpdateConfig({ texts: nextTexts }, true);
              onClose();
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete text</span>
          </Button>
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
        <div onPointerDown={captureHistory}>
          <div className="mb-1 flex items-center justify-between">
            <span>Font Size</span>
            <span className="font-mono text-muted-foreground">
              {Math.round(text.fontSize)}px
            </span>
          </div>
          <Slider
            className="h-8"
            value={[text.fontSize]}
            min={8}
            max={360}
            step={1}
            onValueChange={(val) =>
              updateText({ fontSize: Array.isArray(val) ? val[0] : val })
            }
          />
        </div>

        <div onPointerDown={captureHistory}>
          <div className="mb-1 flex items-center justify-between">
            <span>X Offset</span>
            <span className="font-mono text-muted-foreground">
              {Math.round(text.x)}px
            </span>
          </div>
          <Slider
            className="h-8"
            value={[text.x]}
            min={-maxOffset}
            max={maxOffset}
            step={1}
            onValueChange={(val) =>
              updateText({ x: Array.isArray(val) ? val[0] : val })
            }
          />
        </div>

        <div onPointerDown={captureHistory}>
          <div className="mb-1 flex items-center justify-between">
            <span>Text baseline</span>
            <span className="font-mono text-muted-foreground">
              {Math.round(text.y)}px
            </span>
          </div>
          <Slider
            className="h-8"
            value={[text.y]}
            min={-maxOffset}
            max={maxOffset}
            step={1}
            onValueChange={(val) =>
              updateText({ y: Array.isArray(val) ? val[0] : val })
            }
          />
        </div>
      </div>
    </div>
  );
}
