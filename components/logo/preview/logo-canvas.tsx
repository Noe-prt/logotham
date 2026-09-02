import { LogoConfig } from "@/lib/logo-types";
import * as React from "react";
import { IconLayerRenderer } from "./icon-layer";
import { TextRenderer } from "./text-renderer";
import { PaintDefinition, RenderIconLayer } from "./types";
import { getValue } from "./utils";

interface LogoCanvasProps {
  config: LogoConfig;
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
  onTextMove?: (id: string, x: number, y: number) => void;
  onIconMove?: (x: number, y: number) => void;
  onExtraIconMove?: (id: string, x: number, y: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onGuideStart?: () => void;
  onGuideEnd?: () => void;
  showCenterGuides?: boolean;
  eventRef?: React.Ref<HTMLDivElement>;
  activeLayerId?: string;
  onLayerSelect?: (id: string) => void;
  onLayerQuickAdjust?: (options: {
    id: string;
    clientX: number;
    clientY: number;
    layer: RenderIconLayer;
  }) => void;
  onTextQuickAdjust?: (options: {
    id: string;
    clientX: number;
    clientY: number;
    text: LogoConfig["texts"] extends (infer T)[] ? T : never;
  }) => void;
}

export const LogoCanvas = React.forwardRef<HTMLDivElement, LogoCanvasProps>(
  (
    {
      config,
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
      onTextMove,
      onIconMove,
      onExtraIconMove,
      onDragStart,
      onDragEnd,
      onGuideStart,
      onGuideEnd,
      showCenterGuides,
      eventRef,
      activeLayerId,
      onLayerSelect,
      onLayerQuickAdjust,
      onTextQuickAdjust,
    },
    ref
  ) => {
    const [hoveredLayerKey, setHoveredLayerKey] = React.useState<
      string | null
    >(null);

    const getLayerElementFromPoint = React.useCallback(
      (clientX: number, clientY: number) => {
        if (typeof document === "undefined") return null;

        const hitElements = document.elementsFromPoint(clientX, clientY);

        for (const element of hitElements) {
          const layerElement = element.closest?.("[data-layer-key]");
          if (!layerElement) continue;

          const pointerEvents = window.getComputedStyle(element).pointerEvents;
          if (pointerEvents === "none") continue;

          return layerElement as HTMLElement;
        }

        return null;
      },
      []
    );

    const handlePointerDownCapture = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        const target = event.target as Element | null;
        if (target?.closest?.("[data-text-id]")) {
          return;
        }

        if (!onLayerSelect || iconLayers.length === 0) {
          return;
        }

        const layerElement =
          target?.closest?.("[data-layer-key]") ??
          getLayerElementFromPoint(event.clientX, event.clientY);

        const nextLayerKey = layerElement?.getAttribute("data-layer-key");

        if (nextLayerKey && nextLayerKey !== activeLayerId) {
          onLayerSelect(nextLayerKey);
        }
      },
      [activeLayerId, getLayerElementFromPoint, iconLayers, onLayerSelect]
    );
    const currentPadding = getValue(config.padding);

    const handlePointerMove = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        const layerElement = getLayerElementFromPoint(
          event.clientX,
          event.clientY
        );
        setHoveredLayerKey(layerElement?.getAttribute("data-layer-key") ?? null);
      },
      [getLayerElementFromPoint]
    );

    const innerContent = (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: gradientBorder
            ? Math.max(currentRadius - gradientBorder.width, 0)
            : currentRadius,
          ...backgroundStyle,
          ...(gradientBorder ? {} : borderStyle),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          isolation: "isolate",
          position: "relative",
        }}
      >
        {showCenterGuides && (
          <div className="absolute inset-0 pointer-events-none z-20">
            <div className="absolute left-4 right-4 top-1/2 h-px bg-white/60 mix-blend-difference" />
            <div className="absolute top-4 bottom-4 left-1/2 w-px bg-white/60 mix-blend-difference" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rounded-full bg-white mix-blend-difference" />
          </div>
        )}

        {config.texts?.map((text) => (
          <TextRenderer
            key={text.id}
            text={text}
            onMove={onTextMove}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onGuideStart={onGuideStart}
            onGuideEnd={onGuideEnd}
            onQuickAdjust={onTextQuickAdjust}
          />
        ))}

        <div className="relative flex h-full w-full items-center justify-center">
          {iconLayers.map((layer) => (
            <IconLayerRenderer
              key={layer.id}
              layer={layer}
              iconStrokePaint={layer.iconStrokePaint ?? iconStrokePaint}
              iconFillPaint={layer.iconFillPaint ?? iconFillPaint}
              glyphPaint={layer.glyphPaint ?? glyphPaint}
              showIconFill={layer.showIconFill ?? showIconFill}
              hoveredLayerKey={hoveredLayerKey}
              onMove={
                layer.isPrimary
                  ? onIconMove
                  : onExtraIconMove
                  ? (x, y) => onExtraIconMove(layer.id, x, y)
                  : undefined
              }
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onGuideStart={onGuideStart}
              onGuideEnd={onGuideEnd}
              onLayerSelect={onLayerSelect}
              onLayerTap={(id, clientX, clientY) =>
                onLayerQuickAdjust?.({ id, clientX, clientY, layer })
              }
            />
          ))}
        </div>
      </div>
    );

    const contentWrapper = (
      <div
        ref={eventRef}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
        }}
        onPointerDownCapture={handlePointerDownCapture}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoveredLayerKey(null)}
      >
        {innerContent}
      </div>
    );

    const baseWrapperStyle: React.CSSProperties = {
      width: currentSize,
      height: currentSize,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      isolation: "isolate",
      backgroundColor: "transparent",
      padding: currentPadding,
    };

    const shadowWrapperStyle: React.CSSProperties = {
      width: "100%",
      height: "100%",
      borderRadius: currentRadius,
      boxShadow: shadowStyle,
      display: "flex",
    };

    if (gradientBorder) {
      return (
        <div ref={ref} data-capture-element="true" style={baseWrapperStyle}>
          <div style={shadowWrapperStyle}>
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: currentRadius,
                padding: gradientBorder.width,
                backgroundImage: gradientBorder.gradient,
                display: "flex",
              }}
            >
              {contentWrapper}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} data-capture-element="true" style={baseWrapperStyle}>
        <div style={shadowWrapperStyle}>{contentWrapper}</div>
      </div>
    );
  }
);

LogoCanvas.displayName = "LogoCanvas";
