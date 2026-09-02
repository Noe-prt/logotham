import type { LogoConfig } from "@/lib/logo-types";
import { clamp, cloneConfig, getValue, scaleConfigForExport } from "./utils";

export const createFaviconConfig = (
  baseConfig: LogoConfig,
  targetSize = 256
): LogoConfig => {
  const scaled = scaleConfigForExport(baseConfig, targetSize);
  const next = cloneConfig(scaled);
  const contentScale = 1.15;
  const scalePercent = (value: number) =>
    clamp(Math.round(value * contentScale), 10, 100);

  next.iconSize = [scalePercent(getValue(next.iconSize))];
  next.padding = [Math.min(getValue(next.padding), 4)];

  if (next.iconPosition) {
    next.iconPosition = {
      x: next.iconPosition.x * contentScale,
      y: next.iconPosition.y * contentScale,
    };
  }

  if (next.extraIcons?.length) {
    next.extraIcons = next.extraIcons.map((icon) => ({
      ...icon,
      size: scalePercent(icon.size ?? getValue(next.iconSize)),
      position: {
        x: (icon.position?.x ?? 0) * contentScale,
        y: (icon.position?.y ?? 0) * contentScale,
      },
    }));
  }

  if (next.texts?.length) {
    next.texts = next.texts.map((text) => ({
      ...text,
      x: text.x * contentScale,
      y: text.y * contentScale,
      fontSize: text.fontSize * contentScale,
    }));
  }

  return next;
};
