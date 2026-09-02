import { LogoConfig } from "@/lib/logo-types";
import { toPng, toSvg } from "html-to-image";
import { WEBFONT_SELECTOR } from "./constants";

export const getValue = (val: number[] | number | undefined) => {
  if (val === undefined) return 0;
  if (Array.isArray(val)) return val[0] ?? 0;
  return val;
};

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const sanitizeGradientId = (reactId: string, prefix: string) =>
  `${prefix}-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

export const downloadDataUrl = (dataUrl: string, filename: string) => {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
};

export const parseDataUrl = (dataUrl: string) => {
  const commaIndex = dataUrl.indexOf(",");
  if (commaIndex === -1) {
    throw new Error("Invalid data URL");
  }
  const meta = dataUrl.substring(0, commaIndex);
  const isBase64 = /;base64$/i.test(meta);
  const dataContent = dataUrl.substring(commaIndex + 1);

  return {
    data: isBase64 ? dataContent : decodeURIComponent(dataContent),
    base64: isBase64,
  };
};

export const enhanceSvgWithFallback = (
  svgDataUrl: string,
  pngDataUrl?: string,
  size?: number
) => {
  if (!pngDataUrl || typeof DOMParser === "undefined") {
    return svgDataUrl;
  }

  try {
    const svgContent = parseDataUrl(svgDataUrl).data;
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, "image/svg+xml");
    const svgEl = doc.documentElement;
    if (!svgEl) return svgDataUrl;

    const svgNS = "http://www.w3.org/2000/svg";
    const xlinkNS = "http://www.w3.org/1999/xlink";
    const switchEl = doc.createElementNS(svgNS, "switch");

    const existingChildren = Array.from(svgEl.childNodes);
    existingChildren.forEach((child) => {
      if (
        child.nodeType === 1 &&
        (child as Element).tagName === "foreignObject"
      ) {
        (child as Element).setAttribute(
          "requiredFeatures",
          "http://www.w3.org/TR/SVG11/feature#Extensibility"
        );
      }
      switchEl.appendChild(child);
    });

    const fallbackGroup = doc.createElementNS(svgNS, "g");
    const image = doc.createElementNS(svgNS, "image");
    const width = svgEl.getAttribute("width") ?? (size ? `${size}` : undefined);
    const height =
      svgEl.getAttribute("height") ?? (size ? `${size}` : undefined);
    if (width) image.setAttribute("width", width);
    if (height) image.setAttribute("height", height);
    image.setAttribute("preserveAspectRatio", "xMidYMid meet");
    image.setAttributeNS(xlinkNS, "href", pngDataUrl);
    image.setAttribute("href", pngDataUrl);
    fallbackGroup.appendChild(image);
    switchEl.appendChild(fallbackGroup);

    svgEl.appendChild(switchEl);

    const serialized = new XMLSerializer().serializeToString(doc);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(serialized)}`;
  } catch (error) {
    console.error("Failed to embed SVG fallback", error);
    return svgDataUrl;
  }
};

export const cloneConfig = (cfg: LogoConfig): LogoConfig =>
  JSON.parse(JSON.stringify(cfg));

export const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string" && reader.result.length > 0) {
        resolve(reader.result);
      } else {
        reject(new Error("Empty file result"));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

export const scaleConfigForExport = (
  baseConfig: LogoConfig,
  targetSize: number
): LogoConfig => {
  const newConfig = cloneConfig(baseConfig);
  const currentSize = getValue(baseConfig.size);

  if (!currentSize || currentSize === targetSize) {
    newConfig.size = [targetSize];
    return newConfig;
  }

  const scale = targetSize / currentSize;
  newConfig.size = [targetSize];

  const scaleVal = (val: number[] | undefined) => {
    if (!val) return undefined;
    return [Math.round(getValue(val) * scale)];
  };

  if (newConfig.radius) {
    const r = getValue(newConfig.radius);
    const scaledRadius = Math.round(r * scale);
    const maxRadius = Math.max(0, Math.floor(targetSize / 2));
    newConfig.radius = [Math.min(maxRadius, scaledRadius)];
  }

  if (newConfig.borderWidth)
    newConfig.borderWidth = scaleVal(newConfig.borderWidth)!;
  if (newConfig.padding) newConfig.padding = scaleVal(newConfig.padding)!;
  if (newConfig.shadowBlur)
    newConfig.shadowBlur = scaleVal(newConfig.shadowBlur)!;
  if (newConfig.shadowX) newConfig.shadowX = scaleVal(newConfig.shadowX)!;
  if (newConfig.shadowY) newConfig.shadowY = scaleVal(newConfig.shadowY)!;

  if (newConfig.iconPosition) {
    newConfig.iconPosition.x *= scale;
    newConfig.iconPosition.y *= scale;
  }

  if (newConfig.extraIcons) {
    newConfig.extraIcons = newConfig.extraIcons.map((icon) => ({
      ...icon,
      position: {
        x: (icon.position?.x ?? 0) * scale,
        y: (icon.position?.y ?? 0) * scale,
      },
    }));
  }

  if (newConfig.texts) {
    newConfig.texts = newConfig.texts.map((t) => ({
      ...t,
      x: t.x * scale,
      y: t.y * scale,
      fontSize: t.fontSize * scale,
    }));
  }

  return newConfig;
};

export const prepareWebfontIconForExport = (
  element: HTMLElement,
  options: { iconColor: string }
) => {
  const iconElements = element.querySelectorAll<HTMLElement>(WEBFONT_SELECTOR);
  if (!iconElements.length) return;

  iconElements.forEach((iconElement) => {
    const pseudo = window.getComputedStyle(iconElement, "::before");
    let content = pseudo.getPropertyValue("content");

    if (!content || content === "none") {
      return;
    }

    content = content.replace(/^['"]|['"]$/g, "");

    if (/^\\[0-9a-fA-F]+$/.test(content)) {
      try {
        content = String.fromCodePoint(parseInt(content.slice(1), 16));
      } catch (error) {
        console.error("Failed to parse webfont glyph", error);
        return;
      }
    }

    if (!content) return;

    const span = document.createElement("span");
    span.textContent = content;
    span.style.fontFamily = pseudo.getPropertyValue("font-family") || "inherit";
    span.style.fontSize = iconElement.style.fontSize;
    span.style.fontStyle = pseudo.getPropertyValue("font-style") || "normal";
    span.style.fontWeight = pseudo.getPropertyValue("font-weight") || "400";
    span.style.lineHeight = pseudo.getPropertyValue("line-height") || "1";
    span.style.display = "flex";
    span.style.alignItems = "center";
    span.style.justifyContent = "center";
    span.style.color = iconElement.style.color || options.iconColor;
    if (iconElement.style.backgroundImage) {
      span.style.backgroundImage = iconElement.style.backgroundImage;
    }
    if (iconElement.style.backgroundClip) {
      span.style.backgroundClip = iconElement.style.backgroundClip;
    }
    const webkitClip = iconElement.style.getPropertyValue(
      "-webkit-background-clip"
    );
    if (webkitClip) {
      span.style.setProperty("-webkit-background-clip", webkitClip);
    }
    span.style.width = "100%";
    span.style.height = "100%";

    iconElement.innerHTML = "";
    iconElement.appendChild(span);
    iconElement.setAttribute("data-webfont-export", "true");

    const classesToRemove = Array.from(iconElement.classList).filter(
      (c) => c.startsWith("bx") || c.startsWith("fi")
    );
    if (classesToRemove.length > 0) {
      iconElement.classList.remove(...classesToRemove);
    }
  });
};

export const createDataUrl = async (
  format: "png" | "svg",
  exportElement: HTMLElement,
  currentSize: number,
  options?: { pixelRatio?: number }
) => {
  if (format === "svg") {
    return await toSvg(exportElement, {
      cacheBust: true,
      width: currentSize,
      height: currentSize,
      style: {
        transform: "scale(1)",
        transformOrigin: "top left",
      },
    });
  }

  const pixelRatio = options?.pixelRatio ?? 1;

  return await toPng(exportElement, {
    cacheBust: true,
    pixelRatio,
    width: currentSize,
    height: currentSize,
    backgroundColor: undefined,
    style: {
      transform: "scale(1)",
      transformOrigin: "top left",
    },
    filter: (node: HTMLElement) => node.tagName !== "SCRIPT",
    skipAutoScale: false,
  });
};
