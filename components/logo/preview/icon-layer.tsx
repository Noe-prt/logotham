import feather from "feather-icons";
import * as React from "react";
import { Spinner } from "@/components/ui/spinner";
import { useIconComponent } from "@/hooks/use-icon-component";
import { useLayerDrag } from "@/hooks/use-layer-drag";
import {
  getCssPaintStyles,
  getPaintColor,
  renderGradientDefs,
  getGradientDefsString,
} from "./render-utils";
import { PaintDefinition, RenderIconLayer } from "./types";
import { sanitizeGradientId } from "./utils";

interface IconLayerRendererProps {
  layer: RenderIconLayer;
  iconStrokePaint: PaintDefinition;
  iconFillPaint: PaintDefinition;
  glyphPaint: PaintDefinition;
  showIconFill: boolean;
  onMove?: (x: number, y: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onGuideStart?: () => void;
  onGuideEnd?: () => void;
  onLayerSelect?: (id: string) => void;
  onLayerTap?: (id: string, clientX: number, clientY: number) => void;
  hoveredLayerKey?: string | null;
}

interface ProcessCustomSvgOptions {
  strokeValue: string;
  fillValue: string;
  strokeWidth: number;
  showIconFill: boolean;
  defsString: string;
  preserveOriginalAppearance?: boolean;
  className?: string;
}

const processCustomSvg = (
  html: string,
  {
    strokeValue,
    fillValue,
    strokeWidth,
    showIconFill,
    defsString,
    preserveOriginalAppearance = false,
    className,
  }: ProcessCustomSvgOptions
) => {
  if (typeof window === "undefined") return html;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg) return html;

    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    if (preserveOriginalAppearance) {
      return new XMLSerializer().serializeToString(svg);
    }

    svg.removeAttribute("id");
    svg.removeAttribute("class");
    svg.removeAttribute("style");

    if (className) {
      svg.setAttribute("class", className);
    }

    svg.style.stroke = strokeValue;
    svg.style.strokeWidth = `${strokeWidth}px`;
    svg.style.fill = showIconFill ? fillValue : "none";

    const elements = svg.querySelectorAll("*");
    elements.forEach((el) => {
      el.removeAttribute("style");

      const currentFill = el.getAttribute("fill");
      if (
        currentFill &&
        currentFill !== "none" &&
        currentFill !== "transparent"
      ) {
        el.setAttribute("fill", showIconFill ? fillValue : "none");
      } else if (!currentFill) {
        el.setAttribute("fill", showIconFill ? fillValue : "none");
      }

      const currentStroke = el.getAttribute("stroke");
      if (
        currentStroke &&
        currentStroke !== "none" &&
        currentStroke !== "transparent"
      ) {
        el.setAttribute("stroke", strokeValue);
      } else if (!currentStroke) {
        el.setAttribute("stroke", strokeValue);
      }

      if (el.hasAttribute("stroke-width")) {
        el.setAttribute("stroke-width", `${strokeWidth}`);
      }
    });

    if (!showIconFill && svg.hasAttribute("fill")) {
      svg.removeAttribute("fill");
    }

    if (defsString) {
      svg.innerHTML = defsString + svg.innerHTML;
    }

    return new XMLSerializer().serializeToString(svg);
  } catch (e) {
    console.error("Failed to process SVG", e);
    return html;
  }
};

export const IconLayerRenderer: React.FC<IconLayerRendererProps> = ({
  layer,
  iconStrokePaint,
  iconFillPaint,
  glyphPaint,
  showIconFill,
  onMove,
  onDragStart,
  onDragEnd,
  onGuideStart,
  onGuideEnd,
  onLayerSelect,
  onLayerTap,
  hoveredLayerKey,
}) => {
  const strokeReactId = React.useId();
  const fillReactId = React.useId();
  const strokeGradientId = React.useMemo(
    () => sanitizeGradientId(`${layer.id}-${strokeReactId}`, "stroke"),
    [layer.id, strokeReactId]
  );
  const fillGradientId = React.useMemo(
    () => sanitizeGradientId(`${layer.id}-${fillReactId}`, "fill"),
    [layer.id, fillReactId]
  );
  const iconStrokeColor = getPaintColor(iconStrokePaint);
  const iconFillColor = getPaintColor(iconFillPaint);

  const iconStrokeValue =
    iconStrokePaint.type === "gradient"
      ? `url(#${strokeGradientId})`
      : iconStrokePaint.color;
  const iconFillValue =
    iconFillPaint.type === "gradient"
      ? `url(#${fillGradientId})`
      : iconFillPaint.color;
  const iconDimension = layer.dimension;
  const canMove = Boolean(onMove);
  const glyphColorValue =
    glyphPaint.type === "gradient" ? glyphPaint.startColor : glyphPaint.color;
  const spinnerClassName = canMove
    ? "icon-layer-svg h-full w-full"
    : "h-full w-full";

  const defsString = React.useMemo(() => {
    return (
      getGradientDefsString(strokeGradientId, iconStrokePaint) +
      getGradientDefsString(fillGradientId, iconFillPaint)
    );
  }, [strokeGradientId, fillGradientId, iconStrokePaint, iconFillPaint]);

  const isNoneLayer = layer.iconType === "none";
  const editingLayerId = layer.isPrimary ? "primary" : layer.id;
  const isHovered = hoveredLayerKey === editingLayerId;
  const IconComponent = useIconComponent(layer.iconType, layer.iconName);

  const fillIconNode = React.useMemo(() => {
    if (!IconComponent || !showIconFill) return null;
    return React.createElement(
      IconComponent,
      {
        size: iconDimension,
        className: canMove ? "icon-layer-svg" : "",
        stroke: "none",
        fill:
          iconFillPaint.type === "gradient"
            ? `url(#${fillGradientId})`
            : iconFillPaint.color,
        strokeWidth: 0,
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          color: "transparent",
        },
      },
      renderGradientDefs(fillGradientId, iconFillPaint)
    );
  }, [
    IconComponent,
    canMove,
    iconDimension,
    iconFillPaint,
    fillGradientId,
    showIconFill,
  ]);

  const strokeIconNode = React.useMemo(() => {
    if (!IconComponent) return null;
    return React.createElement(
      IconComponent,
      {
        size: iconDimension,
        className: canMove ? "icon-layer-svg" : "",
        stroke:
          iconStrokePaint.type === "gradient"
            ? `url(#${strokeGradientId})`
            : iconStrokePaint.color,
        fill: "none",
        strokeWidth: layer.strokeWidth,
        style: {
          position: "relative",
          width: "100%",
          height: "100%",
          color: iconStrokeColor,
        },
      },
      renderGradientDefs(strokeGradientId, iconStrokePaint)
    );
  }, [
    IconComponent,
    canMove,
    iconDimension,
    iconStrokePaint,
    strokeGradientId,
    layer.strokeWidth,
    iconStrokeColor,
  ]);

  const handlePointerDown = useLayerDrag({
    enabled: canMove,
    getInitialPosition: () => layer.position,
    onMove: (x, y) => onMove?.(x, y),
    onDragStart,
    onDragEnd,
    onGuideStart,
    onGuideEnd,
    onTap: (event) => {
      onLayerTap?.(editingLayerId, event.clientX, event.clientY);
    },
  });

  const handlePointerDownWithSelect = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!canMove) return;
      onLayerSelect?.(editingLayerId);
      handlePointerDown(event);
    },
    [canMove, editingLayerId, handlePointerDown, onLayerSelect]
  );

  if (isNoneLayer) {
    return null;
  }

  const iconContent =
    layer.iconType === "lucide" ||
    layer.iconType === "tabler" ||
    layer.iconType === "hugeicons" ||
    layer.iconType === "iconoir" ||
    layer.iconType === "heroicons" ||
    layer.iconType === "fontawesome" ? (
      IconComponent ? (
        <div
          style={{
            position: "relative",
            width: iconDimension,
            height: iconDimension,
            transform: `rotate(${layer.rotate}deg)`,
            pointerEvents: "none",
          }}
        >
          {showIconFill && fillIconNode}
          {strokeIconNode}
        </div>
      ) : (
        <div
          style={{
            width: `${iconDimension}px`,
            height: `${iconDimension}px`,
            transform: `rotate(${layer.rotate}deg)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <Spinner
            className={spinnerClassName}
            style={{
              color: glyphColorValue,
              width: iconDimension,
              height: iconDimension,
            }}
          />
        </div>
      )
    ) : layer.iconType === "feather" ? (
      <div
        style={{
          width: `${iconDimension}px`,
          height: `${iconDimension}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `rotate(${layer.rotate}deg)`,
          color: iconStrokeColor,
          pointerEvents: "none",
        }}
        dangerouslySetInnerHTML={{
          __html:
            feather.icons[layer.iconName as keyof typeof feather.icons]?.toSvg({
              width: iconDimension,
              height: iconDimension,
              "stroke-width": layer.strokeWidth,
              color: iconStrokeColor,
              fill: showIconFill ? iconFillColor : "none",
              class: canMove ? "icon-layer-svg" : "",
            }) || "",
        }}
      />
    ) : layer.iconType === "custom" && layer.customIcon ? (
      <div
        style={{
          width: `${iconDimension}px`,
          height: `${iconDimension}px`,
          transform: `rotate(${layer.rotate}deg)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
        dangerouslySetInnerHTML={{
          __html: processCustomSvg(layer.customIcon, {
            strokeValue: iconStrokeValue,
            fillValue: iconFillValue,
            strokeWidth: layer.strokeWidth,
            showIconFill,
            defsString,
            preserveOriginalAppearance:
              layer.preserveCustomIconAppearance ?? false,
            className: canMove ? "icon-layer-svg" : undefined,
          }),
        }}
      />
    ) : layer.iconType === "boxicons" ? (
      <i
        data-webfont-icon="true"
        className={`bx ${layer.iconName} flex items-center justify-center`}
        style={{
          fontSize: `${iconDimension}px`,
          transform: `rotate(${layer.rotate}deg)`,
          width: `${iconDimension}px`,
          height: `${iconDimension}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...getCssPaintStyles(glyphPaint),
          pointerEvents: canMove ? "auto" : "none",
        }}
      />
    ) : layer.iconType === "lineicons" ? (
      <i
        data-webfont-icon="true"
        className={`lni ${layer.iconName} leading-none flex items-center justify-center`}
        style={{
          fontSize: `${iconDimension}px`,
          transform: `rotate(${layer.rotate}deg)`,
          width: `${iconDimension}px`,
          height: `${iconDimension}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...getCssPaintStyles(glyphPaint),
          pointerEvents: canMove ? "auto" : "none",
        }}
      />
    ) : (
      <i
        data-webfont-icon="true"
        className={`fi fi-rr-${layer.iconName} leading-none flex items-center justify-center`}
        style={{
          fontSize: `${iconDimension}px`,
          transform: `rotate(${layer.rotate}deg)`,
          width: `${iconDimension}px`,
          height: `${iconDimension}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...getCssPaintStyles(glyphPaint),
          pointerEvents: canMove ? "auto" : "none",
        }}
      />
    );

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: `${iconDimension}px`,
        height: `${iconDimension}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `translate(${layer.position.x}px, ${layer.position.y}px) translate(-50%, -50%)`,
        cursor: canMove ? "move" : "default",
        pointerEvents: canMove ? "none" : "none",
        touchAction: canMove ? "none" : "auto",
      }}
      onPointerDown={canMove ? handlePointerDownWithSelect : undefined}
      data-layer-id={layer.id}
      data-layer-key={editingLayerId}
    >
      {isHovered && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "1px solid rgba(255, 255, 255, 0.8)",
            pointerEvents: "none",
            mixBlendMode: "difference",
            borderRadius: 2,
            zIndex: 1,
          }}
          aria-hidden="true"
        />
      )}
      {iconContent}
    </div>
  );
};
