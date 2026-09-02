import iconCatalogData from "@/data/icon-catalog.json";
import type { IconOption } from "./logo-types";

type IconCatalog = {
  generatedAt: string;
  total: number;
  libraries: Record<string, { count: number; icons: string[] }>;
  options: IconOption[];
};

const iconCatalog = iconCatalogData as IconCatalog;

const getIcons = (name: string) =>
  (iconCatalog.libraries[name]?.icons as string[] | undefined) ?? [];

export const lucideIconNames = getIcons("lucide");
export const iconoirIconNames = getIcons("iconoir");
export const heroiconsIconNames = getIcons("heroicons");
export const tablerIconNames = getIcons("tabler");
export const hugeiconsIconNames = getIcons("hugeicons");
export const featherIconNames = getIcons("feather");
export const flaticonIconNames = getIcons("flaticon");
export const boxiconsIconNames = getIcons("boxicons");
export const lineiconsIconNames = getIcons("lineicons");
export const fontawesomeIconNames = getIcons("fontawesome");

export const iconNames = lucideIconNames;

export const iconOptions = (iconCatalog.options ?? []) as IconOption[];

export const iconOptionMap = iconOptions.reduce<Record<string, IconOption>>(
  (acc, option) => {
    acc[`${option.library}:${option.name}`] = option;
    return acc;
  },
  {}
);

const getLibraryOptions = (library: IconOption["library"]) =>
  iconOptions.filter((option) => option.library === library);

export const lucideIconOptions = getLibraryOptions("lucide");
export const flaticonIconOptions = getLibraryOptions("flaticon");
export const featherIconOptions = getLibraryOptions("feather");
export const iconoirIconOptions = getLibraryOptions("iconoir");
export const boxiconsIconOptions = getLibraryOptions("boxicons");
export const heroiconsIconOptions = getLibraryOptions("heroicons");
export const tablerIconOptions = getLibraryOptions("tabler");
export const hugeiconsIconOptions = getLibraryOptions("hugeicons");
export const lineiconsIconOptions = getLibraryOptions("lineicons");
export const fontawesomeIconOptions = getLibraryOptions("fontawesome");
