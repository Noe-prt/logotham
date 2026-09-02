export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max);

const normalizeHex = (hexColor?: string) => {
  if (!hexColor) return undefined;
  let value = hexColor.trim();
  if (value.startsWith("#")) {
    value = value.slice(1);
  }
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) {
    return undefined;
  }

  if (value.length === 3) {
    value = value
      .split("")
      .map((char) => char + char)
      .join("");
  }

  return `#${value.toLowerCase()}`;
};

const hexToRgb = (hexColor?: string) => {
  const normalizedHex = normalizeHex(hexColor);
  if (!normalizedHex) return undefined;

  return {
    r: parseInt(normalizedHex.slice(1, 3), 16),
    g: parseInt(normalizedHex.slice(3, 5), 16),
    b: parseInt(normalizedHex.slice(5, 7), 16),
    hex: normalizedHex,
  };
};

const rgbChannelToHex = (value: number) =>
  Math.round(clamp(value, 0, 255)).toString(16).padStart(2, "0");

const mixHexColors = (colorA?: string, colorB?: string, amount = 0.5) => {
  const source = hexToRgb(colorA);
  const target = hexToRgb(colorB);
  if (!source || !target) return colorA ?? colorB;
  const weight = clamp(amount, 0, 1);
  const r = source.r + (target.r - source.r) * weight;
  const g = source.g + (target.g - source.g) * weight;
  const b = source.b + (target.b - source.b) * weight;
  return `#${rgbChannelToHex(r)}${rgbChannelToHex(g)}${rgbChannelToHex(b)}`;
};

export const hexToRgba = (hexColor: string, opacity = 1) => {
  const normalizedOpacity = clamp(opacity);
  const rgb = hexToRgb(hexColor);
  if (!rgb) {
    return `rgba(0, 0, 0, ${normalizedOpacity})`;
  }

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${normalizedOpacity})`;
};

const channelToLinear = (channel: number) => {
  const normalized = channel / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4);
};

export const getRelativeLuminance = (hexColor?: string) => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return undefined;

  const r = channelToLinear(rgb.r);
  const g = channelToLinear(rgb.g);
  const b = channelToLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const getContrastRatio = (colorA?: string, colorB?: string) => {
  const luminanceA = getRelativeLuminance(colorA);
  const luminanceB = getRelativeLuminance(colorB);
  if (
    luminanceA === undefined ||
    luminanceB === undefined ||
    (luminanceA === 0 && luminanceB === 0)
  ) {
    return undefined;
  }
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);
  return (lighter + 0.05) / (darker + 0.05);
};

export const ensureReadableColor = (
  color: string | undefined,
  background: string | undefined,
  options?: {
    minRatio?: number;
    fallbackLight?: string;
    fallbackDark?: string;
  }
) => {
  const normalizedBackground = normalizeHex(background);
  const normalizedColor = normalizeHex(color);
  const minRatio = options?.minRatio ?? 2.5;
  const fallbackLight = options?.fallbackLight ?? "#f8fafc";
  const fallbackDark = options?.fallbackDark ?? "#0f172a";

  if (!normalizedBackground) {
    return normalizedColor ?? fallbackDark;
  }

  const contrastRatio = normalizedColor
    ? getContrastRatio(normalizedColor, normalizedBackground)
    : undefined;

  if (!normalizedColor || !contrastRatio || contrastRatio < minRatio) {
    const backgroundLum = getRelativeLuminance(normalizedBackground) ?? 1;
    return backgroundLum > 0.5 ? fallbackDark : fallbackLight;
  }

  return normalizedColor;
};

export const ensureContrastWithBackground = (
  color: string | undefined,
  background: string | undefined,
  options?: { minRatio?: number; maxIterations?: number }
) => {
  const normalizedBackground = normalizeHex(background);
  let adjustedColor = normalizeHex(color);
  const backgroundLum = getRelativeLuminance(normalizedBackground) ?? 0.5;

  if (!normalizedBackground) {
    return adjustedColor ?? color ?? "#000000";
  }

  const minRatio = options?.minRatio ?? 1.6;
  const maxIterations = options?.maxIterations ?? 6;
  let currentRatio = adjustedColor
    ? getContrastRatio(adjustedColor, normalizedBackground)
    : undefined;

  if (!adjustedColor) {
    adjustedColor = backgroundLum > 0.5 ? "#000000" : "#ffffff";
    currentRatio = getContrastRatio(adjustedColor, normalizedBackground);
  }

  if (currentRatio && currentRatio >= minRatio) {
    return adjustedColor;
  }

  const targetColor = backgroundLum > 0.5 ? "#000000" : "#ffffff";

  for (let iteration = 1; iteration <= maxIterations; iteration++) {
    const blendAmount = clamp(iteration * 0.15, 0.1, 0.9);
    adjustedColor = mixHexColors(adjustedColor, targetColor, blendAmount);
    currentRatio = getContrastRatio(adjustedColor, normalizedBackground);
    if (currentRatio && currentRatio >= minRatio) {
      return adjustedColor;
    }
  }

  return adjustedColor;
};

export const buildLinearGradientCss = (
  start: string,
  end: string,
  angle: number
) => `linear-gradient(${angle}deg, ${start}, ${end})`;
