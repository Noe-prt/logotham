"use client";

import type { IconLibrary } from "./logo-types";
import type { LucideProps } from "lucide-react";
import * as React from "react";
import {
  createLucideIcon,
  icons as LucideIconsObj,
} from "lucide-react";
import * as LucideReactModule from "lucide-react";
import * as LucideLabIcons from "@lucide/lab";

type IconComponent = React.ComponentType<LucideProps>;
type IconMap = Record<string, IconComponent>;
type IconNodeArray = Parameters<typeof createLucideIcon>[1];

const componentLibraries: IconLibrary[] = [
  "lucide",
  "iconoir",
  "heroicons",
  "tabler",
  "hugeicons",
  "fontawesome",
];

const withSvgChildrenSupport = (Component: IconComponent): IconComponent => {
  const Wrapped = React.forwardRef<SVGSVGElement, LucideProps>(
    ({ children, ...props }, ref) => {
      const extraChildren = React.Children.toArray(children);
      if (extraChildren.length === 0) {
        return React.createElement(Component, { ...props, ref });
      }

      const element = React.createElement(Component, { ...props, ref });
      if (!React.isValidElement(element)) {
        return element;
      }

      const existingChildren = React.Children.toArray(element.props.children);
      return React.cloneElement(element, undefined, [
        ...extraChildren,
        ...existingChildren,
      ]);
    }
  );

  const originalName = Component.displayName ?? Component.name ?? "Icon";
  Wrapped.displayName = `WithSvgChildren(${originalName})`;

  return Wrapped as IconComponent;
};

const filterIcons = (iconSet: Record<string, unknown>) =>
  Object.keys(iconSet).filter(
    (key) =>
      isNaN(Number(key)) &&
      key !== "createLucideIcon" &&
      key !== "Icon" &&
      key !== "default" &&
      /^[A-Z]/.test(key)
  );

const filterHugeicons = (iconSet: Record<string, unknown>) =>
  Object.keys(iconSet).filter((key) => {
    if (!key.endsWith("Icon") || key.endsWith("FreeIcons")) {
      return false;
    }
    const value = iconSet[key];
    return Array.isArray(value);
  });

const buildIconComponentMap = (
  iconSet: Record<string, unknown>,
  names: string[],
  options?: { wrapWithChildren?: boolean }
): IconMap => {
  const map: IconMap = {};
  names.forEach((name) => {
    const component = iconSet[name];
    if (!component) return;
    const typed = component as IconComponent;
    map[name] = options?.wrapWithChildren
      ? withSvgChildrenSupport(typed)
      : typed;
  });
  return map;
};

const lucideExportBlocklist = new Set(["createLucideIcon", "icons", "Icon", "default", "LucideIcon"]);

const isReactComponent = (value: unknown): value is IconComponent => {
  if (!value) return false;
  if (typeof value === "function") return true;
  if (typeof value === "object") {
    return "render" in (value as Record<string, unknown>);
  }
  return false;
};

const lucideNameVariants = (name: string): string[] => {
  const variants = new Set<string>();
  const queue = [name];

  while (queue.length > 0) {
    const current = queue.pop();
    if (!current || variants.has(current)) continue;
    variants.add(current);

    if (current.startsWith("Lucide")) {
      queue.push(current.slice("Lucide".length));
    }
    if (current.endsWith("Icon")) {
      queue.push(current.slice(0, -4));
    }
  }

  return Array.from(variants);
};

const buildWrappedLucideIcons = (): IconMap => {
  const map: IconMap = {};
  Object.entries(LucideIconsObj as Record<string, unknown>).forEach(
    ([name, component]) => {
      if (!component) return;
      map[name] = withSvgChildrenSupport(component as IconComponent);
    }
  );

  Object.keys(LucideLabIcons).forEach((key) => {
    const iconNode = (LucideLabIcons as Record<string, unknown>)[key];
    if (Array.isArray(iconNode)) {
      const labComponent = createLucideIcon(key, iconNode as IconNodeArray);
      map[key] = withSvgChildrenSupport(labComponent);
    }
  });

  Object.entries(LucideReactModule).forEach(([name, component]) => {
    if (!/^[A-Z]/.test(name)) return;
    if (lucideExportBlocklist.has(name)) return;
    if (!isReactComponent(component)) return;
    if (map[name]) return;
    map[name] = withSvgChildrenSupport(component as IconComponent);
  });

  return map;
};

const createFontAwesomeComponent = (
  iconName: string,
  fas: Record<
    string,
    {
      icon: [number, number, unknown, unknown, string | string[]];
    }
  >
): IconComponent => {
  const def = fas[iconName];
  if (!def) {
    return (() => null) as unknown as IconComponent;
  }
  const [width, height, , , path] = def.icon;

  const Component = React.forwardRef<SVGSVGElement, LucideProps>(
    ({ size, color, strokeWidth, fill, children, style, ...props }, ref) => {
      return React.createElement(
        "svg",
        {
          viewBox: `0 0 ${width} ${height}`,
          width: size,
          height: size,
          fill: fill || "currentColor",
          stroke: props.stroke || "none",
          strokeWidth,
          style: { ...style, color },
          ref,
          ...props,
        },
        React.createElement("path", {
          d: path as string,
          fill: "currentColor",
        }),
        children
      );
    }
  );

  Component.displayName = `FA(${iconName})`;
  return withSvgChildrenSupport(Component);
};

const buildHugeiconsMap = (
  HugeiconsIcons: Record<string, unknown>
): IconMap => {
  const names = filterHugeicons(HugeiconsIcons);
  const map: IconMap = {};

  names.forEach((key) => {
    const iconNode = HugeiconsIcons[key];
    if (!Array.isArray(iconNode)) return;
    const sanitizedNode = (iconNode as IconNodeArray).map(([tag, attrs]) => {
      const rest = { ...(attrs as Record<string, unknown>) };
      delete rest.stroke;
      delete rest.fill;
      return [tag, rest] as [string, Record<string, unknown>];
    }) as IconNodeArray;

    const component = createLucideIcon(key, sanitizedNode);
    map[key] = withSvgChildrenSupport(component);
  });

  return map;
};

const lucideIconsPromise = Promise.resolve(buildWrappedLucideIcons());

const libraryLoaders: Partial<Record<IconLibrary, () => Promise<IconMap>>> = {
  lucide: () => lucideIconsPromise,
  iconoir: async () => {
    const IconoirIcons = await import("iconoir-react");
    return buildIconComponentMap(IconoirIcons, filterIcons(IconoirIcons), {
      wrapWithChildren: true,
    });
  },
  heroicons: async () => {
    const HeroIcons = await import("@heroicons/react/24/outline");
    return buildIconComponentMap(HeroIcons, filterIcons(HeroIcons), {
      wrapWithChildren: true,
    });
  },
  tabler: async () => {
    const TablerIcons = await import("@tabler/icons-react");
    return buildIconComponentMap(TablerIcons, filterIcons(TablerIcons), {
      wrapWithChildren: true,
    });
  },
  hugeicons: async () => {
    const HugeiconsIcons = await import("@hugeicons/core-free-icons");
    return buildHugeiconsMap(HugeiconsIcons);
  },
  fontawesome: async () => {
    const { fas } = await import("@fortawesome/free-solid-svg-icons");
    const map: IconMap = {};
    Object.keys(fas).forEach((name) => {
      map[name] = createFontAwesomeComponent(name, fas);
    });
    return map;
  },
};

const libraryCache: Partial<Record<IconLibrary, Promise<IconMap>>> = {
  lucide: lucideIconsPromise,
};

export const libraryHasComponents = (library: IconLibrary) =>
  componentLibraries.includes(library);

export const loadIconLibrary = (library: IconLibrary): Promise<IconMap> => {
  if (!libraryHasComponents(library)) {
    return Promise.resolve({});
  }
  if (!libraryCache[library]) {
    const loader = libraryLoaders[library];
    libraryCache[library] = loader ? loader() : Promise.resolve({});
  }
  return libraryCache[library]!;
};

export const loadIconComponent = async (
  library: IconLibrary,
  iconName: string
) => {
  if (!libraryHasComponents(library)) {
    return undefined;
  }
  const icons = await loadIconLibrary(library);
  if (library !== "lucide") {
    return icons[iconName];
  }

  const candidates = lucideNameVariants(iconName);
  for (const candidate of candidates) {
    const component = icons[candidate];
    if (component) {
      if (candidate !== iconName) {
        icons[iconName] = component;
      }
      return component;
    }
  }
  return undefined;
};
