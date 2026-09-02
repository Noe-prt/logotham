import { IconLibrary, LogoConfig } from "@/lib/logo-types";

export interface LogoPreviewProps {
  config: LogoConfig;
  onUpdateConfig?: (partial: Partial<LogoConfig>, saveHistory?: boolean) => void;
  activeLayerId?: string;
  onLayerSelect?: (id: string) => void;
  maxExportSize?: number | null;
}

export type PaintDefinition =
  | { type: "solid"; color: string }
  | { type: "gradient"; startColor: string; endColor: string; angle: number };

export type RenderIconLayer = {
  id: string;
  iconType: IconLibrary;
  iconName: string;
  customIcon?: string;
  dimension: number;
  position: { x: number; y: number };
  rotate: number;
  strokeWidth: number;
  isPrimary: boolean;
  iconStrokePaint?: PaintDefinition;
  iconFillPaint?: PaintDefinition;
  glyphPaint?: PaintDefinition;
  showIconFill?: boolean;
  preserveCustomIconAppearance?: boolean;
};

export interface LayerHoverState {
  hoveredLayerKey?: string | null;
}
