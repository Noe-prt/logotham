"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { GripHorizontal, Trash2 } from "lucide-react";
import { type LogoConfig, type LogoExtraIcon } from "@/lib/logo-types";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { IconPreview } from "./helpers";

const SWAP_THRESHOLD = 40;

interface LayersManagerProps {
  config: LogoConfig;
  extraIcons: LogoExtraIcon[];
  activeLayerId: string;
  setActiveLayerId: (id: string) => void;
  handleAddExtraIcon: () => void;
  handleRemovePrimaryIcon: () => void;
  handleRemoveExtraIcon: (id: string) => void;
  displayLayerOrder: string[];
  onReorderLayers: (order: string[]) => void;
  onReorderStart?: () => void;
  onReorderEnd?: () => void;
  quickAdjustLayerId?: string | null;
  onToggleQuickAdjust?: (layerId: string) => void;
}

type DisplayEntry =
  | { key: "primary"; type: "primary" }
  | { key: string; type: "extra"; icon: LogoExtraIcon };

type DragState = {
  key: string;
  pointerId: number;
  lastSwapX: number;
  moved: boolean;
  onActivate: () => void;
};

export function LayersManager({
  config,
  extraIcons,
  activeLayerId,
  setActiveLayerId,
  handleAddExtraIcon,
  handleRemovePrimaryIcon,
  handleRemoveExtraIcon,
  displayLayerOrder,
  onReorderLayers,
  onReorderStart,
  onReorderEnd,
  quickAdjustLayerId,
  onToggleQuickAdjust,
}: LayersManagerProps) {
  const extraIconMap = React.useMemo(() => {
    return new Map(extraIcons.map((icon) => [icon.id, icon]));
  }, [extraIcons]);

  const displayEntries = React.useMemo<DisplayEntry[]>(() => {
    const entries: DisplayEntry[] = [];
    const seen = new Set<string>();

    displayLayerOrder.forEach((key) => {
      if (key === "primary") {
        entries.push({ key: "primary", type: "primary" });
        seen.add("primary");
        return;
      }
      const icon = extraIconMap.get(key);
      if (icon) {
        entries.push({ key, type: "extra", icon });
        seen.add(key);
      }
    });

    extraIcons.forEach((icon) => {
      if (!seen.has(icon.id)) {
        entries.push({ key: icon.id, type: "extra", icon });
      }
    });

    if (!seen.has("primary")) {
      entries.unshift({ key: "primary", type: "primary" });
    }

    return entries;
  }, [displayLayerOrder, extraIconMap, extraIcons]);

  const orderRef = React.useRef(displayLayerOrder);
  React.useEffect(() => {
    orderRef.current = displayLayerOrder;
  }, [displayLayerOrder]);

  const reorderActiveRef = React.useRef(false);
  const dragInfoRef = React.useRef<DragState | null>(null);
  const [draggingKey, setDraggingKey] = React.useState<string | null>(null);

  const swapLayer = React.useCallback(
    (layerKey: string, direction: number) => {
      const currentOrder = orderRef.current;
      const currentIndex = currentOrder.indexOf(layerKey);
      if (currentIndex === -1) return;
      const targetIndex = currentIndex + direction;
      if (targetIndex < 0 || targetIndex >= currentOrder.length) return;
      const nextOrder = [...currentOrder];
      const [moved] = nextOrder.splice(currentIndex, 1);
      nextOrder.splice(targetIndex, 0, moved);

      if (!reorderActiveRef.current) {
        reorderActiveRef.current = true;
        onReorderStart?.();
      }

      orderRef.current = nextOrder;
      onReorderLayers(nextOrder);
    },
    [onReorderLayers, onReorderStart]
  );

  const handlePointerDown = React.useCallback(
    (
      event: React.PointerEvent<HTMLButtonElement>,
      entryKey: string,
      onActivate: () => void
    ) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragInfoRef.current = {
        key: entryKey,
        pointerId: event.pointerId,
        lastSwapX: event.clientX,
        moved: false,
        onActivate,
      };
      setDraggingKey(entryKey);
    },
    []
  );

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>, entryKey: string) => {
      const state = dragInfoRef.current;
      if (!state || event.pointerId !== state.pointerId || state.key !== entryKey) {
        return;
      }

      const delta = event.clientX - state.lastSwapX;
      if (delta > SWAP_THRESHOLD) {
        event.preventDefault();
        swapLayer(entryKey, 1);
        dragInfoRef.current = {
          ...state,
          lastSwapX: event.clientX,
          moved: true,
        };
      } else if (delta < -SWAP_THRESHOLD) {
        event.preventDefault();
        swapLayer(entryKey, -1);
        dragInfoRef.current = {
          ...state,
          lastSwapX: event.clientX,
          moved: true,
        };
      }
    },
    [swapLayer]
  );

  const resetDragState = React.useCallback(() => {
    dragInfoRef.current = null;
    setDraggingKey(null);
  }, []);

  const handlePointerUp = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      const state = dragInfoRef.current;
      if (!state || event.pointerId !== state.pointerId) {
        return;
      }

      event.preventDefault();
      const target = event.currentTarget;
      if (target?.hasPointerCapture?.(event.pointerId)) {
        target.releasePointerCapture(event.pointerId);
      }

      if (reorderActiveRef.current) {
        reorderActiveRef.current = false;
        onReorderEnd?.();
      }

      if (!state.moved) {
        state.onActivate();
      }

      resetDragState();
    },
    [onReorderEnd, resetDragState]
  );

  const renderLayerButton = (entry: DisplayEntry, index: number) => {
    const isPrimary = entry.type === "primary";
    const isActive = isPrimary
      ? activeLayerId === "primary"
      : activeLayerId === entry.icon.id;
    const label = isPrimary ? "Primary" : `Layer ${index}`;

    const handleActivate = () => {
      if (isPrimary) {
        setActiveLayerId("primary");
      } else {
        setActiveLayerId(entry.icon.id);
      }
      onToggleQuickAdjust?.(entry.key);
    };

    const isDragging = draggingKey === entry.key;
    const isQuickOpen = quickAdjustLayerId === entry.key;

    return (
      <div key={entry.key} className="relative">
        <button
          type="button"
          onClick={handleActivate}
          onPointerDown={(event) => handlePointerDown(event, entry.key, handleActivate)}
          onPointerMove={(event) => handlePointerMove(event, entry.key)}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={cn(
            "flex flex-col items-center cursor-ew-resize gap-1 min-w-[60px] p-2 rounded-lg border transition-all select-none relative",
            isActive
              ? "bg-primary/10 border-primary ring-1 ring-primary/20"
              : "bg-card hover:bg-accent hover:text-accent-foreground border-border",
            isDragging ? "opacity-80 scale-95" : "",
            isQuickOpen ? "ring-2 ring-primary/40 border-primary" : ""
          )}
          style={{
            transition: "transform 120ms ease, opacity 120ms ease",
            transform: isDragging ? "scale(0.94)" : undefined,
          }}
          title={isPrimary ? "Primary Icon" : label}
        >
          <GripHorizontal
            className="absolute left-1/2 top-1.5 h-3 w-3 -translate-x-1/2 text-muted-foreground/70"
            aria-hidden="true"
          />
          <div className="h-6 w-6 flex items-center justify-center text-foreground">
            {isPrimary ? (
              <IconPreview
                type={config.iconType}
                name={config.iconName}
                className="h-5 w-5"
              />
            ) : (
              <IconPreview
                type={entry.icon.iconType}
                name={entry.icon.iconName}
                className="h-5 w-5"
              />
            )}
          </div>
          <span className="text-[10px] font-medium max-w-full truncate w-full text-center">
            {label}
          </span>
        </button>

        {isPrimary && config.iconType !== "none" && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleRemovePrimaryIcon();
            }}
            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-destructive shadow-sm hover:bg-destructive/10"
            title="Remove Primary Icon"
            aria-label="Remove Primary Icon"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        )}

        {!isPrimary && (
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              handleRemoveExtraIcon(entry.icon.id);
            }}
            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-destructive shadow-sm hover:bg-destructive/10"
            title="Remove Layer"
            aria-label="Remove Layer"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col">
        <Label className="text-xs text-muted-foreground">Layers</Label>
        <span className="text-[10px] text-muted-foreground/70">
          Hold & drag chips sideways to reorder
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {displayEntries.map((entry, index) => renderLayerButton(entry, index + 1))}

        <button
          type="button"
          onClick={handleAddExtraIcon}
          className="flex flex-col items-center justify-center gap-1 min-w-[60px] h-[62px] rounded-lg border border-dashed border-muted-foreground/30 hover:border-primary hover:bg-primary/5 transition-all"
          title="Add Layer"
        >
          <Plus className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
