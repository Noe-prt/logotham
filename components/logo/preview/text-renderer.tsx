import { buildLinearGradientCss } from "@/lib/color-utils";
import { LogoText } from "@/lib/logo-types";
import * as React from "react";
import { useLayerDrag } from "@/hooks/use-layer-drag";

interface TextRendererProps {
  text: LogoText;
  onMove?: (id: string, x: number, y: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onGuideStart?: () => void;
  onGuideEnd?: () => void;
  onQuickAdjust?: (options: {
    id: string;
    clientX: number;
    clientY: number;
    text: LogoText;
  }) => void;
}

export function TextRenderer({
  text,
  onMove,
  onDragStart,
  onDragEnd,
  onGuideStart,
  onGuideEnd,
  onQuickAdjust,
}: TextRendererProps) {
  const isGradient = (text.colorMode ?? "solid") === "gradient";
  const gradientStart = text.gradientStart ?? text.color;
  const gradientEnd = text.gradientEnd ?? text.color;
  const gradientAngle = text.gradientAngle ?? 90;

  const canMove = Boolean(onMove);
  const [isHovered, setIsHovered] = React.useState(false);

  const handlePointerDown = useLayerDrag({
    enabled: canMove,
    getInitialPosition: () => ({ x: text.x, y: text.y }),
    onMove: (x, y) => onMove?.(text.id, x, y),
    onDragStart,
    onDragEnd,
    onGuideStart,
    onGuideEnd,
    onTap: (event) =>
      onQuickAdjust?.({
        id: text.id,
        clientX: event.clientX,
        clientY: event.clientY,
        text,
      }),
  });

  const minHitSize = Math.max(Math.min(text.fontSize, 32), 16);

  const commonStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: `translate(${text.x}px, ${text.y}px) translate(-50%, -50%)`,
    fontSize: `${text.fontSize}px`,
    fontWeight: text.fontWeight,
    fontFamily: `"${text.fontFamily}", sans-serif`,
    letterSpacing: `${text.letterSpacing ?? 0}px`,
    lineHeight: text.lineHeight ?? 1,
    whiteSpace: "pre",
    cursor: canMove ? "move" : "default",
    zIndex: 20,
    userSelect: "none",
    touchAction: canMove ? "none" : "auto",
    display: "inline-block",
    minWidth: minHitSize,
    minHeight: minHitSize,
  };

  const outlineColor = text.textOutlineColor ?? "#000000";
  const outlineWidth = text.textOutlineWidth ?? 0;

  if (text.curved) {
    const radius = text.curveRadius ?? 200;
    const inverted = text.curveInverted ?? false;

    const viewBoxSize = (radius + text.fontSize * 2) * 2;
    const viewBoxOrigin = -(radius + text.fontSize * 2);

    const pathId = `curve-path-${text.id}`;
    const gradientId = `text-gradient-${text.id}`;

    const angleRad = ((gradientAngle - 90) * Math.PI) / 180;
    const x1 = 50 - 50 * Math.cos(angleRad);
    const y1 = 50 - 50 * Math.sin(angleRad);
    const x2 = 50 + 50 * Math.cos(angleRad);
    const y2 = 50 + 50 * Math.sin(angleRad);

    const sweepFlag = inverted ? 0 : 1;
    const yOffset = inverted ? -radius : radius;

    return (
      <div
        style={{ ...commonStyle, pointerEvents: canMove ? "auto" : "none" }}
        onPointerDown={handlePointerDown}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        data-text-id={text.id}
      >
        {isHovered && (
          <div
            style={{
              position: "absolute",
              inset: -4,
              border: "1px solid rgba(255, 255, 255, 0.8)",
              pointerEvents: "none",
              mixBlendMode: "difference",
              borderRadius: 2,
              zIndex: 1,
            }}
            aria-hidden="true"
          />
        )}
        <svg
          width={viewBoxSize}
          height={viewBoxSize}
          viewBox={`${viewBoxOrigin} ${viewBoxOrigin} ${viewBoxSize} ${viewBoxSize}`}
          style={{ overflow: "visible", pointerEvents: "auto" }}
        >
          <defs>
            <path
              id={pathId}
              d={`M -${radius},${yOffset} a ${radius},${radius} 0 0,${sweepFlag} ${
                radius * 2
              },0`}
            />
            {isGradient && (
              <linearGradient
                id={gradientId}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
              >
                <stop offset="0%" stopColor={gradientStart} />
                <stop offset="100%" stopColor={gradientEnd} />
              </linearGradient>
            )}
          </defs>
          {outlineWidth > 0 && (
            <text
              fontSize={text.fontSize}
              fontWeight={text.fontWeight}
              fontFamily={text.fontFamily}
              letterSpacing={text.letterSpacing}
              fill={outlineColor}
              stroke={outlineColor}
              strokeWidth={outlineWidth * 2}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ whiteSpace: "pre", pointerEvents: "auto" }}
            >
              <textPath href={`#${pathId}`} startOffset="50%">
                {text.text}
              </textPath>
            </text>
          )}
          <text
            fontSize={text.fontSize}
            fontWeight={text.fontWeight}
            fontFamily={text.fontFamily}
            letterSpacing={text.letterSpacing}
            fill={isGradient ? `url(#${gradientId})` : text.color}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ whiteSpace: "pre", pointerEvents: "auto" }}
          >
            <textPath href={`#${pathId}`} startOffset="50%">
              {text.text}
            </textPath>
          </text>
        </svg>
      </div>
    );
  }

  const textColorStyles = isGradient
    ? {
        color: "transparent",
        backgroundImage: buildLinearGradientCss(
          gradientStart,
          gradientEnd,
          gradientAngle
        ),
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
      }
    : { color: text.color };

  const baseTextStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: `${text.fontSize}px`,
    fontWeight: text.fontWeight,
    fontFamily: `"${text.fontFamily}", sans-serif`,
    letterSpacing: `${text.letterSpacing ?? 0}px`,
    lineHeight: text.lineHeight ?? 1,
    whiteSpace: "pre",
    pointerEvents: "auto",
  };

  return (
    <div
      style={{
        ...commonStyle,
        pointerEvents: canMove ? "auto" : "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      data-text-id={text.id}
    >
      {isHovered && (
        <div
          style={{
            position: "absolute",
            inset: -4,
            border: "1px solid rgba(255, 255, 255, 0.8)",
            pointerEvents: "none",
            mixBlendMode: "difference",
            borderRadius: 2,
            zIndex: 1,
          }}
          aria-hidden="true"
        />
      )}
      
      {outlineWidth > 0 && (
        <div
          style={{
            ...baseTextStyle,
            WebkitTextStroke: `${outlineWidth * 2}px ${outlineColor}`,
            color: outlineColor,
          }}
        >
          {text.text}
        </div>
      )}
      
      <div
        style={{
          ...baseTextStyle,
          ...textColorStyles,
          position: outlineWidth > 0 ? "relative" : "absolute",
        }}
      >
        {text.text}
      </div>
    </div>
  );
}
