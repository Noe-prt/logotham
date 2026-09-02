export type IconLibrary =
  | "lucide"
  | "flaticon"
  | "feather"
  | "iconoir"
  | "boxicons"
  | "heroicons"
  | "tabler"
  | "hugeicons"
  | "lineicons"
  | "fontawesome"
  | "custom"
  | "none";

export interface IconOption {
  name: string;
  label: string;
  library: IconLibrary;
  searchValue: string;
}

export type LogoConfig = {
  iconType:
    | "lucide"
    | "flaticon"
    | "feather"
    | "iconoir"
    | "boxicons"
    | "heroicons"
    | "tabler"
    | "hugeicons"
    | "lineicons"
    | "fontawesome"
    | "custom"
    | "none";
  iconName: string;
  customIcon?: string;
  iconSize: number[];
  iconColor: string;
  iconColorMode?: "solid" | "gradient";
  iconColorGradientStart?: string;
  iconColorGradientEnd?: string;
  iconColorGradientAngle?: number[];
  iconOpacity: number[];
  iconFillColor: string;
  iconFillColorMode?: "solid" | "gradient";
  iconFillGradientStart?: string;
  iconFillGradientEnd?: string;
  iconFillGradientAngle?: number[];
  iconFillOpacity: number[];
  strokeWidth: number[];
  rotate: number[];
  size: number[];
  exportSize?: number[];
  padding: number[];
  radius: number[];
  customIconPreserveStyles?: boolean;
  bgMode: "solid" | "gradient";
  bgColor: string;
  gradientStart: string;
  gradientEnd: string;
  gradientAngle: number[];
  bgOpacity: number[];
  borderWidth: number[];
  borderColor: string;
  borderColorMode?: "solid" | "gradient";
  borderGradientStart?: string;
  borderGradientEnd?: string;
  borderGradientAngle?: number[];
  shadowEnabled: boolean;
  shadowColor: string;
  shadowBlur: number[];
  shadowOpacity: number[];
  shadowX: number[];
  shadowY: number[];
  texts: LogoText[];
  iconPosition: { x: number; y: number };
  extraIcons?: LogoExtraIcon[];
  invertLayerOrder?: boolean;
  layerOrder?: string[];
};

export type LogoText = {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  colorMode?: "solid" | "gradient";
  gradientStart?: string;
  gradientEnd?: string;
  gradientAngle?: number;
  fontWeight: string;
  fontFamily: string;
  letterSpacing?: number;
  lineHeight?: number;
  textOutlineWidth?: number;
  textOutlineColor?: string;
  curved?: boolean;
  curveRadius?: number;
  curveInverted?: boolean;
};

export type LogoExtraIcon = {
  id: string;
  iconType: IconLibrary;
  iconName: string;
  customIcon?: string;
  customIconPreserveStyles?: boolean;
  size: number;
  position: { x: number; y: number };
  rotate: number;
  iconColor?: string;
  iconColorMode?: "solid" | "gradient";
  iconColorGradientStart?: string;
  iconColorGradientEnd?: string;
  iconColorGradientAngle?: number[];
  iconOpacity?: number[];
  iconFillColor?: string;
  iconFillColorMode?: "solid" | "gradient";
  iconFillGradientStart?: string;
  iconFillGradientEnd?: string;
  iconFillGradientAngle?: number[];
  iconFillOpacity?: number[];
  strokeWidth?: number[];
};

export * from "./logo-constants";
export * from "./logo-presets";
