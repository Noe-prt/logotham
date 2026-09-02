type SvgAppearance = {
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
  fillIsNone: boolean;
  strokeIsNone: boolean;
};

const expandShortHex = (value: string) =>
  value.length === 4
    ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
    : value;

let colorContext: CanvasRenderingContext2D | null = null;

const getColorContext = () => {
  if (typeof document === "undefined") return null;
  if (!colorContext) {
    const canvas = document.createElement("canvas");
    colorContext = canvas.getContext("2d");
  }
  return colorContext;
};

const rgbToHex = (value: string) => {
  const match = value.match(
    /rgba?\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)/i
  );
  if (!match) return null;
  const toHex = (component: string) => {
    const num = Math.max(0, Math.min(255, Math.round(parseFloat(component))));
    return num.toString(16).padStart(2, "0");
  };
  return `#${toHex(match[1])}${toHex(match[2])}${toHex(match[3])}`;
};

const normalizeColorValue = (value?: string | null) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("#")) {
    return expandShortHex(trimmed.toLowerCase());
  }
  const ctx = getColorContext();
  if (!ctx) return trimmed;
  try {
    ctx.fillStyle = trimmed;
    const computed = ctx.fillStyle as string;
    if (computed.startsWith("#")) {
      return expandShortHex(computed.toLowerCase());
    }
    const hex = rgbToHex(computed);
    return hex ?? trimmed;
  } catch {
    return null;
  }
};

const isMeaningfulColorValue = (value?: string | null) => {
  if (!value) return false;
  const normalized = value.trim();
  if (!normalized) return false;
  const lower = normalized.toLowerCase();
  if (
    lower === "none" ||
    lower === "transparent" ||
    lower === "currentcolor" ||
    lower.startsWith("url(") ||
    lower.startsWith("var(")
  ) {
    return false;
  }
  return true;
};

const readStyleProperty = (style: string, property: string) => {
  return style
    .split(";")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => {
      const [key, value] = segment.split(":");
      return [key?.trim(), value?.trim()];
    })
    .find(([key]) => key === property)?.[1];
};

export const extractSvgAppearance = (
  svgContent: string
): SvgAppearance | null => {
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return null;
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg) return null;

    const elements: Element[] = [svg, ...Array.from(svg.querySelectorAll("*"))];
    const readValue = (element: Element, prop: string) => {
      const attr = element.getAttribute(prop);
      if (attr && attr.trim()) return attr.trim();
      const style = element.getAttribute("style");
      if (style) {
        const styleValue = readStyleProperty(style, prop);
        if (styleValue && styleValue.trim()) return styleValue.trim();
      }
      return null;
    };

    const findValue = (prop: string) => {
      for (const element of elements) {
        const value = readValue(element, prop);
        if (value) return value;
      }
      return null;
    };

    const appearance: SvgAppearance = {
      fillIsNone: false,
      strokeIsNone: false,
    };

    let sawStrokeAttribute = false;
    for (const element of elements) {
      const rawStroke = readValue(element, "stroke");
      if (!rawStroke) continue;
      sawStrokeAttribute = true;
      const lower = rawStroke.trim().toLowerCase();
      if (lower === "none" || lower === "transparent") {
        appearance.strokeIsNone = true;
        continue;
      }
      if (isMeaningfulColorValue(rawStroke)) {
        const normalized = normalizeColorValue(rawStroke);
        if (normalized) {
          appearance.strokeColor = normalized;
          appearance.strokeIsNone = false;
          break;
        }
      }
    }
    if (!sawStrokeAttribute && !appearance.strokeColor) {
      appearance.strokeIsNone = true;
    }

    let sawExplicitNoFill = false;
    for (const element of elements) {
      const rawFill = readValue(element, "fill");
      if (!rawFill) continue;
      const lower = rawFill.trim().toLowerCase();
      if (lower === "none" || lower === "transparent") {
        sawExplicitNoFill = true;
        continue;
      }
      if (isMeaningfulColorValue(rawFill)) {
        const normalizedFill = normalizeColorValue(rawFill);
        if (normalizedFill) {
          appearance.fillColor = normalizedFill;
          break;
        }
      }
    }
    if (!appearance.fillColor && sawExplicitNoFill) {
      appearance.fillIsNone = true;
    }

    const strokeWidthValue = findValue("stroke-width");
    if (strokeWidthValue) {
      const numeric = parseFloat(strokeWidthValue);
      if (!Number.isNaN(numeric)) {
        appearance.strokeWidth = numeric;
      }
    }

    if (
      !appearance.strokeColor &&
      !appearance.fillColor &&
      !appearance.strokeWidth &&
      !appearance.fillIsNone &&
      !appearance.strokeIsNone
    ) {
      return null;
    }

    return appearance;
  } catch (error) {
    console.error("Failed to parse SVG appearance", error);
    return null;
  }
};

export const clampStrokeWidth = (value: number) =>
  Math.min(10, Math.max(0.5, value));
