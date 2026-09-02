"use client";

import { LogoExtraIcon } from "@/lib/logo-types";
import * as React from "react";
import { BackgroundSection } from "./background-section";
import { IconColorControls } from "./icon-section/icon-color-controls";
import { FillControls } from "./icon-section/fill-controls";
import { SidebarSectionProps } from "./types";

interface ColorSectionProps extends SidebarSectionProps {
  activeLayerId: string;
}

export function ColorSection({
  config,
  updateConfig,
  saveHistorySnapshot,
  activeLayerId,
}: ColorSectionProps) {
  const extraIcons = React.useMemo(
    () => config.extraIcons ?? [],
    [config.extraIcons]
  );

  const updateExtraIcon = React.useCallback(
    (id: string, partial: Partial<LogoExtraIcon>) => {
      const nextIcons = extraIcons.map((icon) =>
        icon.id === id ? { ...icon, ...partial } : icon
      );
      updateConfig({ extraIcons: nextIcons });
    },
    [extraIcons, updateConfig]
  );

  const setCustomIconPreserve = React.useCallback(
    (layerId: string, shouldPreserve: boolean) => {
      if (layerId === "primary") {
        if (config.iconType !== "custom") return;
        if (config.customIconPreserveStyles === shouldPreserve) return;
        updateConfig({ customIconPreserveStyles: shouldPreserve });
        return;
      }

      const target = extraIcons.find((icon) => icon.id === layerId);
      if (!target || target.iconType !== "custom") return;
      if (target.customIconPreserveStyles === shouldPreserve) return;
      const nextIcons = extraIcons.map((icon) =>
        icon.id === layerId
          ? { ...icon, customIconPreserveStyles: shouldPreserve }
          : icon
      );
      updateConfig({ extraIcons: nextIcons });
    },
    [config.iconType, config.customIconPreserveStyles, extraIcons, updateConfig]
  );

  const disableCustomIconPreserve = React.useCallback(
    (layerId: string) => {
      setCustomIconPreserve(layerId, false);
    },
    [setCustomIconPreserve]
  );

  const activeLayer =
    activeLayerId === "primary"
      ? null
      : extraIcons.find((i) => i.id === activeLayerId);

  const currentIconType = activeLayer ? activeLayer.iconType : config.iconType;

  const iconProps = {
    config,
    updateConfig,
    saveHistorySnapshot,
    activeLayerId,
    updateExtraIcon,
    currentIconType,
    disableCustomIconPreserve,
  };

  return (
    <div className="space-y-6">
      <BackgroundSection
        config={config}
        updateConfig={updateConfig}
        saveHistorySnapshot={saveHistorySnapshot}
      />
      <div className="h-px bg-border" />
      <IconColorControls {...iconProps} />
      <div className="h-px bg-border" />
      <FillControls {...iconProps} />
    </div>
  );
}
