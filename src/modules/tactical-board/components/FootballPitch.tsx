"use client";

import { memo } from "react";
import { Arc, Circle, Group, Line, Rect } from "react-konva";
import { BOARD_HEIGHT, BOARD_WIDTH } from "../types/tactical-board.types";

const LINE_COLOR = "rgba(255,255,255,0.88)";
const LINE_WIDTH = 4;

function FootballPitchComponent() {
  const penaltyBoxWidth = 190;
  const penaltyBoxHeight = 410;
  const goalBoxWidth = 72;
  const goalBoxHeight = 190;
  const centerY = BOARD_HEIGHT / 2;

  return (
    <Group>
      <Rect width={BOARD_WIDTH} height={BOARD_HEIGHT} fill="#157347" />
      <Rect x={18} y={18} width={BOARD_WIDTH - 36} height={BOARD_HEIGHT - 36} stroke={LINE_COLOR} strokeWidth={LINE_WIDTH} />

      <Line points={[BOARD_WIDTH / 2, 18, BOARD_WIDTH / 2, BOARD_HEIGHT - 18]} stroke={LINE_COLOR} strokeWidth={LINE_WIDTH} />
      <Circle x={BOARD_WIDTH / 2} y={centerY} radius={95} stroke={LINE_COLOR} strokeWidth={LINE_WIDTH} />
      <Circle x={BOARD_WIDTH / 2} y={centerY} radius={5} fill={LINE_COLOR} />

      <Rect
        x={18}
        y={(BOARD_HEIGHT - penaltyBoxHeight) / 2}
        width={penaltyBoxWidth}
        height={penaltyBoxHeight}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
      />
      <Rect
        x={18}
        y={(BOARD_HEIGHT - goalBoxHeight) / 2}
        width={goalBoxWidth}
        height={goalBoxHeight}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
      />
      <Circle x={142} y={centerY} radius={5} fill={LINE_COLOR} />
      <Arc
        x={142}
        y={centerY}
        innerRadius={92}
        outerRadius={92}
        angle={96}
        rotation={-48}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
      />

      <Rect
        x={BOARD_WIDTH - 18 - penaltyBoxWidth}
        y={(BOARD_HEIGHT - penaltyBoxHeight) / 2}
        width={penaltyBoxWidth}
        height={penaltyBoxHeight}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
      />
      <Rect
        x={BOARD_WIDTH - 18 - goalBoxWidth}
        y={(BOARD_HEIGHT - goalBoxHeight) / 2}
        width={goalBoxWidth}
        height={goalBoxHeight}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
      />
      <Circle x={BOARD_WIDTH - 142} y={centerY} radius={5} fill={LINE_COLOR} />
      <Arc
        x={BOARD_WIDTH - 142}
        y={centerY}
        innerRadius={92}
        outerRadius={92}
        angle={96}
        rotation={132}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
      />

      <Rect x={0} y={centerY - 64} width={18} height={128} stroke={LINE_COLOR} strokeWidth={LINE_WIDTH} />
      <Rect x={BOARD_WIDTH - 18} y={centerY - 64} width={18} height={128} stroke={LINE_COLOR} strokeWidth={LINE_WIDTH} />
    </Group>
  );
}

export const FootballPitch = memo(FootballPitchComponent);
