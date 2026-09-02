export type AutoExportVariant = {
  id: string;
  label: string;
  description: string;
  format: "png" | "svg";
  size?: number;
};

export const autoExportOptions: AutoExportVariant[] = [
  {
    id: "primary-1024-png",
    label: "Primary 1024px PNG",
    description: "Hero / presentation ready",
    format: "png",
    size: 1024,
  },
  {
    id: "primary-512-png",
    label: "Primary 512px PNG",
    description: "General purpose",
    format: "png",
    size: 512,
  },
  {
    id: "primary-256-png",
    label: "Primary 256px PNG",
    description: "Avatars & product cards",
    format: "png",
    size: 256,
  },
  {
    id: "primary-128-png",
    label: "Primary 128px PNG",
    description: "Favicons & list views",
    format: "png",
    size: 128,
  },
  {
    id: "primary-svg",
    label: "Primary SVG",
    description: "Infinite scaling",
    format: "svg",
  },
];

export const defaultAutoExportSelection = [
  "primary-svg",
  "primary-512-png",
  "primary-256-png",
];
