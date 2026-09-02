"use client";

import { LogoConfig } from "@/lib/logo-types";
import { buildRenderValues } from "@/components/logo/preview/render-utils";
import { LogoCanvas } from "@/components/logo/preview/logo-canvas";
import * as React from "react";

interface MiniLogoPreviewProps {
  config: LogoConfig;
  size: number;
  className?: string;
  onClick?: () => void;
}

export function MiniLogoPreview({
  config,
  size,
  className,
  onClick,
}: MiniLogoPreviewProps) {
  const renderValues = React.useMemo(() => buildRenderValues(config), [config]);
  const nativeSize = renderValues.currentSize;
  const scale = nativeSize > 0 ? size / nativeSize : 1;

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        overflow: "hidden",
        position: "relative",
        cursor: onClick ? "pointer" : "default",
        isolation: "isolate",
      }}
      onClick={onClick}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: nativeSize,
          height: nativeSize,
          display: "flex",
        }}
      >
        <LogoCanvas config={config} {...renderValues} />
      </div>
    </div>
  );
}
