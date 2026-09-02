import { hexToRgba, buildLinearGradientCss } from "@/lib/color-utils";
import type { LogoConfig } from "@/lib/logo-types";
import * as React from "react";
import { PaintDefinition, RenderIconLayer } from "./types";
import { getValue } from "./utils";
import { ICON_GRADIENT_VIEWBOX_SIZE } from "./constants";

export const createPaintDefinition = (
  mode: "solid" | "gradient" | undefined,
  solidColor: string,
  gradientStart: string | undefined,
  gradientEnd: string | undefined,
  angleValue: number[] | undefined,
  opacity: number
): PaintDefinition => {
  if (mode === "gradient") {
    return {
      type: "gradient",
      startColor: hexToRgba(gradientStart ?? solidColor, opacity),
      endColor: hexToRgba(gradientEnd ?? solidColor, opacity),
      angle: getValue(angleValue ?? [90]),
    };
  }
  return {
    type: "solid",
    color: hexToRgba(solidColor, opacity),
  };
};

export const getCssPaintStyles = (paint: PaintDefinition) =>
  paint.type === "gradient"
    ? {
        color: "transparent",
        backgroundImage: buildLinearGradientCss(
          paint.startColor,
          paint.endColor,
          paint.angle
        ),
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
      }
    : { color: paint.color };

export const getPaintColor = (paint: PaintDefinition) =>
  paint.type === "gradient" ? paint.startColor : paint.color;

export const renderGradientDefs = (
  id: string,
  paint: PaintDefinition,
  options?: { viewBoxSize?: number }
) => {
  if (paint.type !== "gradient") return null;
  const viewBoxSize = options?.viewBoxSize ?? ICON_GRADIENT_VIEWBOX_SIZE;
  const center = viewBoxSize / 2;

  return (
    <defs>
      <linearGradient
        id={id}
        gradientUnits="userSpaceOnUse"
        x1={center}
        y1={0}
        x2={center}
        y2={viewBoxSize}
        gradientTransform={`rotate(${paint.angle} ${center} ${center})`}
      >
        <stop offset="0%" stopColor={paint.startColor} />
        <stop offset="100%" stopColor={paint.endColor} />
      </linearGradient>
    </defs>
  );
};

export const getGradientDefsString = (id: string, paint: PaintDefinition) => {
  if (paint.type !== "gradient") return "";
  return `
    <defs>
      <linearGradient
        id="${id}"
        gradientUnits="objectBoundingBox"
        x1="0.5"
        y1="0"
        x2="0.5"
        y2="1"
        gradientTransform="rotate(${paint.angle} 0.5 0.5)"
      >
        <stop offset="0%" stop-color="${paint.startColor}" />
        <stop offset="100%" stop-color="${paint.endColor}" />
      </linearGradient>
    </defs>
  `;
};

export const buildRenderValues = (cfg: LogoConfig) => {
  const currentSize = getValue(cfg.size);
  const currentIconSize = getValue(cfg.iconSize);
  const currentRadius = getValue(cfg.radius);
  const currentStrokeWidth = getValue(cfg.strokeWidth);
  const currentRotate = getValue(cfg.rotate);
  const currentBorderWidth = getValue(cfg.borderWidth);
  const currentGradientAngle = getValue(cfg.gradientAngle);
  const currentShadowBlur = getValue(cfg.shadowBlur);
  const currentShadowOpacity = getValue(cfg.shadowOpacity);
  const currentShadowX = getValue(cfg.shadowX);
  const currentShadowY = getValue(cfg.shadowY);
  const currentIconPosition = cfg.iconPosition || { x: 0, y: 0 };
  const iconOpacity = Math.min(
    Math.max(getValue(cfg.iconOpacity ?? [100]) / 100, 0),
    1
  );
  const iconFillOpacity = Math.min(
    Math.max(getValue(cfg.iconFillOpacity ?? [0]) / 100, 0),
    1
  );
  const bgOpacity = Math.min(
    Math.max(getValue(cfg.bgOpacity ?? [100]) / 100, 0),
    1
  );

  const backgroundStyle =
    cfg.bgMode === "solid"
      ? { backgroundColor: hexToRgba(cfg.bgColor, bgOpacity) }
      : {
          backgroundImage: `linear-gradient(${currentGradientAngle}deg, ${hexToRgba(
            cfg.gradientStart,
            bgOpacity
          )}, ${hexToRgba(cfg.gradientEnd, bgOpacity)})`,
        };

  const gradientBorder =
    currentBorderWidth > 0 && cfg.borderColorMode === "gradient"
      ? {
          width: currentBorderWidth,
          gradient: buildLinearGradientCss(
            cfg.borderGradientStart ?? cfg.borderColor,
            cfg.borderGradientEnd ?? cfg.borderColor,
            getValue(cfg.borderGradientAngle ?? [90])
          ),
        }
      : undefined;

  const borderStyle =
    currentBorderWidth > 0 && !gradientBorder
      ? { border: `${currentBorderWidth}px solid ${cfg.borderColor}` }
      : {};

  const shadowStyle = cfg.shadowEnabled
    ? `${currentShadowX}px ${currentShadowY}px ${currentShadowBlur}px ${
        cfg.shadowColor
      }${Math.round(currentShadowOpacity * 255)
        .toString(16)
        .padStart(2, "0")}`
    : undefined;

  const iconStrokePaint = createPaintDefinition(
    cfg.iconColorMode ?? "solid",
    cfg.iconColor,
    cfg.iconColorGradientStart,
    cfg.iconColorGradientEnd,
    cfg.iconColorGradientAngle,
    iconOpacity
  );
  const iconFillPaint = createPaintDefinition(
    cfg.iconFillColorMode ?? "solid",
    cfg.iconFillColor,
    cfg.iconFillGradientStart,
    cfg.iconFillGradientEnd,
    cfg.iconFillGradientAngle,
    iconFillOpacity
  );
  const showIconFill = iconFillOpacity > 0;
  const glyphPaint = showIconFill ? iconFillPaint : iconStrokePaint;

  const baseLayer: RenderIconLayer = {
    id: "primary-icon",
    iconType: cfg.iconType,
    iconName: cfg.iconName,
    customIcon: cfg.customIcon,
    preserveCustomIconAppearance: cfg.customIconPreserveStyles ?? false,
    dimension: currentSize * (currentIconSize / 100),
    position: currentIconPosition,
    rotate: currentRotate,
    strokeWidth: currentStrokeWidth,
    isPrimary: true,
  };

  const extraLayers: RenderIconLayer[] = (cfg.extraIcons ?? []).map((layer) => {
    const layerStrokeWidth = layer.strokeWidth
      ? getValue(layer.strokeWidth)
      : currentStrokeWidth;

    const layerIconOpacity = layer.iconOpacity
      ? Math.min(Math.max(getValue(layer.iconOpacity) / 100, 0), 1)
      : iconOpacity;

    const layerIconFillOpacity = layer.iconFillOpacity
      ? Math.min(Math.max(getValue(layer.iconFillOpacity) / 100, 0), 1)
      : iconFillOpacity;

    const layerIconStrokePaint = createPaintDefinition(
      layer.iconColorMode ?? cfg.iconColorMode ?? "solid",
      layer.iconColor ?? cfg.iconColor,
      layer.iconColorGradientStart ?? cfg.iconColorGradientStart,
      layer.iconColorGradientEnd ?? cfg.iconColorGradientEnd,
      layer.iconColorGradientAngle ?? cfg.iconColorGradientAngle,
      layerIconOpacity
    );

    const layerIconFillPaint = createPaintDefinition(
      layer.iconFillColorMode ?? cfg.iconFillColorMode ?? "solid",
      layer.iconFillColor ?? cfg.iconFillColor,
      layer.iconFillGradientStart ?? cfg.iconFillGradientStart,
      layer.iconFillGradientEnd ?? cfg.iconFillGradientEnd,
      layer.iconFillGradientAngle ?? cfg.iconFillGradientAngle,
      layerIconFillOpacity
    );

    return {
      id: layer.id,
      iconType: layer.iconType,
      iconName: layer.iconName,
      customIcon: layer.customIcon,
      preserveCustomIconAppearance: layer.customIconPreserveStyles ?? false,
      dimension: currentSize * ((layer.size ?? currentIconSize) / 100),
      position: layer.position ?? { x: 0, y: 0 },
      rotate: layer.rotate ?? 0,
      strokeWidth: layerStrokeWidth,
      isPrimary: false,
      iconStrokePaint: layerIconStrokePaint,
      iconFillPaint: layerIconFillPaint,
      glyphPaint:
        layerIconFillOpacity > 0 ? layerIconFillPaint : layerIconStrokePaint,
      showIconFill: layerIconFillOpacity > 0,
    };
  });

  const extraLayerMap = new Map(extraLayers.map((layer) => [layer.id, layer]));
  const defaultOrder = ["primary", ...extraLayers.map((layer) => layer.id)];

  const configuredOrder = Array.isArray(cfg.layerOrder)
    ? cfg.layerOrder.filter(
        (key) => key === "primary" || extraLayerMap.has(key)
      )
    : [];

  const mergedOrder = configuredOrder.length > 0 ? [...configuredOrder] : [];
  for (const key of defaultOrder) {
    if (!mergedOrder.includes(key)) {
      mergedOrder.push(key);
    }
  }

  let resolvedOrder = mergedOrder.length > 0 ? mergedOrder : defaultOrder;
  if (cfg.invertLayerOrder) {
    resolvedOrder = [...resolvedOrder].reverse();
  }

  const orderedLayers = resolvedOrder
    .map((key) => (key === "primary" ? baseLayer : extraLayerMap.get(key)))
    .filter((layer): layer is RenderIconLayer => Boolean(layer));

  const iconLayers = orderedLayers.slice().reverse();

  return {
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
  };
};
