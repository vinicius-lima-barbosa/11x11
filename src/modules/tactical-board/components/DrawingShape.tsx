"use client";

import { memo } from "react";
import { Arrow, Ellipse, Line, Rect } from "react-konva";
import type Konva from "konva";
import type { DrawingShape as DrawingShapeType } from "../types/tactical-board.types";
import { useTacticalBoardStore } from "../store/tactical-board.store";

type DrawingShapeProps = {
  shape: DrawingShapeType;
  isPreview?: boolean;
};

function DrawingShapeComponent({ shape, isPreview = false }: DrawingShapeProps) {
  const activeTool = useTacticalBoardStore((state) => state.activeTool);
  const selectedElementId = useTacticalBoardStore((state) => state.selectedElementId);
  const selectElement = useTacticalBoardStore((state) => state.selectElement);
  const updateElement = useTacticalBoardStore((state) => state.updateElement);
  const removeElement = useTacticalBoardStore((state) => state.removeElement);
  const isSelected = selectedElementId === shape.id;
  const isInteractive = !isPreview && (activeTool === "select" || activeTool === "eraser");
  const stroke = isSelected ? "#facc15" : shape.stroke;

  function handleClick(event: Konva.KonvaEventObject<MouseEvent | TouchEvent>) {
    if (isPreview) {
      return;
    }

    event.cancelBubble = true;

    if (activeTool === "eraser") {
      removeElement(shape.id);
      return;
    }

    if (activeTool === "select") {
      selectElement(shape.id);
    }
  }

  function handleLineDragEnd(event: Konva.KonvaEventObject<DragEvent>) {
    if (shape.type !== "line" && shape.type !== "arrow") {
      return;
    }

    const dx = event.target.x();
    const dy = event.target.y();
    const [x1, y1, x2, y2] = shape.points;
    event.target.position({ x: 0, y: 0 });
    updateElement(shape.id, {
      points: [x1 + dx, y1 + dy, x2 + dx, y2 + dy],
    });
  }

  if (shape.type === "line") {
    return (
      <Line
        id={shape.id}
        points={shape.points}
        stroke={stroke}
        strokeWidth={shape.strokeWidth}
        lineCap="round"
        lineJoin="round"
        draggable={activeTool === "select" && !isPreview}
        listening={isInteractive}
        perfectDrawEnabled={false}
        opacity={isPreview ? 0.75 : 1}
        hitStrokeWidth={24}
        onClick={handleClick}
        onTap={handleClick}
        onDragEnd={handleLineDragEnd}
      />
    );
  }

  if (shape.type === "arrow") {
    return (
      <Arrow
        id={shape.id}
        points={shape.points}
        stroke={stroke}
        fill={stroke}
        strokeWidth={shape.strokeWidth}
        pointerLength={18}
        pointerWidth={18}
        lineCap="round"
        lineJoin="round"
        draggable={activeTool === "select" && !isPreview}
        listening={isInteractive}
        perfectDrawEnabled={false}
        opacity={isPreview ? 0.75 : 1}
        hitStrokeWidth={24}
        onClick={handleClick}
        onTap={handleClick}
        onDragEnd={handleLineDragEnd}
      />
    );
  }

  if (shape.type === "rectangle") {
    return (
      <Rect
        id={shape.id}
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        fill={shape.fill}
        stroke={stroke}
        strokeWidth={shape.strokeWidth}
        draggable={activeTool === "select" && !isPreview}
        listening={isInteractive}
        perfectDrawEnabled={false}
        opacity={isPreview ? 0.75 : 1}
        onClick={handleClick}
        onTap={handleClick}
        onDragEnd={(event) => updateElement(shape.id, { x: event.target.x(), y: event.target.y() })}
      />
    );
  }

  return (
    <Ellipse
      id={shape.id}
      x={shape.x}
      y={shape.y}
      radiusX={shape.radiusX}
      radiusY={shape.radiusY}
      fill={shape.fill}
      stroke={stroke}
      strokeWidth={shape.strokeWidth}
      draggable={activeTool === "select" && !isPreview}
      listening={isInteractive}
      perfectDrawEnabled={false}
      opacity={isPreview ? 0.75 : 1}
      onClick={handleClick}
      onTap={handleClick}
      onDragEnd={(event) => updateElement(shape.id, { x: event.target.x(), y: event.target.y() })}
    />
  );
}

export const DrawingShape = memo(DrawingShapeComponent);
