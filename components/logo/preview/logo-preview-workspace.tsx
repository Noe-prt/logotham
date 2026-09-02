import * as React from "react";

import { LogoConfig } from "@/lib/logo-types";

import { ExportSizeControl } from "./export-size-control";
import { FloatingQuickAdjustPanel } from "./quick-adjust-panel";
import { FloatingTextQuickAdjustPanel } from "./text-quick-adjust-panel";
import { LogoCanvas } from "./logo-canvas";
import { PaintDefinition, RenderIconLayer } from "./types";

type WorkspaceRenderValues = {
  currentSize: number;
  currentRadius: number;
  backgroundStyle: React.CSSProperties;
  borderStyle: React.CSSProperties;
  gradientBorder?: { width: number; gradient: string };
  shadowStyle?: string;
  iconStrokePaint: PaintDefinition;
  iconFillPaint: PaintDefinition;
  glyphPaint: PaintDefinition;
  showIconFill: boolean;
  iconLayers: RenderIconLayer[];
};

type LogoPreviewWorkspaceProps = {
  config: LogoConfig;
  captureRef: React.RefObject<HTMLDivElement>;
  renderValues: WorkspaceRenderValues;
  selectedExportSize: number;
  onSizeChange: (value: number) => void;
  maxExportSize?: number | null;
  isMobile: boolean;
  onUpdateConfig?: (partial: Partial<LogoConfig>, saveHistory?: boolean) => void;
  onTextMove: (id: string, x: number, y: number) => void;
  onIconMove: (x: number, y: number) => void;
  onExtraIconMove: (id: string, x: number, y: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  activeLayerId?: string;
  onLayerSelect?: (id: string) => void;
};

export function LogoPreviewWorkspace({
  config,
  captureRef,
  renderValues,
  selectedExportSize,
  onSizeChange,
  maxExportSize,
  isMobile,
  onUpdateConfig,
  onTextMove,
  onIconMove,
  onExtraIconMove,
  onDragStart,
  onDragEnd,
  activeLayerId,
  onLayerSelect,
}: LogoPreviewWorkspaceProps) {
  const {
    currentSize,
    currentRadius,
    backgroundStyle,
    borderStyle,
    gradientBorder,
    shadowStyle,
    iconStrokePaint,
    iconFillPaint,
    glyphPaint,
    showIconFill,
    iconLayers,
  } = renderValues;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(600);
  const [containerHeight, setContainerHeight] = React.useState(400);
  const [showCenterGuides, setShowCenterGuides] = React.useState(false);
  const [quickAdjust, setQuickAdjust] = React.useState<{
    layerId: string;
    anchor: { x: number; y: number };
  } | null>(null);
  const [quickTextAdjust, setQuickTextAdjust] = React.useState<{
    textId: string;
    anchor: { x: number; y: number };
  } | null>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
        setContainerHeight(entry.contentRect.height);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!quickAdjust) return;
    if (quickAdjust.layerId === "primary") {
      if (config.iconType === "none") {
        setQuickAdjust(null);
      }
      return;
    }
    const exists = config.extraIcons?.some(
      (icon) => icon.id === quickAdjust.layerId
    );
    if (!exists) {
      setQuickAdjust(null);
    }
  }, [config.extraIcons, config.iconType, quickAdjust]);

  React.useEffect(() => {
    if (!quickAdjust) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setQuickAdjust(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [quickAdjust]);

  React.useEffect(() => {
    if (!quickTextAdjust) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setQuickTextAdjust(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [quickTextAdjust]);

  React.useEffect(() => {
    if (!quickTextAdjust) return;
    const exists = config.texts?.some(
      (text) => text.id === quickTextAdjust.textId
    );
    if (!exists) {
      setQuickTextAdjust(null);
    }
  }, [config.texts, quickTextAdjust]);

  const handleLayerQuickAdjust = React.useCallback(
    (id: string, clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const anchor = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
      setQuickAdjust((prev) => {
        if (prev?.layerId === id) {
          return null;
        }
        return { layerId: id, anchor };
      });
    },
    []
  );

  const handleTextQuickAdjust = React.useCallback(
    (id: string, clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const anchor = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
      setQuickTextAdjust((prev) => {
        if (prev?.textId === id) {
          return null;
        }
        return { textId: id, anchor };
      });
    },
    []
  );

  const scale =
    containerWidth > 0
      ? Math.min((containerWidth - 96) / currentSize, 600 / currentSize)
      : 0.1;

  const handleGuideStart = React.useCallback(() => {
    setShowCenterGuides(true);
  }, []);
  const handleGuideEnd = React.useCallback(() => {
    setShowCenterGuides(false);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-2 overflow-hidden relative">
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="w-full flex flex-col items-center z-20 px-0 pt-8 shrink-0 relative">
        <ExportSizeControl
          value={selectedExportSize}
          onValueChange={onSizeChange}
          maxSize={maxExportSize ?? undefined}
        />
        <div className="w-full flex justify-center mt-4">
          <span className="inline-block px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border text-[10px] font-medium text-muted-foreground uppercase tracking-wider shadow-sm">
            Drag elements to move them
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative z-10 flex-1 transition-all duration-300 ease-in-out max-w-full md:max-h-[720px] max-h-72 flex items-center justify-center p-2"
      >
        <div
          className="inline-block origin-center"
          style={{
            transform: isMobile
              ? `scale(${Math.min(scale, 0.65)})`
              : currentSize >= 2048
              ? `scale(${220 / currentSize})`
              : currentSize >= 1024
              ? `scale(${300 / currentSize})`
              : currentSize > 400
              ? `scale(${420 / currentSize})`
              : "scale(1.1)",
          }}
        >
          <div className="relative shadow-sm border-2 border-dashed border-muted-foreground/30">
            <LogoCanvas
              ref={captureRef}
              config={config}
              currentSize={currentSize}
              currentRadius={currentRadius}
              backgroundStyle={backgroundStyle}
              borderStyle={borderStyle}
              gradientBorder={gradientBorder}
              shadowStyle={shadowStyle}
              iconStrokePaint={iconStrokePaint}
              iconFillPaint={iconFillPaint}
              glyphPaint={glyphPaint}
              showIconFill={showIconFill}
              iconLayers={iconLayers}
              onTextMove={onTextMove}
              onIconMove={onIconMove}
              onExtraIconMove={onExtraIconMove}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onGuideStart={handleGuideStart}
              onGuideEnd={handleGuideEnd}
              showCenterGuides={showCenterGuides}
              activeLayerId={activeLayerId}
              onLayerSelect={onLayerSelect}
              onLayerQuickAdjust={({ id, clientX, clientY }) =>
                handleLayerQuickAdjust(id, clientX, clientY)
              }
              onTextQuickAdjust={({ id, clientX, clientY }) =>
                handleTextQuickAdjust(id, clientX, clientY)
              }
            />
          </div>
        </div>

        {quickAdjust && onUpdateConfig ? (
          <FloatingQuickAdjustPanel
            layerId={quickAdjust.layerId}
            anchor={quickAdjust.anchor}
            containerWidth={containerWidth}
            containerHeight={containerHeight}
            config={config}
            onUpdateConfig={onUpdateConfig}
            onClose={() => setQuickAdjust(null)}
          />
        ) : null}

        {quickTextAdjust && onUpdateConfig ? (
          (() => {
            const text = config.texts?.find(
              (t) => t.id === quickTextAdjust.textId
            );
            if (!text) {
              return null;
            }
            return (
              <FloatingTextQuickAdjustPanel
                text={text}
                anchor={quickTextAdjust.anchor}
                containerWidth={containerWidth}
                containerHeight={containerHeight}
                config={config}
                onUpdateConfig={onUpdateConfig}
                onClose={() => setQuickTextAdjust(null)}
              />
            );
          })()
        ) : null}
      </div>
    </div>
  );
}
