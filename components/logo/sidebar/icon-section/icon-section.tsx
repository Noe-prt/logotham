"use client";

import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
import { iconOptionMap } from "@/lib/icon-metadata";
import {
  type IconOption,
  type LogoConfig,
  type LogoExtraIcon,
} from "@/lib/logo-types";
import * as React from "react";
import { getValue, SidebarSectionProps } from "../types";
import {
  iconLibraryMap,
  LibraryFilter,
  normalizeSearchInput,
  readFileContent,
} from "./helpers";
import type { IconPickerProps } from "./icon-picker";
import { LayersManager } from "./layers-manager";
import { QuickLayerAdjustPanel } from "./quick-layer-adjust-panel";
import { clampStrokeWidth, extractSvgAppearance } from "./svg-helpers";
import { StrokeControls } from "./stroke-controls";
import { TransformControls } from "./transform-controls";

const IconPicker = dynamic<IconPickerProps>(
  () => import("./icon-picker").then((mod) => mod.IconPicker),
  {
    ssr: false,
    loading: () => (
      <button className="w-full h-10 rounded-md border border-muted bg-muted/40 text-xs text-muted-foreground animate-pulse">
        Loading icons...
      </button>
    ),
  }
);

interface IconSectionProps extends SidebarSectionProps {
  activeLayerId: string;
  setActiveLayerId: (id: string) => void;
}

export function IconSection({
  config,
  updateConfig,
  saveHistorySnapshot,
  activeLayerId,
  setActiveLayerId,
}: IconSectionProps) {
  const [pickerSearch, setPickerSearch] = React.useState("");
  const [visibleIconsCount, setVisibleIconsCount] = React.useState(100);
  const [isPickerOpen, setIsPickerOpen] = React.useState(false);
  const [selectedLibrary, setSelectedLibrary] =
    React.useState<LibraryFilter>("all");
  const [quickAdjustLayerId, setQuickAdjustLayerId] = React.useState<
    string | null
  >(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const reorderSnapshotRef = React.useRef(false);

  React.useEffect(() => {
    if (isPickerOpen) {
      setSelectedLibrary("all");
    }
  }, [isPickerOpen]);

  const extraIcons = React.useMemo(
    () => config.extraIcons ?? [],
    [config.extraIcons]
  );

  const toggleQuickAdjust = React.useCallback((layerId: string) => {
    setQuickAdjustLayerId((prev) => (prev === layerId ? null : layerId));
  }, []);

  React.useEffect(() => {
    if (!quickAdjustLayerId) return;
    if (quickAdjustLayerId === "primary") {
      if (config.iconType === "none") {
        setQuickAdjustLayerId(null);
      }
      return;
    }
    if (!extraIcons.some((icon) => icon.id === quickAdjustLayerId)) {
      setQuickAdjustLayerId(null);
    }
  }, [quickAdjustLayerId, config.iconType, extraIcons]);

  const buildLayerOrder = React.useCallback(
    (icons: LogoExtraIcon[] = extraIcons) => {
      const defaultOrder = ["primary", ...icons.map((icon) => icon.id)];
      const stored = Array.isArray(config.layerOrder)
        ? config.layerOrder.filter(
            (key) => key === "primary" || icons.some((icon) => icon.id === key)
          )
        : [];
      const merged = [...stored];
      defaultOrder.forEach((key) => {
        if (!merged.includes(key)) {
          merged.push(key);
        }
      });
      return merged;
    },
    [config.layerOrder, extraIcons]
  );

  const canonicalLayerOrder = React.useMemo(
    () => buildLayerOrder(),
    [buildLayerOrder]
  );

  const displayLayerOrder = React.useMemo(() => {
    return config.invertLayerOrder
      ? [...canonicalLayerOrder].reverse()
      : canonicalLayerOrder;
  }, [canonicalLayerOrder, config.invertLayerOrder]);

  const handleReorderLayers = React.useCallback(
    (nextDisplayOrder: string[]) => {
      const canonical = config.invertLayerOrder
        ? [...nextDisplayOrder].reverse()
        : nextDisplayOrder;
      updateConfig({ layerOrder: canonical });
    },
    [config.invertLayerOrder, updateConfig]
  );

  const handleReorderStart = React.useCallback(() => {
    if (!reorderSnapshotRef.current) {
      reorderSnapshotRef.current = true;
      saveHistorySnapshot();
    }
  }, [saveHistorySnapshot]);

  const handleReorderEnd = React.useCallback(() => {
    reorderSnapshotRef.current = false;
  }, []);

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

  const updateExtraIcon = React.useCallback(
    (id: string, partial: Partial<LogoExtraIcon>) => {
      const nextIcons = extraIcons.map((icon) =>
        icon.id === id ? { ...icon, ...partial } : icon
      );
      updateConfig({ extraIcons: nextIcons });
    },
    [extraIcons, updateConfig]
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await readFileContent(file);
      if (!content.includes("<svg")) {
        alert("Please upload a valid SVG file.");
        return;
      }

      saveHistorySnapshot();
      const updates: Partial<LogoConfig> & Partial<LogoExtraIcon> = {
        iconType: "custom" as const,
        iconName: file.name,
        customIcon: content,
        customIconPreserveStyles: true,
      };

      const appearance = extractSvgAppearance(content);
      if (appearance) {
        if (appearance.strokeColor) {
          updates.iconColor = appearance.strokeColor;
          updates.iconColorMode = "solid";
        } else if (appearance.strokeIsNone) {
          updates.iconOpacity = [0];
        }
        if (typeof appearance.strokeWidth === "number") {
          updates.strokeWidth = [clampStrokeWidth(appearance.strokeWidth)];
        }
        if (appearance.fillColor) {
          updates.iconFillColor = appearance.fillColor;
          updates.iconFillColorMode = "solid";
          updates.iconFillOpacity = [100];
        } else if (appearance.fillIsNone) {
          updates.iconFillOpacity = [0];
        }
      }

      if (activeLayerId === "primary") {
        updateConfig(updates);
      } else {
        updateExtraIcon(activeLayerId, updates);
      }
      setIsPickerOpen(false);
    } catch (error) {
      console.error("Failed to read file", error);
    }
  };

  const filteredIcons = React.useMemo(() => {
    const libraryIcons = iconLibraryMap[selectedLibrary];
    const normalizedQuery = normalizeSearchInput(pickerSearch);
    if (!normalizedQuery) return libraryIcons;
    const terms = normalizedQuery.split(" ");
    return libraryIcons.filter((option) =>
      terms.every((term) => option.searchValue.includes(term))
    );
  }, [pickerSearch, selectedLibrary]);

  const visibleIcons = React.useMemo(() => {
    return filteredIcons.slice(0, visibleIconsCount);
  }, [filteredIcons, visibleIconsCount]);

  React.useEffect(() => {
    setVisibleIconsCount(100);
  }, [pickerSearch, selectedLibrary]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      setVisibleIconsCount((prev) => Math.min(prev + 50, filteredIcons.length));
    }
  };

  const handleIconSelect = React.useCallback(
    (icon: IconOption) => {
      saveHistorySnapshot();
      if (activeLayerId !== "primary") {
        const nextIcons = extraIcons.map((item) =>
          item.id === activeLayerId
            ? {
                ...item,
                iconType: icon.library,
                iconName: icon.name,
                customIconPreserveStyles:
                  icon.library === "custom"
                    ? item.customIconPreserveStyles ?? false
                    : false,
              }
            : item
        );
        updateConfig({ extraIcons: nextIcons });
      } else {
        updateConfig({
          iconType: icon.library,
          iconName: icon.name,
          customIconPreserveStyles:
            icon.library === "custom"
              ? config.customIconPreserveStyles
              : false,
        });
      }
    },
    [
      activeLayerId,
      extraIcons,
      saveHistorySnapshot,
      updateConfig,
      config.customIconPreserveStyles,
    ]
  );

  const handleAddExtraIcon = React.useCallback(() => {
    saveHistorySnapshot();
    const defaultSize = Math.min(Math.max(getValue(config.iconSize), 20), 150);
    const newId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `extra-${Date.now()}-${Math.round(Math.random() * 1000)}`;

    const newIcon: LogoExtraIcon = {
      id: newId,
      iconType: config.iconType,
      iconName: config.iconName,
      size: defaultSize,
      position: { x: 0, y: 0 },
      rotate: 0,
      customIconPreserveStyles:
        config.iconType === "custom"
          ? config.customIconPreserveStyles ?? false
          : undefined,
    };
    const updatedIcons = [...extraIcons, newIcon];
    updateConfig({
      extraIcons: updatedIcons,
      layerOrder: buildLayerOrder(updatedIcons),
    });
    setActiveLayerId(newId);
  }, [
    config.iconName,
    config.iconSize,
    config.iconType,
    config.customIconPreserveStyles,
    extraIcons,
    buildLayerOrder,
    saveHistorySnapshot,
    setActiveLayerId,
    updateConfig,
  ]);

  const handleRemoveExtraIcon = React.useCallback(
    (id: string) => {
      saveHistorySnapshot();
      const filteredIcons = extraIcons.filter((icon) => icon.id !== id);
      updateConfig({
        extraIcons: filteredIcons,
        layerOrder: buildLayerOrder(filteredIcons),
      });
      if (activeLayerId === id) {
        setActiveLayerId("primary");
      }
    },
    [
      activeLayerId,
      extraIcons,
      buildLayerOrder,
      saveHistorySnapshot,
      setActiveLayerId,
      updateConfig,
    ]
  );

  const handleRemovePrimaryIcon = React.useCallback(() => {
    saveHistorySnapshot();
    updateConfig({ iconType: "none" });
  }, [saveHistorySnapshot, updateConfig]);

  const activeLayer =
    activeLayerId === "primary"
      ? null
      : extraIcons.find((i) => i.id === activeLayerId);

  const currentIconType = activeLayer ? activeLayer.iconType : config.iconType;
  const currentIconName = activeLayer ? activeLayer.iconName : config.iconName;
  const currentIconLabel =
    iconOptionMap[`${currentIconType}:${currentIconName}`]?.label ??
    currentIconName;

  return (
    <section className="space-y-6">
      <LayersManager
        config={config}
        extraIcons={extraIcons}
        activeLayerId={activeLayerId}
        setActiveLayerId={setActiveLayerId}
        handleAddExtraIcon={handleAddExtraIcon}
        handleRemovePrimaryIcon={handleRemovePrimaryIcon}
        handleRemoveExtraIcon={handleRemoveExtraIcon}
        displayLayerOrder={displayLayerOrder}
        onReorderLayers={handleReorderLayers}
        onReorderStart={handleReorderStart}
        onReorderEnd={handleReorderEnd}
        quickAdjustLayerId={quickAdjustLayerId}
        onToggleQuickAdjust={toggleQuickAdjust}
      />
      {quickAdjustLayerId && (
        <QuickLayerAdjustPanel
          key={quickAdjustLayerId}
          layerId={quickAdjustLayerId}
          config={config}
          extraIcons={extraIcons}
          updateConfig={updateConfig}
          updateExtraIcon={updateExtraIcon}
          saveHistorySnapshot={saveHistorySnapshot}
          onClose={() => setQuickAdjustLayerId(null)}
        />
      )}

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label className="text-xs text-muted-foreground">
            {activeLayerId === "primary" ? "Primary Icon" : "Layer Icon"}
          </Label>
          <IconPicker
            isPickerOpen={isPickerOpen}
            setIsPickerOpen={setIsPickerOpen}
            selectedLibrary={selectedLibrary}
            setSelectedLibrary={setSelectedLibrary}
            pickerSearch={pickerSearch}
            setPickerSearch={setPickerSearch}
            filteredIcons={filteredIcons}
            visibleIcons={visibleIcons}
            handleScroll={handleScroll}
            currentIconType={currentIconType}
            currentIconName={currentIconName}
            currentIconLabel={currentIconLabel}
            handleIconSelect={handleIconSelect}
            handleFileUpload={handleFileUpload}
            fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
          />
        </div>

        <StrokeControls
          config={config}
          updateConfig={updateConfig}
          saveHistorySnapshot={saveHistorySnapshot}
          activeLayerId={activeLayerId}
          updateExtraIcon={updateExtraIcon}
          currentIconType={currentIconType}
          disableCustomIconPreserve={disableCustomIconPreserve}
        />

        <TransformControls
          config={config}
          updateConfig={updateConfig}
          saveHistorySnapshot={saveHistorySnapshot}
          activeLayerId={activeLayerId}
          updateExtraIcon={updateExtraIcon}
          currentIconType={currentIconType}
          disableCustomIconPreserve={disableCustomIconPreserve}
        />
      </div>
    </section>
  );
}
