"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import type Konva from "konva";
import { BOARD_HEIGHT, BOARD_WIDTH, type BallToken, type DrawingShape as DrawingShapeType, type PlayerToken as PlayerTokenType } from "../types/tactical-board.types";
import { useTacticalBoardStore } from "../store/tactical-board.store";
import { useBoardPointerHandlers } from "../hooks/useBoardPointerHandlers";
import { FootballPitch } from "./FootballPitch";
import { DrawingShape } from "./DrawingShape";
import { PlayerToken } from "./PlayerToken";

type BoardStageProps = {
  stageRef: React.RefObject<Konva.Stage | null>;
};

function isDrawingShape(element: unknown): element is DrawingShapeType {
  return (
    typeof element === "object" &&
    element !== null &&
    "type" in element &&
    (element.type === "line" || element.type === "arrow" || element.type === "rectangle" || element.type === "circle")
  );
}

function isToken(element: unknown): element is PlayerTokenType | BallToken {
  return typeof element === "object" && element !== null && "type" in element && (element.type === "player" || element.type === "ball");
}

export function BoardStage({ stageRef }: BoardStageProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.75);
  const activeTool = useTacticalBoardStore((state) => state.activeTool);
  const elements = useTacticalBoardStore((state) => state.elements);
  const drawings = useMemo(() => elements.filter(isDrawingShape), [elements]);
  const tokens = useMemo(() => elements.filter(isToken), [elements]);
  const { previewShape, handlePointerDown, handlePointerMove, handlePointerUp } = useBoardPointerHandlers({ stageRef });
  const shouldListenForElementEvents = activeTool === "select" || activeTool === "eraser";

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }
    const observedWrapper = wrapper;

    function updateScale() {
      const width = observedWrapper.clientWidth;
      const height = observedWrapper.clientHeight;
      const nextScale = Math.min(width / BOARD_WIDTH, height / BOARD_HEIGHT, 1);
      setScale(Math.max(nextScale, 0.25));
    }

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(observedWrapper);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="flex h-full min-h-[320px] w-full items-center justify-center overflow-hidden rounded-lg bg-zinc-950 p-1.5 sm:min-h-[420px] sm:p-3"
    >
      <Stage
        ref={stageRef}
        width={BOARD_WIDTH * scale}
        height={BOARD_HEIGHT * scale}
        scaleX={scale}
        scaleY={scale}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <Layer listening={false}>
          <FootballPitch />
        </Layer>
        <Layer listening={shouldListenForElementEvents}>
          {drawings.map((shape) => (
            <DrawingShape key={shape.id} shape={shape} />
          ))}
          {previewShape ? <DrawingShape shape={previewShape} isPreview /> : null}
        </Layer>
        <Layer listening={shouldListenForElementEvents}>
          {tokens.map((token) => (
            <PlayerToken key={token.id} token={token} />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
