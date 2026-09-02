#!/usr/bin/env bun

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import * as HeroIcons from "@heroicons/react/24/outline";
import * as HugeiconsIcons from "@hugeicons/core-free-icons";
import * as LucideLabIcons from "@lucide/lab";
import * as TablerIcons from "@tabler/icons-react";
import feather from "feather-icons";
import * as IconoirIcons from "iconoir-react";
import lineiconsUnicodeMap from "lineicons/assets/icon-fonts/unicodesMap.json";
import * as LucideIcons from "lucide-react";
import boxiconsIconNames from "../data/boxicons-icons.json";
import flaticonIconNames from "../data/flaticon-icons.json";
import fontawesomeIconNames from "../data/fontawesome-icons.json";
import type { IconLibrary, IconOption } from "../lib/logo-types";

type IconMap = Record<string, unknown>;

const filterIconComponentKeys = (
  iconSet: IconMap,
  extraExclusions: string[] = []
) =>
  Object.keys(iconSet).filter((key) => {
    if (extraExclusions.includes(key)) {
      return false;
    }
    const isNumber = !Number.isNaN(Number(key));
    const startsWithCapital = /^[A-Z]/.test(key);
    return !isNumber && startsWithCapital;
  });

const extractLucideLabKeys = (labSet: IconMap) =>
  Object.keys(labSet).filter((key) =>
    Array.isArray(labSet[key as keyof IconMap])
  );

const filterHugeiconsKeys = (iconSet: IconMap) =>
  Object.keys(iconSet).filter((key) => {
    if (!key.endsWith("Icon") || key.endsWith("FreeIcons")) {
      return false;
    }
    return Array.isArray(iconSet[key as keyof IconMap]);
  });

const lucideIcons = filterIconComponentKeys(LucideIcons, [
  "Icon",
  "createLucideIcon",
]);
const lucideLabIcons = extractLucideLabKeys(LucideLabIcons);
const heroicons = filterIconComponentKeys(HeroIcons);
const iconoirIcons = filterIconComponentKeys(IconoirIcons);
const featherIcons = Object.keys(feather.icons);
const tablerIcons = filterIconComponentKeys(TablerIcons);
const hugeicons = filterHugeiconsKeys(HugeiconsIcons);
const lineicons = Object.keys(lineiconsUnicodeMap as Record<string, number>);

const combinedLucideIcons = Array.from(
  new Set([...lucideIcons, ...lucideLabIcons])
);

const libraryIcons: Record<
  Exclude<IconLibrary, "custom" | "none">,
  string[]
> = {
  lucide: combinedLucideIcons,
  flaticon: flaticonIconNames,
  feather: featherIcons,
  iconoir: iconoirIcons,
  boxicons: boxiconsIconNames,
  heroicons,
  tabler: tablerIcons,
  hugeicons,
  lineicons,
  fontawesome: fontawesomeIconNames,
};

const toWords = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toTitleCase = (value: string) =>
  value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

const createIconOption = (
  name: string,
  library: IconLibrary
): IconOption | null => {
  const words = toWords(name);
  if (!words) return null;
  return {
    name,
    label: toTitleCase(words),
    library,
    searchValue: words.toLowerCase(),
  };
};

const iconOptions = Object.entries(libraryIcons)
  .flatMap(([library, icons]) =>
    icons
      .map((name) => createIconOption(name, library as IconLibrary))
      .filter(Boolean)
  )
  .filter(Boolean) as IconOption[];

const catalog = {
  generatedAt: new Date().toISOString(),
  total: iconOptions.length,
  libraries: Object.entries(libraryIcons).reduce(
    (acc, [library, icons]) => {
      acc[library as keyof typeof libraryIcons] = {
        count: icons.length,
        icons,
      };
      return acc;
    },
    {} as Record<keyof typeof libraryIcons, { count: number; icons: string[] }>
  ),
  options: iconOptions,
};

const catalogPath = resolve(process.cwd(), "data/icon-catalog.json");
writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n");

const statsPath = resolve(process.cwd(), "data/site-stats.json");
writeFileSync(
  statsPath,
  JSON.stringify({ iconsAvailable: catalog.total }, null, 2) + "\n"
);

console.log(
  `Generated ${catalog.total} icon entries → ${catalogPath} and updated site stats`
);
