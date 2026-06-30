import type Konva from "konva";
import { BOARD_HEIGHT, BOARD_WIDTH } from "../types/tactical-board.types";

export function exportStageAsPng(stage: Konva.Stage, filename = "tactical-board.png") {
  const uri = stage.toDataURL({
    x: 0,
    y: 0,
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT,
    pixelRatio: 2,
    mimeType: "image/png",
  });

  const link = document.createElement("a");
  link.download = filename;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
