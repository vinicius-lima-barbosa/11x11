"use client";

import { Button } from "@/shared/components/Button";
import { IconButton } from "@/shared/components/IconButton";
import { Input } from "@/shared/components/Input";
import {
  Circle,
  Download,
  Eraser,
  MousePointer2,
  MoveRight,
  Redo2,
  Slash,
  Square,
  Trash2,
  Undo2,
} from "lucide-react";
import { useTacticalBoardStore } from "../store/tactical-board.store";
import type { DrawingShape, PlayerToken, Tool } from "../types/tactical-board.types";

const tools: Array<{ value: Tool; label: string; icon: React.ReactNode }> = [
  { value: "select", label: "Select", icon: <MousePointer2 size={18} /> },
  { value: "line", label: "Line", icon: <Slash size={18} /> },
  { value: "arrow", label: "Arrow", icon: <MoveRight size={18} /> },
  { value: "rectangle", label: "Rectangle", icon: <Square size={18} /> },
  { value: "circle", label: "Circle", icon: <Circle size={18} /> },
  { value: "eraser", label: "Eraser", icon: <Eraser size={18} /> },
];

type ToolbarProps = {
  onExport: () => void;
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

function isPlayer(element: unknown): element is PlayerToken {
  return (
    typeof element === "object" &&
    element !== null &&
    "type" in element &&
    element.type === "player"
  );
}

export function Toolbar({ onExport }: ToolbarProps) {
  const activeTool = useTacticalBoardStore((state) => state.activeTool);
  const selectedElementId = useTacticalBoardStore(
    (state) => state.selectedElementId,
  );
  const elements = useTacticalBoardStore((state) => state.elements);
  const history = useTacticalBoardStore((state) => state.history);
  const future = useTacticalBoardStore((state) => state.future);
  const setActiveTool = useTacticalBoardStore((state) => state.setActiveTool);
  const updateElement = useTacticalBoardStore((state) => state.updateElement);
  const removeElement = useTacticalBoardStore((state) => state.removeElement);
  const undo = useTacticalBoardStore((state) => state.undo);
  const redo = useTacticalBoardStore((state) => state.redo);
  const clearBoard = useTacticalBoardStore((state) => state.clearBoard);
  const selectedElement = elements.find(
    (element) => element.id === selectedElementId,
  );

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-2 shadow-sm">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto border-zinc-200 pb-1 sm:border-r sm:pb-0 sm:pr-2">
          {tools.map((tool) => (
            <IconButton
              key={tool.value}
              label={tool.label}
              icon={tool.icon}
              isActive={activeTool === tool.value}
              onClick={() => setActiveTool(tool.value)}
            />
          ))}
        </div>

        <div className="flex items-center gap-1 border-r border-zinc-200 pr-2">
          <IconButton
            label="Undo"
            icon={<Undo2 size={18} />}
            disabled={history.length === 0}
            onClick={undo}
          />
          <IconButton
            label="Redo"
            icon={<Redo2 size={18} />}
            disabled={future.length === 0}
            onClick={redo}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button className="px-2 sm:px-3" variant="secondary" onClick={clearBoard}>
            <Trash2 size={16} />
            <span className="hidden sm:inline">Clear</span>
          </Button>
          <Button className="px-2 sm:px-3" variant="primary" onClick={onExport}>
            <Download size={16} />
            <span className="hidden sm:inline">Export PNG</span>
          </Button>
        </div>
      </div>

      {isPlayer(selectedElement) ? (
        <div className="flex min-w-0 flex-wrap items-end gap-2 border-t border-zinc-200 pt-2">
          <label className="block w-20 space-y-1">
            <span className="text-[11px] font-medium text-zinc-600">Number</span>
            <Input
              className="h-8 px-2"
              type="number"
              min={1}
              max={99}
              value={selectedElement.number}
              onChange={(event) => {
                const number = Number(event.target.value);

                if (Number.isInteger(number) && number >= 1 && number <= 99) {
                  updateElement(selectedElement.id, { number });
                }
              }}
            />
          </label>

          <label className="block min-w-40 flex-1 space-y-1">
            <span className="text-[11px] font-medium text-zinc-600">Name</span>
            <Input
              className="h-8 px-2"
              value={selectedElement.name ?? ""}
              maxLength={16}
              onChange={(event) =>
                updateElement(selectedElement.id, {
                  name: event.target.value || undefined,
                })
              }
            />
          </label>

          <Button
            className="h-8 px-2"
            variant="danger"
            onClick={() => removeElement(selectedElement.id)}
          >
            Delete
          </Button>
        </div>
      ) : null}

      {isDrawingShape(selectedElement) ? (
        <div className="flex min-w-0 flex-wrap items-end gap-2 border-t border-zinc-200 pt-2">
          <label className="block w-16 space-y-1">
            <span className="text-[11px] font-medium text-zinc-600">Color</span>
            <Input
              className="h-8 p-1"
              type="color"
              value={selectedElement.stroke}
              onChange={(event) =>
                updateElement(selectedElement.id, { stroke: event.target.value })
              }
            />
          </label>

          <label className="block w-24 space-y-1">
            <span className="text-[11px] font-medium text-zinc-600">Stroke</span>
            <Input
              className="h-8 px-2"
              type="number"
              min={1}
              max={20}
              value={selectedElement.strokeWidth}
              onChange={(event) => {
                const strokeWidth = Number(event.target.value);

                if (strokeWidth >= 1 && strokeWidth <= 20) {
                  updateElement(selectedElement.id, { strokeWidth });
                }
              }}
            />
          </label>

          <Button
            className="h-8 px-2"
            variant="danger"
            onClick={() => removeElement(selectedElement.id)}
          >
            Delete
          </Button>
        </div>
      ) : null}
    </div>
  );
}
