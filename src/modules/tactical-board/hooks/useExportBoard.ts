"use client";

import { useCallback } from "react";
import type Konva from "konva";
import { exportStageAsPng } from "../utils/export-board";

export function useExportBoard(stageRef: React.RefObject<Konva.Stage | null>) {
  return useCallback(() => {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }

    exportStageAsPng(stage);
  }, [stageRef]);
}
