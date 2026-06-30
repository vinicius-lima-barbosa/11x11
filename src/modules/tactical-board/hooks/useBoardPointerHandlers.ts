"use client";

import { nanoid } from "nanoid";
import { useCallback, useState } from "react";
import type Konva from "konva";
import type { BoardElement, DrawingShape, Point } from "../types/tactical-board.types";
import { useTacticalBoardStore } from "../store/tactical-board.store";
import { isMeaningfulShape, normalizeCircle, normalizeRectangle } from "../utils/geometry";

const DEFAULT_STROKE = "#f8fafc";
const DEFAULT_STROKE_WIDTH = 5;
const TRANSPARENT_FILL = "rgba(255,255,255,0)";

function createShape(tool: "line" | "arrow" | "rectangle" | "circle", start: Point, end: Point): DrawingShape {
  if (tool === "line" || tool === "arrow") {
    return {
      id: nanoid(),
      type: tool,
      points: [start.x, start.y, end.x, end.y],
      stroke: DEFAULT_STROKE,
      strokeWidth: DEFAULT_STROKE_WIDTH,
    };
  }

  if (tool === "rectangle") {
    return {
      id: nanoid(),
      type: "rectangle",
      ...normalizeRectangle(start, end),
      stroke: DEFAULT_STROKE,
      strokeWidth: DEFAULT_STROKE_WIDTH,
      fill: TRANSPARENT_FILL,
    };
  }

  return {
    id: nanoid(),
    type: "circle",
    ...normalizeCircle(start, end),
    stroke: DEFAULT_STROKE,
    strokeWidth: DEFAULT_STROKE_WIDTH,
    fill: TRANSPARENT_FILL,
  };
}

type UseBoardPointerHandlersParams = {
  stageRef: React.RefObject<Konva.Stage | null>;
};

export function useBoardPointerHandlers({ stageRef }: UseBoardPointerHandlersParams) {
  const activeTool = useTacticalBoardStore((state) => state.activeTool);
  const addElement = useTacticalBoardStore((state) => state.addElement);
  const selectElement = useTacticalBoardStore((state) => state.selectElement);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [previewShape, setPreviewShape] = useState<DrawingShape | null>(null);

  const getLogicalPointerPosition = useCallback((): Point | null => {
    const stage = stageRef.current;
    const pointer = stage?.getPointerPosition();

    if (!stage || !pointer) {
      return null;
    }

    const scaleX = stage.scaleX() || 1;
    const scaleY = stage.scaleY() || 1;

    return {
      x: pointer.x / scaleX,
      y: pointer.y / scaleY,
    };
  }, [stageRef]);

  const handlePointerDown = useCallback(
    (event: Konva.KonvaEventObject<PointerEvent>) => {
      const point = getLogicalPointerPosition();
      if (!point) {
        return;
      }

      if (activeTool === "select") {
        if (event.target === event.target.getStage()) {
          selectElement(null);
        }
        return;
      }

      if (activeTool === "eraser") {
        return;
      }

      setStartPoint(point);
      setPreviewShape(createShape(activeTool, point, point));
    },
    [activeTool, getLogicalPointerPosition, selectElement],
  );

  const handlePointerMove = useCallback(() => {
    if (!startPoint || activeTool === "select" || activeTool === "eraser") {
      return;
    }

    const point = getLogicalPointerPosition();
    if (!point) {
      return;
    }

    setPreviewShape(createShape(activeTool, startPoint, point));
  }, [activeTool, getLogicalPointerPosition, startPoint]);

  const handlePointerUp = useCallback(() => {
    if (!previewShape) {
      return;
    }

    if (isMeaningfulShape(previewShape as BoardElement)) {
      addElement(previewShape);
    }

    setStartPoint(null);
    setPreviewShape(null);
  }, [addElement, previewShape]);

  return {
    previewShape,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
