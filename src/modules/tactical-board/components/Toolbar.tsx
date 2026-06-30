"use client";

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
import { IconButton } from "@/shared/components/IconButton";
import { Button } from "@/shared/components/Button";
import { useTacticalBoardStore } from "../store/tactical-board.store";
import type { Tool } from "../types/tactical-board.types";

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

export function Toolbar({ onExport }: ToolbarProps) {
  const activeTool = useTacticalBoardStore((state) => state.activeTool);
  const history = useTacticalBoardStore((state) => state.history);
  const future = useTacticalBoardStore((state) => state.future);
  const setActiveTool = useTacticalBoardStore((state) => state.setActiveTool);
  const undo = useTacticalBoardStore((state) => state.undo);
  const redo = useTacticalBoardStore((state) => state.redo);
  const clearBoard = useTacticalBoardStore((state) => state.clearBoard);

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-200 bg-white p-2 shadow-sm">
      <div className="flex items-center gap-1 border-r border-zinc-200 pr-2">
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
        <IconButton label="Undo" icon={<Undo2 size={18} />} disabled={history.length === 0} onClick={undo} />
        <IconButton label="Redo" icon={<Redo2 size={18} />} disabled={future.length === 0} onClick={redo} />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={clearBoard}>
          <Trash2 size={16} />
          Clear
        </Button>
        <Button variant="primary" onClick={onExport}>
          <Download size={16} />
          Export PNG
        </Button>
      </div>
    </div>
  );
}
