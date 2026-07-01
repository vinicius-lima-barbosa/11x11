"use client";

import type Konva from "konva";
import { memo } from "react";
import { Circle, Group, RegularPolygon, Text } from "react-konva";
import { useTacticalBoardStore } from "../store/tactical-board.store";
import type {
  BallToken,
  PlayerToken as PlayerTokenType,
} from "../types/tactical-board.types";

type PlayerTokenProps = {
  token: PlayerTokenType | BallToken;
};

const TEAM_COLORS = {
  home: {
    fill: "#dc2626",
    stroke: "#ffffff",
    text: "#ffffff",
  },
  away: {
    fill: "#2563eb",
    stroke: "#ffffff",
    text: "#ffffff",
  },
};

function PlayerTokenComponent({ token }: PlayerTokenProps) {
  const activeTool = useTacticalBoardStore((state) => state.activeTool);
  const selectedElementId = useTacticalBoardStore(
    (state) => state.selectedElementId,
  );
  const selectElement = useTacticalBoardStore((state) => state.selectElement);
  const updateElement = useTacticalBoardStore((state) => state.updateElement);
  const removeElement = useTacticalBoardStore((state) => state.removeElement);
  const isSelected = selectedElementId === token.id;
  const isBall = token.type === "ball";
  const radius = isBall ? 12 : 20;

  function handleClick(event: Konva.KonvaEventObject<MouseEvent | TouchEvent>) {
    event.cancelBubble = true;

    if (activeTool === "eraser") {
      removeElement(token.id);
      return;
    }

    if (activeTool === "select") {
      selectElement(token.id);
    }
  }

  function handleDragEnd(event: Konva.KonvaEventObject<DragEvent>) {
    if (activeTool !== "select") {
      return;
    }

    updateElement(token.id, {
      x: event.target.x(),
      y: event.target.y(),
    });
  }

  if (isBall) {
    return (
      <Group
        id={token.id}
        x={token.x}
        y={token.y}
        draggable={activeTool === "select"}
        onDragEnd={handleDragEnd}
      >
        <Circle
          radius={radius}
          fillRadialGradientStartPoint={{ x: -radius * 0.3, y: -radius * 0.3 }}
          fillRadialGradientStartRadius={0}
          fillRadialGradientEndPoint={{ x: -radius * 0.3, y: -radius * 0.3 }}
          fillRadialGradientEndRadius={radius * 1.4}
          fillRadialGradientColorStops={[
            0,
            "#ffffff",
            0.6,
            "#f1f5f9",
            1,
            "#cbd5e1",
          ]}
          stroke={isSelected ? "#facc15" : "#111827"}
          strokeWidth={2}
          perfectDrawEnabled={false}
        />

        <RegularPolygon
          sides={5}
          radius={radius * 0.36}
          rotation={-90}
          fill="#111827"
          perfectDrawEnabled={false}
        />

        {[0, 72, 144, 216, 288].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const dist = radius * 0.62;
          return (
            <RegularPolygon
              key={angle}
              x={Math.cos(rad) * dist}
              y={Math.sin(rad) * dist}
              sides={5}
              radius={radius * 0.22}
              rotation={angle + 90}
              fill="#111827"
              perfectDrawEnabled={false}
            />
          );
        })}
      </Group>
    );
  }

  const colors = TEAM_COLORS[token.team];

  return (
    <Group
      id={token.id}
      x={token.x}
      y={token.y}
      draggable={activeTool === "select"}
      listening={activeTool === "select" || activeTool === "eraser"}
      onClick={handleClick}
      onTap={handleClick}
      onDragEnd={handleDragEnd}
    >
      <Circle
        radius={radius}
        fill={colors.fill}
        stroke={isSelected ? "#facc15" : colors.stroke}
        strokeWidth={2}
        shadowColor="rgba(15,23,42,0.28)"
        shadowBlur={8}
        shadowOffsetY={3}
        shadowForStrokeEnabled={false}
        perfectDrawEnabled={false}
      />
      <Text
        x={-radius}
        y={-10}
        width={radius * 2}
        height={22}
        align="center"
        verticalAlign="middle"
        text={String(token.number)}
        fill={colors.text}
        fontSize={19}
        fontStyle="700"
      />
      {token.name ? (
        <Text
          x={-54}
          y={34}
          width={108}
          align="center"
          text={token.name}
          fill="#ffffff"
          fontSize={15}
          fontStyle="700"
          shadowColor="rgba(0,0,0,0.75)"
          shadowBlur={3}
        />
      ) : null}
    </Group>
  );
}

export const PlayerToken = memo(PlayerTokenComponent);
