"use client";

import * as React from "react";
import { loadIconComponent, libraryHasComponents } from "@/lib/icon-loader";
import type { IconLibrary } from "@/lib/logo-types";
import type { LucideProps } from "lucide-react";

type IconComponent = React.ComponentType<LucideProps>;

export function useIconComponent(
  library: IconLibrary,
  iconName: string
): IconComponent | null {
  const [component, setComponent] = React.useState<IconComponent | null>(null);

  React.useEffect(() => {
    let mounted = true;

    if (!libraryHasComponents(library)) {
      setComponent(null);
      return () => {
        mounted = false;
      };
    }

    loadIconComponent(library, iconName).then((Icon) => {
      if (!mounted) return;
      setComponent(Icon ?? null);
    });

    return () => {
      mounted = false;
    };
  }, [library, iconName]);

  return component;
}
