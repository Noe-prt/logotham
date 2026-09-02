"use client";

import { Spinner } from "@/components/ui/spinner";
import { useIconComponent } from "@/hooks/use-icon-component";
import { libraryHasComponents } from "@/lib/icon-loader";
import {
  boxiconsIconOptions,
  featherIconOptions,
  flaticonIconOptions,
  fontawesomeIconOptions,
  heroiconsIconOptions,
  hugeiconsIconOptions,
  iconoirIconOptions,
  iconOptions,
  lineiconsIconOptions,
  lucideIconOptions,
  tablerIconOptions,
} from "@/lib/icon-metadata";
import type { IconLibrary, IconOption } from "@/lib/logo-types";
import { cn } from "@/lib/utils";
import feather from "feather-icons";
import { Plus } from "lucide-react";
import React from "react";

export type LibraryFilter =
  | "all"
  | "lucide"
  | "flaticon"
  | "feather"
  | "iconoir"
  | "boxicons"
  | "heroicons"
  | "tabler"
  | "hugeicons"
  | "lineicons"
  | "fontawesome";

export const iconLibraryMap: Record<LibraryFilter, IconOption[]> = {
  all: iconOptions,
  lucide: lucideIconOptions,
  flaticon: flaticonIconOptions,
  feather: featherIconOptions,
  iconoir: iconoirIconOptions,
  boxicons: boxiconsIconOptions,
  heroicons: heroiconsIconOptions,
  tabler: tablerIconOptions,
  hugeicons: hugeiconsIconOptions,
  lineicons: lineiconsIconOptions,
  fontawesome: fontawesomeIconOptions,
};

export const normalizeSearchInput = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target?.result as string);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

export const IconPreview = ({
  type,
  name,
  className,
}: {
  type: string;
  name: string;
  className?: string;
}) => {
  const isComponentLibrary = libraryHasComponents(type as IconLibrary);
  const IconComponent = useIconComponent(type as IconLibrary, name);

  if (isComponentLibrary) {
    return IconComponent
      ? React.createElement(IconComponent, { className })
      : React.createElement(Spinner, { className });
  }

  if (type === "feather") {
    return (
      <div
        className={cn("flex items-center justify-center", className)}
        dangerouslySetInnerHTML={{
          __html:
            feather.icons[name as keyof typeof feather.icons]?.toSvg({
              width: 16,
              height: 16,
              "stroke-width": 2,
              color: "currentColor",
            }) || "",
        }}
      />
    );
  }

  if (type === "lineicons") {
    return (
      <i
        className={cn("lni", name, "leading-none text-base", className)}
        aria-hidden="true"
      />
    );
  }

  if (type === "custom") {
    return <span className={cn("font-bold text-xs", className)}>SVG</span>;
  }

  if (type === "none") {
    return (
      <span
        className={cn(
          "flex items-center justify-center rounded-full border border-dashed border-muted-foreground/40 text-muted-foreground bg-muted/20",
          className
        )}
      >
        <Plus className="h-3 w-3" aria-hidden="true" />
      </span>
    );
  }

  return (
    <i
      className={cn(
        type === "boxicons"
          ? `bx ${name} leading-none`
          : `fi fi-rr-${name} leading-none`,
        className
      )}
    />
  );
};
