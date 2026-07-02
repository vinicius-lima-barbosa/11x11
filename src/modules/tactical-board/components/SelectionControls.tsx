"use client";

import type Konva from "konva";
import { Fragment, useEffect, useRef } from "react";
import { Circle, Transformer } from "react-konva";
import { useTacticalBoardStore } from "../store/tactical-board.store";
import type { DrawingShape } from "../types/tactical-board.types";

type SelectionControlsProps = {
  stageRef: React.RefObject<Konva.Stage | null>;
};

function isDrawingShape(element: unknown): element is DrawingShape {
  return (
    typeof element === "object" &&
    element !== null &&
    "type" in element &&
    (element.type === "line" ||
      element.type === "arrow" ||
      element.type === "rectangle" ||
      element.type === "circle")
  );
}

function isTransformableShape(
  shape: DrawingShape,
): shape is Extract<DrawingShape, { type: "rectangle" | "circle" }> {
  return shape.type === "rectangle" || shape.type === "circle";
}

export function SelectionControls({ stageRef }: SelectionControlsProps) {
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const activeTool = useTacticalBoardStore((state) => state.activeTool);
  const selectedElementId = useTacticalBoardStore(
    (state) => state.selectedElementId,
  );
  const elements = useTacticalBoardStore((state) => state.elements);
  const updateElement = useTacticalBoardStore((state) => state.updateElement);
  const beginElementInteraction = useTacticalBoardStore(
    (state) => state.beginElementInteraction,
  );
  const commitElementInteraction = useTacticalBoardStore(
    (state) => state.commitElementInteraction,
  );
  const selectedElement = elements.find(
    (element) => element.id === selectedElementId,
  );
  const selectedShape = isDrawingShape(selectedElement)
    ? selectedElement
    : null;

  useEffect(() => {
    const transformer = transformerRef.current;
    const stage = stageRef.current;

    if (
      !transformer ||
      !stage ||
      activeTool !== "select" ||
      !selectedShape ||
      !isTransformableShape(selectedShape)
    ) {
      transformer?.nodes([]);
      transformer?.getLayer()?.batchDraw();
      return;
    }

    const node = stage.findOne(`#${selectedShape.id}`);

    if (!node) {
      transformer.nodes([]);
      transformer.getLayer()?.batchDraw();
      return;
    }

    transformer.nodes([node]);
    transformer.getLayer()?.batchDraw();
  }, [activeTool, selectedShape, stageRef]);

  if (activeTool !== "select" || !selectedShape) {
    return null;
  }

  if (selectedShape.type === "line" || selectedShape.type === "arrow") {
    const [x1, y1, x2, y2] = selectedShape.points;

    function updatePoint(index: 0 | 1, x: number, y: number) {
      const nextPoints: [number, number, number, number] =
        index === 0 ? [x, y, x2, y2] : [x1, y1, x, y];

      updateElement(
        selectedShape!.id,
        {
          points: nextPoints,
        },
        { commit: false },
      );
    }

    return (
      <Fragment>
        {[
          { index: 0 as const, x: x1, y: y1 },
          { index: 1 as const, x: x2, y: y2 },
        ].map((handle) => (
          <Circle
            key={handle.index}
            x={handle.x}
            y={handle.y}
            radius={5}
            fill="#ffffff"
            stroke="#facc15"
            strokeWidth={1}
            draggable
            onPointerDown={(event) => {
              event.cancelBubble = true;
            }}
            onDragStart={(event) => {
              event.cancelBubble = true;
              beginElementInteraction();
            }}
            onDragMove={(event) => {
              event.cancelBubble = true;
              updatePoint(handle.index, event.target.x(), event.target.y());
            }}
            onDragEnd={(event) => {
              event.cancelBubble = true;
              updatePoint(handle.index, event.target.x(), event.target.y());
              commitElementInteraction();
            }}
          />
        ))}
      </Fragment>
    );
  }

  return (
    <Transformer
      ref={transformerRef}
      rotateEnabled={false}
      flipEnabled={false}
      anchorSize={12}
      anchorCornerRadius={6}
      borderStroke="#facc15"
      anchorFill="#ffffff"
      anchorStroke="#facc15"
      anchorStrokeWidth={3}
      boundBoxFunc={(oldBox, newBox) => {
        if (newBox.width < 12 || newBox.height < 12) {
          return oldBox;
        }

        return newBox;
      }}
      onTransformStart={(event) => {
        event.cancelBubble = true;
        beginElementInteraction();
      }}
      onTransformEnd={(event) => {
        event.cancelBubble = true;

        const node = transformerRef.current?.nodes()[0];
        if (!node) {
          return;
        }

        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scale({ x: 1, y: 1 });

        if (selectedShape.type === "rectangle") {
          const rect = node as Konva.Rect;
          updateElement(
            selectedShape.id,
            {
              x: rect.x(),
              y: rect.y(),
              width: Math.max(12, rect.width() * scaleX),
              height: Math.max(12, rect.height() * scaleY),
            },
            { commit: false },
          );
        }

        if (selectedShape.type === "circle") {
          const ellipse = node as Konva.Ellipse;
          updateElement(
            selectedShape.id,
            {
              x: ellipse.x(),
              y: ellipse.y(),
              radiusX: Math.max(6, ellipse.radiusX() * scaleX),
              radiusY: Math.max(6, ellipse.radiusY() * scaleY),
            },
            { commit: false },
          );
        }

        commitElementInteraction();
      }}
    />
  );
}
