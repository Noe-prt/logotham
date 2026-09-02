import * as React from "react";

import {
  ICON_CENTER_SNAP_THRESHOLD,
  LAYER_DRAG_SENSITIVITY,
} from "@/components/logo/preview/constants";

export interface UseLayerDragOptions {
  enabled: boolean;
  getInitialPosition: () => { x: number; y: number };
  onMove: (x: number, y: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onGuideStart?: () => void;
  onGuideEnd?: () => void;
  snapThreshold?: number;
  onTap?: (event: PointerEvent) => void;
}

export function useLayerDrag({
  enabled,
  getInitialPosition,
  onMove,
  onDragStart,
  onDragEnd,
  onGuideStart,
  onGuideEnd,
  snapThreshold = ICON_CENTER_SNAP_THRESHOLD,
  onTap,
}: UseLayerDragOptions) {
  return React.useCallback(
    (event: React.PointerEvent) => {
      if (!enabled) return;

      event.preventDefault();
      event.stopPropagation();

      const startX = event.clientX;
      const startY = event.clientY;
      const initial = getInitialPosition();
      let hasStartedDrag = false;

      const onPointerMove = (moveEvent: PointerEvent) => {
        moveEvent.preventDefault();

        if (!hasStartedDrag) {
          onDragStart?.();
          onGuideStart?.();
          hasStartedDrag = true;
        }

        const dx = (moveEvent.clientX - startX) * LAYER_DRAG_SENSITIVITY;
        const dy = (moveEvent.clientY - startY) * LAYER_DRAG_SENSITIVITY;

        let nextX = initial.x + dx;
        let nextY = initial.y + dy;

        if (Math.abs(nextX) <= snapThreshold) {
          nextX = 0;
        }

        if (Math.abs(nextY) <= snapThreshold) {
          nextY = 0;
        }

        onMove(nextX, nextY);
      };

      const onPointerUp = (upEvent: PointerEvent) => {
        if (hasStartedDrag) {
          onDragEnd?.();
          onGuideEnd?.();
        } else {
          onTap?.(upEvent);
        }

        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      };

      window.addEventListener("pointermove", onPointerMove, { passive: false });
      window.addEventListener("pointerup", onPointerUp);
    },
    [
      enabled,
      getInitialPosition,
      onMove,
      onDragStart,
      onDragEnd,
      onGuideStart,
      onGuideEnd,
      snapThreshold,
      onTap,
    ]
  );
}
