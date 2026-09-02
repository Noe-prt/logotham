import { ensureContrastWithBackground } from "./color-utils";
import {
  boxiconsIconNames,
  featherIconNames,
  flaticonIconNames,
  heroiconsIconNames,
  hugeiconsIconNames,
  iconNames,
  iconoirIconNames,
  lineiconsIconNames,
  tablerIconNames,
} from "./icon-metadata";
import { colorPalettes, initialConfig } from "./logo-constants";
import type { LogoConfig, LogoExtraIcon, LogoText } from "./logo-types";

const BASE64_PREFIX = "base64:";

const encodeBase64 = (value: string) => {
  if (typeof window !== "undefined" && typeof window.btoa === "function") {
    return window.btoa(unescape(encodeURIComponent(value)));
  }

  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf-8").toString("base64");
  }

  throw new Error("Base64 encoding is not supported in this environment");
};

const decodeBase64 = (value: string) => {
  if (typeof window !== "undefined" && typeof window.atob === "function") {
    return decodeURIComponent(escape(window.atob(value)));
  }

  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "base64").toString("utf-8");
  }

  throw new Error("Base64 decoding is not supported in this environment");
};

const encodeSvgValue = (value?: string | null) => {
  if (!value) return undefined;
  return `${BASE64_PREFIX}${encodeBase64(value)}`;
};

const decodeSvgValue = (value?: string | null) => {
  if (!value) return undefined;
  if (value.startsWith(BASE64_PREFIX)) {
    const encoded = value.slice(BASE64_PREFIX.length);
    try {
      return decodeBase64(encoded);
    } catch (error) {
      console.error("Failed to decode SVG value", error);
      return value;
    }
  }
  return value;
};

const encodeExtraIconsPayload = (icons: LogoExtraIcon[]) => {
  const serialized = icons.map((icon) =>
    icon.customIcon
      ? { ...icon, customIcon: encodeSvgValue(icon.customIcon) }
      : icon
  );
  return JSON.stringify(serialized);
};

const decodeExtraIconsPayload = (payload: string) => {
  try {
    const parsed: LogoExtraIcon[] = JSON.parse(payload);
    return parsed.map((icon) =>
      icon.customIcon
        ? { ...icon, customIcon: decodeSvgValue(icon.customIcon) }
        : icon
    );
  } catch (error) {
    console.error("Failed to decode extra icons", error);
    return [];
  }
};

const PREVIEW_CANVAS_BACKGROUND = "#f4f4f5";

const getRandomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const generateRandomConfig = (
  current: LogoConfig,
  options?: {
    keepIcon?: boolean;
    keepBackground?: boolean;
    keepText?: boolean;
    keepPosition?: boolean;
    keepIconColor?: boolean;
    keepIconFillColor?: boolean;
    keepTextColor?: boolean;
  }
): LogoConfig => {
  const getNumericValue = (value?: number[] | number) => {
    if (Array.isArray(value)) {
      const [first] = value;
      return typeof first === "number" && Number.isFinite(first)
        ? first
        : undefined;
    }
    return typeof value === "number" && Number.isFinite(value)
      ? value
      : undefined;
  };

  const randomIconSize = getRandomInt(40, 70);

  const canvasSize =
    getNumericValue(current.size) ??
    getNumericValue(initialConfig.size) ??
    1024;
  const halfCanvas = Math.max(0, Math.floor(canvasSize / 2));
  const basePaddingMax = Math.max(0, halfCanvas - 20);
  const iconPaddingGuard = Math.max(
    0,
    Math.floor((canvasSize - randomIconSize) / 2) - 8
  );
  const paddingCeiling = Math.min(128, basePaddingMax, iconPaddingGuard);
  const randomPadding =
    paddingCeiling > 0 ? getRandomInt(0, paddingCeiling) : 0;

  let randomRadius = 0;
  if (halfCanvas > 0) {
    const roundingRoll = Math.random();
    if (roundingRoll > 0.82) {
      randomRadius = halfCanvas;
    } else if (roundingRoll > 0.55) {
      randomRadius = getRandomInt(Math.floor(halfCanvas * 0.55), halfCanvas);
    } else if (roundingRoll > 0.25) {
      randomRadius = getRandomInt(
        Math.floor(halfCanvas * 0.2),
        Math.floor(halfCanvas * 0.55)
      );
    } else {
      randomRadius = getRandomInt(0, Math.floor(halfCanvas * 0.2));
    }
  }

  const rand = Math.random();
  let randomIconType:
    | "lucide"
    | "flaticon"
    | "feather"
    | "iconoir"
    | "boxicons"
    | "heroicons"
    | "tabler"
    | "hugeicons"
    | "lineicons";
  let randomIcon: string;

  if (rand < 0.15) {
    randomIconType = "lucide";
    randomIcon = getRandomItem(iconNames);
  } else if (rand < 0.3) {
    randomIconType = "feather";
    randomIcon = getRandomItem(featherIconNames);
  } else if (rand < 0.45) {
    randomIconType = "iconoir";
    randomIcon = getRandomItem(iconoirIconNames);
  } else if (rand < 0.6) {
    randomIconType = "boxicons";
    randomIcon = getRandomItem(boxiconsIconNames);
  } else if (rand < 0.75) {
    randomIconType = "heroicons";
    randomIcon = getRandomItem(heroiconsIconNames);
  } else if (rand < 0.85) {
    randomIconType = "tabler";
    randomIcon = getRandomItem(tablerIconNames);
  } else if (rand < 0.93) {
    randomIconType = "hugeicons";
    randomIcon = getRandomItem(hugeiconsIconNames);
  } else if (rand < 0.97) {
    randomIconType = "lineicons";
    randomIcon = getRandomItem(lineiconsIconNames);
  } else {
    randomIconType = "flaticon";
    randomIcon = getRandomItem(flaticonIconNames);
  }

  const palette = getRandomItem(colorPalettes);

  const bgMode = Math.random() > 0.4 ? "gradient" : "solid";
  let bgColor = getRandomItem(palette.backgrounds);
  let gradientStart = "#000000";
  let gradientEnd = "#000000";

  if (bgMode === "gradient") {
    const gradient = getRandomItem(palette.gradients);
    gradientStart = gradient[0];
    gradientEnd = gradient[1];
  } else {
    bgColor = getRandomItem(palette.backgrounds);
  }

  if (bgMode === "gradient") {
    const adjustedStart = ensureContrastWithBackground(
      gradientStart,
      PREVIEW_CANVAS_BACKGROUND,
      { minRatio: 1.4 }
    );
    const adjustedEnd = ensureContrastWithBackground(
      gradientEnd,
      PREVIEW_CANVAS_BACKGROUND,
      { minRatio: 1.4 }
    );
    gradientStart = adjustedStart ?? gradientStart;
    gradientEnd = adjustedEnd ?? gradientEnd;
  } else {
    const adjustedBg = ensureContrastWithBackground(
      bgColor,
      PREVIEW_CANVAS_BACKGROUND,
      { minRatio: 1.6 }
    );
    bgColor = adjustedBg ?? bgColor;
  }

  const hasBorder = Math.random() > 0.7;
  const borderWidth = hasBorder ? getRandomInt(2, 8) : 0;
  const borderColor = getRandomItem(palette.borders);
  const borderGradientStart = getRandomItem(palette.borders);
  const borderGradientEnd = getRandomItem(palette.borders);

  const shadowEnabled = Math.random() > 0.6;

  const randomStrokeWidth = parseFloat(
    (Math.random() * (2.5 - 0.6) + 0.6).toFixed(2)
  );

  const newConfig: LogoConfig = {
    ...initialConfig,
    iconType: randomIconType,
    iconName: randomIcon,
    iconSize: [randomIconSize],
    iconColor: getRandomItem(palette.foregrounds),
    iconColorMode: "solid",
    iconColorGradientStart: getRandomItem(palette.foregrounds),
    iconColorGradientEnd: getRandomItem(palette.foregrounds),
    iconColorGradientAngle: [getRandomInt(0, 360)],
    iconOpacity: [100],
    iconFillColor: getRandomItem(palette.foregrounds),
    iconFillColorMode: "solid",
    iconFillGradientStart: getRandomItem(palette.foregrounds),
    iconFillGradientEnd: getRandomItem(palette.foregrounds),
    iconFillGradientAngle: [getRandomInt(0, 360)],
    iconFillOpacity: [0],
    strokeWidth: [randomStrokeWidth],
    rotate: [0],
    padding: [randomPadding],
    radius: [randomRadius],
    bgMode,
    bgColor,
    gradientStart,
    gradientEnd,
    gradientAngle: [getRandomInt(0, 360)],
    bgOpacity: [100],
    borderWidth: [borderWidth],
    borderColor,
    borderColorMode: "solid",
    borderGradientStart,
    borderGradientEnd,
    borderGradientAngle: [getRandomInt(0, 360)],
    shadowEnabled,
    shadowColor: "#000000",
    shadowBlur: [getRandomInt(10, 40)],
    shadowOpacity: [0.25],
    shadowX: [0],
    shadowY: [getRandomInt(5, 15)],
    texts: [],
    iconPosition: { x: 0, y: 0 },
  };

  if (options?.keepIcon) {
    newConfig.iconType = current.iconType;
    newConfig.iconName = current.iconName;
    newConfig.iconSize = current.iconSize;
    newConfig.strokeWidth = current.strokeWidth;
    newConfig.rotate = current.rotate;
  }

  if (options?.keepIconColor) {
    newConfig.iconColor = current.iconColor;
    newConfig.iconColorMode = current.iconColorMode;
    newConfig.iconColorGradientStart = current.iconColorGradientStart;
    newConfig.iconColorGradientEnd = current.iconColorGradientEnd;
    newConfig.iconColorGradientAngle = current.iconColorGradientAngle;
    newConfig.iconOpacity = current.iconOpacity;
  }

  if (options?.keepIconFillColor) {
    newConfig.iconFillColor = current.iconFillColor;
    newConfig.iconFillColorMode = current.iconFillColorMode;
    newConfig.iconFillGradientStart = current.iconFillGradientStart;
    newConfig.iconFillGradientEnd = current.iconFillGradientEnd;
    newConfig.iconFillGradientAngle = current.iconFillGradientAngle;
    newConfig.iconFillOpacity = current.iconFillOpacity;
  }

  if (options?.keepBackground) {
    newConfig.bgMode = current.bgMode;
    newConfig.bgColor = current.bgColor;
    newConfig.gradientStart = current.gradientStart;
    newConfig.gradientEnd = current.gradientEnd;
    newConfig.gradientAngle = current.gradientAngle;
    newConfig.bgOpacity = current.bgOpacity;
    newConfig.borderWidth = current.borderWidth;
    newConfig.borderColor = current.borderColor;
    newConfig.borderColorMode = current.borderColorMode;
    newConfig.borderGradientStart = current.borderGradientStart;
    newConfig.borderGradientEnd = current.borderGradientEnd;
    newConfig.borderGradientAngle = current.borderGradientAngle;
    newConfig.shadowEnabled = current.shadowEnabled;
    newConfig.shadowColor = current.shadowColor;
    newConfig.shadowBlur = current.shadowBlur;
    newConfig.shadowOpacity = current.shadowOpacity;
    newConfig.shadowX = current.shadowX;
    newConfig.shadowY = current.shadowY;
  }

  if (options?.keepText) {
    newConfig.texts = current.texts.map((text) => {
      const newX = getRandomInt(-20, 20);
      const newY = getRandomInt(-20, 20);
      return {
        ...text,
        x: newX,
        y: newY,
      };
    });
  }

  if (options?.keepTextColor) {
    newConfig.texts = current.texts.map((text) => ({
      ...text,
      color: text.color,
      colorMode: text.colorMode,
      gradientStart: text.gradientStart,
      gradientEnd: text.gradientEnd,
      gradientAngle: text.gradientAngle,
      textOutlineColor: text.textOutlineColor,
    }));
  }

  if (options?.keepPosition) {
    newConfig.iconPosition = current.iconPosition;
  }

  return newConfig;
};

export const encodeConfigToUrl = (config: LogoConfig): string => {
  const params = new URLSearchParams();

  const add = (
    key: string,
    value:
      | string
      | number
      | boolean
      | number[]
      | LogoText[]
      | LogoExtraIcon[]
      | undefined
  ) => {
    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      if (key === "texts") {
        params.set(key, JSON.stringify(value));
      } else if (key === "extraIcons") {
        params.set(key, encodeExtraIconsPayload(value as LogoExtraIcon[]));
      } else {
        params.set(key, value.join(","));
      }
      return;
    }

    params.set(key, String(value));
  };

  add("it", config.iconType);
  add("i", config.iconName);
  add("ci", encodeSvgValue(config.customIcon));
  add("is", config.iconSize);
  add("ic", config.iconColor);
  add("icm", config.iconColorMode);
  add("ics", config.iconColorGradientStart);
  add("ice", config.iconColorGradientEnd);
  add("ica", config.iconColorGradientAngle);
  add("io", config.iconOpacity);
  add("ifc", config.iconFillColor);
  add("ifm", config.iconFillColorMode);
  add("ifcs", config.iconFillGradientStart);
  add("ifce", config.iconFillGradientEnd);
  add("ifca", config.iconFillGradientAngle);
  add("ifo", config.iconFillOpacity);
  add("sw", config.strokeWidth);
  add("r", config.rotate);
  add("s", config.size);
  add("p", config.padding);
  add("ra", config.radius);
  add("bm", config.bgMode);
  add("bc", config.bgColor);
  add("gs", config.gradientStart);
  add("ge", config.gradientEnd);
  add("ga", config.gradientAngle);
  add("bgo", config.bgOpacity);
  add("bw", config.borderWidth);
  add("boc", config.borderColor);
  add("bcm", config.borderColorMode);
  add("bgs", config.borderGradientStart);
  add("bge", config.borderGradientEnd);
  add("bga", config.borderGradientAngle);
  add("se", config.shadowEnabled);
  add("sc", config.shadowColor);
  add("sb", config.shadowBlur);
  add("so", config.shadowOpacity);
  add("sx", config.shadowX);
  add("sy", config.shadowY);
  add("texts", config.texts);
  add("extraIcons", config.extraIcons);
  add("ix", config.iconPosition?.x ?? 0);
  add("iy", config.iconPosition?.y ?? 0);
  add("ilo", config.invertLayerOrder);
  add("lo", config.layerOrder ? config.layerOrder.join(",") : undefined);

  return `?${params.toString()}`;
};

export const decodeUrlToConfig = (
  searchParams: URLSearchParams
): Partial<LogoConfig> => {
  const config: Partial<LogoConfig> = {};

  const getNumArray = (key: string) => {
    const val = searchParams.get(key);
    if (!val) return undefined;
    return val
      .split(",")
      .map(Number)
      .filter((n) => !isNaN(n));
  };

  const getString = (key: string) => searchParams.get(key) || undefined;
  const getSvgString = (key: string) => decodeSvgValue(searchParams.get(key));
  const getBool = (key: string) => searchParams.get(key) === "true";

  if (searchParams.has("it"))
    config.iconType = getString("it") as LogoConfig["iconType"];
  if (searchParams.has("i")) config.iconName = getString("i");
  if (searchParams.has("ci")) config.customIcon = getSvgString("ci");
  if (searchParams.has("is")) config.iconSize = getNumArray("is");
  if (searchParams.has("ic")) config.iconColor = getString("ic");
  if (searchParams.has("icm"))
    config.iconColorMode = getString("icm") as LogoConfig["iconColorMode"];
  if (searchParams.has("ics")) config.iconColorGradientStart = getString("ics");
  if (searchParams.has("ice")) config.iconColorGradientEnd = getString("ice");
  if (searchParams.has("ica"))
    config.iconColorGradientAngle = getNumArray("ica");
  if (searchParams.has("io")) config.iconOpacity = getNumArray("io");
  if (searchParams.has("ifc")) config.iconFillColor = getString("ifc");
  if (searchParams.has("ifm"))
    config.iconFillColorMode = getString(
      "ifm"
    ) as LogoConfig["iconFillColorMode"];
  if (searchParams.has("ifcs"))
    config.iconFillGradientStart = getString("ifcs");
  if (searchParams.has("ifce")) config.iconFillGradientEnd = getString("ifce");
  if (searchParams.has("ifca"))
    config.iconFillGradientAngle = getNumArray("ifca");
  if (searchParams.has("ifo")) config.iconFillOpacity = getNumArray("ifo");
  if (searchParams.has("sw")) config.strokeWidth = getNumArray("sw");
  if (searchParams.has("r")) config.rotate = getNumArray("r");
  if (searchParams.has("s")) config.size = getNumArray("s");
  if (searchParams.has("p")) config.padding = getNumArray("p");
  if (searchParams.has("ra")) config.radius = getNumArray("ra");

  if (searchParams.has("bm"))
    config.bgMode = getString("bm") as LogoConfig["bgMode"];
  if (searchParams.has("bc")) config.bgColor = getString("bc");
  if (searchParams.has("gs")) config.gradientStart = getString("gs");
  if (searchParams.has("ge")) config.gradientEnd = getString("ge");
  if (searchParams.has("ga")) config.gradientAngle = getNumArray("ga");
  if (searchParams.has("bgo")) config.bgOpacity = getNumArray("bgo");
  if (searchParams.has("bw")) config.borderWidth = getNumArray("bw");
  if (searchParams.has("boc")) config.borderColor = getString("boc");
  if (searchParams.has("bcm"))
    config.borderColorMode = getString("bcm") as LogoConfig["borderColorMode"];
  if (searchParams.has("bgs")) config.borderGradientStart = getString("bgs");
  if (searchParams.has("bge")) config.borderGradientEnd = getString("bge");
  if (searchParams.has("bga")) config.borderGradientAngle = getNumArray("bga");
  if (searchParams.has("se")) config.shadowEnabled = getBool("se");
  if (searchParams.has("sc")) config.shadowColor = getString("sc");
  if (searchParams.has("sb")) config.shadowBlur = getNumArray("sb");
  if (searchParams.has("so")) config.shadowOpacity = getNumArray("so");
  if (searchParams.has("sx")) config.shadowX = getNumArray("sx");
  if (searchParams.has("sy")) config.shadowY = getNumArray("sy");
  if (searchParams.has("texts")) {
    try {
      config.texts = JSON.parse(searchParams.get("texts") || "[]");
    } catch {
      config.texts = [];
    }
  }
  if (searchParams.has("extraIcons")) {
    const payload = searchParams.get("extraIcons");
    if (payload) {
      config.extraIcons = decodeExtraIconsPayload(payload);
    } else {
      config.extraIcons = [];
    }
  }
  if (searchParams.has("ix") || searchParams.has("iy")) {
    config.iconPosition = {
      x: Number(searchParams.get("ix") ?? 0),
      y: Number(searchParams.get("iy") ?? 0),
    };
  }
  if (searchParams.has("ilo")) {
    config.invertLayerOrder = getBool("ilo");
  }
  if (searchParams.has("lo")) {
    const raw = getString("lo");
    if (raw) {
      config.layerOrder = raw.split(",").filter(Boolean);
    }
  }

  return config;
};

const extractNumberValue = (value?: number[] | number) => {
  if (Array.isArray(value)) {
    const [first] = value;
    return typeof first === "number" && Number.isFinite(first)
      ? first
      : undefined;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  return undefined;
};

const clampNumber = (
  value: number,
  min: number = Number.NEGATIVE_INFINITY,
  max: number = Number.POSITIVE_INFINITY
) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

type NumericSanitizeOptions = {
  min?: number;
  max?: number;
  round?: boolean;
};

const resolveNumberValue = (
  candidate?: number[] | number,
  base?: number[] | number,
  fallback?: number[] | number
) =>
  extractNumberValue(candidate) ??
  extractNumberValue(base) ??
  extractNumberValue(fallback);

const sanitizeNumberValue = (
  candidate?: number[] | number,
  base?: number[] | number,
  fallback?: number[] | number,
  options: NumericSanitizeOptions = {}
) => {
  const resolved =
    resolveNumberValue(candidate, base, fallback) ??
    extractNumberValue(fallback) ??
    0;
  const min = options.min ?? Number.NEGATIVE_INFINITY;
  const max = options.max ?? Number.POSITIVE_INFINITY;

  let safe = Number.isFinite(resolved)
    ? resolved
    : extractNumberValue(fallback) ?? 0;
  safe = clampNumber(safe, min, max);
  if (options.round) {
    safe = Math.round(safe);
  }

  return safe;
};

const sanitizeScalarNumber = (
  candidate: number | undefined,
  base: number | undefined,
  fallback: number,
  options: NumericSanitizeOptions = {}
) => {
  const min = options.min ?? Number.NEGATIVE_INFINITY;
  const max = options.max ?? Number.POSITIVE_INFINITY;
  let safe: number;

  if (typeof candidate === "number" && Number.isFinite(candidate)) {
    safe = candidate;
  } else if (typeof base === "number" && Number.isFinite(base)) {
    safe = base;
  } else {
    safe = fallback;
  }

  safe = clampNumber(safe, min, max);
  if (options.round) {
    safe = Math.round(safe);
  }

  return safe;
};

export const sanitizeLogoConfig = (
  config: LogoConfig,
  baseConfig: LogoConfig = initialConfig
): LogoConfig => {
  const safeSize = sanitizeNumberValue(
    config.size,
    baseConfig.size,
    initialConfig.size,
    { min: 64, max: 2048, round: true }
  );
  const safePadding = sanitizeNumberValue(
    config.padding,
    baseConfig.padding,
    initialConfig.padding,
    { min: 0, max: safeSize / 2, round: true }
  );
  const safeRadius = sanitizeNumberValue(
    config.radius,
    baseConfig.radius,
    initialConfig.radius,
    { min: 0, max: safeSize / 2, round: true }
  );
  const safeIconSize = sanitizeNumberValue(
    config.iconSize,
    baseConfig.iconSize,
    initialConfig.iconSize,
    { min: 10, max: 90, round: true }
  );
  const safeIconOpacity = sanitizeNumberValue(
    config.iconOpacity,
    baseConfig.iconOpacity,
    initialConfig.iconOpacity,
    { min: 0, max: 100, round: true }
  );
  const safeIconFillOpacity = sanitizeNumberValue(
    config.iconFillOpacity,
    baseConfig.iconFillOpacity,
    initialConfig.iconFillOpacity,
    { min: 0, max: 100, round: true }
  );
  const safeStrokeWidth = sanitizeNumberValue(
    config.strokeWidth,
    baseConfig.strokeWidth,
    initialConfig.strokeWidth,
    { min: 0.5, max: 10 }
  );
  const safeRotate = sanitizeNumberValue(
    config.rotate,
    baseConfig.rotate,
    initialConfig.rotate,
    { min: 0, max: 360, round: true }
  );
  const safeGradientAngle = sanitizeNumberValue(
    config.gradientAngle,
    baseConfig.gradientAngle,
    initialConfig.gradientAngle,
    { min: 0, max: 360, round: true }
  );
  const safeBgOpacity = sanitizeNumberValue(
    config.bgOpacity,
    baseConfig.bgOpacity,
    initialConfig.bgOpacity,
    { min: 0, max: 100, round: true }
  );
  const safeBorderWidth = sanitizeNumberValue(
    config.borderWidth,
    baseConfig.borderWidth,
    initialConfig.borderWidth,
    { min: 0, max: 20, round: true }
  );
  const safeBorderGradientAngle = sanitizeNumberValue(
    config.borderGradientAngle,
    baseConfig.borderGradientAngle,
    initialConfig.borderGradientAngle,
    { min: 0, max: 360, round: true }
  );
  const safeShadowBlur = sanitizeNumberValue(
    config.shadowBlur,
    baseConfig.shadowBlur,
    initialConfig.shadowBlur,
    { min: 0, max: 100, round: true }
  );
  const safeShadowOpacity = sanitizeNumberValue(
    config.shadowOpacity,
    baseConfig.shadowOpacity,
    initialConfig.shadowOpacity,
    { min: 0, max: 1 }
  );
  const safeShadowX = sanitizeNumberValue(
    config.shadowX,
    baseConfig.shadowX,
    initialConfig.shadowX,
    { min: -50, max: 50, round: true }
  );
  const safeShadowY = sanitizeNumberValue(
    config.shadowY,
    baseConfig.shadowY,
    initialConfig.shadowY,
    { min: -50, max: 50, round: true }
  );
  const safeIconColorAngle = sanitizeNumberValue(
    config.iconColorGradientAngle,
    baseConfig.iconColorGradientAngle,
    initialConfig.iconColorGradientAngle,
    { min: 0, max: 360, round: true }
  );
  const safeIconFillAngle = sanitizeNumberValue(
    config.iconFillGradientAngle,
    baseConfig.iconFillGradientAngle,
    initialConfig.iconFillGradientAngle,
    { min: 0, max: 360, round: true }
  );

  const safeIconPosition = {
    x: sanitizeScalarNumber(
      config.iconPosition?.x,
      baseConfig.iconPosition?.x,
      initialConfig.iconPosition.x,
      { min: -safeSize, max: safeSize }
    ),
    y: sanitizeScalarNumber(
      config.iconPosition?.y,
      baseConfig.iconPosition?.y,
      initialConfig.iconPosition.y,
      { min: -safeSize, max: safeSize }
    ),
  };

  const baseTextMap = new Map(baseConfig.texts?.map((text) => [text.id, text]));
  const safeTexts: LogoText[] = Array.isArray(config.texts)
    ? config.texts.map((text) => {
        const baseText = baseTextMap.get(text.id);
        return {
          ...text,
          x: sanitizeScalarNumber(text.x, baseText?.x, 0, {
            min: -safeSize,
            max: safeSize,
          }),
          y: sanitizeScalarNumber(text.y, baseText?.y, 0, {
            min: -safeSize,
            max: safeSize,
          }),
          fontSize: sanitizeScalarNumber(
            text.fontSize,
            baseText?.fontSize,
            32,
            {
              min: 4,
              max: safeSize,
            }
          ),
          colorMode: text.colorMode ?? baseText?.colorMode ?? "solid",
          gradientStart:
            text.gradientStart ??
            baseText?.gradientStart ??
            text.color ??
            baseText?.color ??
            initialConfig.iconColor,
          gradientEnd:
            text.gradientEnd ??
            baseText?.gradientEnd ??
            text.color ??
            baseText?.color ??
            initialConfig.iconColor,
          gradientAngle:
            typeof text.gradientAngle === "number"
              ? clampNumber(text.gradientAngle, 0, 360)
              : typeof baseText?.gradientAngle === "number"
              ? clampNumber(baseText.gradientAngle, 0, 360)
              : 90,
        };
      })
    : [];

  const safeExtraIcons: LogoExtraIcon[] = (config.extraIcons ?? []).map(
    (icon) => ({
      ...icon,
      size: clampNumber(icon.size, 10, 150),
      rotate: clampNumber(icon.rotate, 0, 360),
      position: {
        x: clampNumber(icon.position?.x ?? 0, -safeSize, safeSize),
        y: clampNumber(icon.position?.y ?? 0, -safeSize, safeSize),
      },
      strokeWidth: icon.strokeWidth
        ? [
            sanitizeNumberValue(icon.strokeWidth, undefined, [1.5], {
              min: 0.5,
              max: 10,
            }),
          ]
        : undefined,
      iconOpacity: icon.iconOpacity
        ? [
            sanitizeNumberValue(icon.iconOpacity, undefined, [100], {
              min: 0,
              max: 100,
              round: true,
            }),
          ]
        : undefined,
      iconFillOpacity: icon.iconFillOpacity
        ? [
            sanitizeNumberValue(icon.iconFillOpacity, undefined, [0], {
              min: 0,
              max: 100,
              round: true,
            }),
          ]
        : undefined,
      iconColorGradientAngle: icon.iconColorGradientAngle
        ? [
            sanitizeNumberValue(icon.iconColorGradientAngle, undefined, [90], {
              min: 0,
              max: 360,
              round: true,
            }),
          ]
        : undefined,
      iconFillGradientAngle: icon.iconFillGradientAngle
        ? [
            sanitizeNumberValue(icon.iconFillGradientAngle, undefined, [90], {
              min: 0,
              max: 360,
              round: true,
            }),
          ]
        : undefined,
      customIconPreserveStyles: icon.customIconPreserveStyles ?? false,
    })
  );

  const defaultLayerOrder = [
    "primary",
    ...safeExtraIcons.map((icon) => icon.id),
  ];

  const providedLayerOrder = Array.isArray(config.layerOrder)
    ? config.layerOrder.filter(
        (key): key is string =>
          key === "primary" || safeExtraIcons.some((icon) => icon.id === key)
      )
    : [];

  const mergedLayerOrder = [...providedLayerOrder];
  for (const key of defaultLayerOrder) {
    if (!mergedLayerOrder.includes(key)) {
      mergedLayerOrder.push(key);
    }
  }

  return {
    ...config,
    size: [safeSize],
    padding: [safePadding],
    radius: [safeRadius],
    iconSize: [safeIconSize],
    iconOpacity: [safeIconOpacity],
    iconFillOpacity: [safeIconFillOpacity],
    strokeWidth: [safeStrokeWidth],
    rotate: [safeRotate],
    gradientAngle: [safeGradientAngle],
    bgOpacity: [safeBgOpacity],
    borderWidth: [safeBorderWidth],
    borderColor:
      config.borderColor ?? baseConfig.borderColor ?? initialConfig.borderColor,
    borderColorMode:
      config.borderColorMode ?? baseConfig.borderColorMode ?? "solid",
    borderGradientStart:
      config.borderGradientStart ??
      baseConfig.borderGradientStart ??
      initialConfig.borderGradientStart,
    borderGradientEnd:
      config.borderGradientEnd ??
      baseConfig.borderGradientEnd ??
      initialConfig.borderGradientEnd,
    borderGradientAngle: [safeBorderGradientAngle],
    shadowBlur: [safeShadowBlur],
    shadowOpacity: [safeShadowOpacity],
    shadowX: [safeShadowX],
    shadowY: [safeShadowY],
    iconColorMode: config.iconColorMode ?? baseConfig.iconColorMode ?? "solid",
    iconColorGradientStart:
      config.iconColorGradientStart ??
      baseConfig.iconColorGradientStart ??
      initialConfig.iconColorGradientStart,
    iconColorGradientEnd:
      config.iconColorGradientEnd ??
      baseConfig.iconColorGradientEnd ??
      initialConfig.iconColorGradientEnd,
    iconColorGradientAngle: [safeIconColorAngle],
    iconFillColorMode:
      config.iconFillColorMode ?? baseConfig.iconFillColorMode ?? "solid",
    iconFillGradientStart:
      config.iconFillGradientStart ??
      baseConfig.iconFillGradientStart ??
      initialConfig.iconFillGradientStart,
    iconFillGradientEnd:
      config.iconFillGradientEnd ??
      baseConfig.iconFillGradientEnd ??
      initialConfig.iconFillGradientEnd,
    iconFillGradientAngle: [safeIconFillAngle],
    iconPosition: safeIconPosition,
    texts: safeTexts,
    extraIcons: safeExtraIcons,
    customIconPreserveStyles:
      config.customIconPreserveStyles ??
      baseConfig.customIconPreserveStyles ??
      false,
    invertLayerOrder:
      config.invertLayerOrder ?? baseConfig.invertLayerOrder ?? false,
    layerOrder:
      mergedLayerOrder.length > 0
        ? mergedLayerOrder
        : baseConfig.layerOrder ?? defaultLayerOrder,
  };
};
