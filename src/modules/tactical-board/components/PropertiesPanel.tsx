"use client";

import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import type { DrawingShape, PlayerToken } from "../types/tactical-board.types";
import { useTacticalBoardStore } from "../store/tactical-board.store";

function isDrawingShape(element: unknown): element is DrawingShape {
  return (
    typeof element === "object" &&
    element !== null &&
    "type" in element &&
    (element.type === "line" || element.type === "arrow" || element.type === "rectangle" || element.type === "circle")
  );
}

function isPlayer(element: unknown): element is PlayerToken {
  return typeof element === "object" && element !== null && "type" in element && element.type === "player";
}

export function PropertiesPanel() {
  const selectedElementId = useTacticalBoardStore((state) => state.selectedElementId);
  const elements = useTacticalBoardStore((state) => state.elements);
  const updateElement = useTacticalBoardStore((state) => state.updateElement);
  const removeElement = useTacticalBoardStore((state) => state.removeElement);
  const selectedElement = elements.find((element) => element.id === selectedElementId);

  return (
    <aside className="w-full rounded-lg border border-zinc-200 bg-white p-4 shadow-sm lg:w-72">
      <div className="border-b border-zinc-200 pb-3">
        <h2 className="text-sm font-semibold text-zinc-950">Properties</h2>
        <p className="mt-1 text-xs text-zinc-500">
          {selectedElement ? `${selectedElement.type} selected` : "Select an element to edit it."}
        </p>
      </div>

      {!selectedElement ? (
        <div className="mt-4 space-y-3 text-sm text-zinc-600">
          <p>Use the toolbar to move tokens, draw tactical shapes, erase elements, or export the board.</p>
        </div>
      ) : null}

      {isPlayer(selectedElement) ? (
        <div className="mt-4 space-y-4">
          <label className="block space-y-1">
            <span className="text-xs font-medium text-zinc-600">Number</span>
            <Input
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
          <label className="block space-y-1">
            <span className="text-xs font-medium text-zinc-600">Name</span>
            <Input
              value={selectedElement.name ?? ""}
              maxLength={16}
              onChange={(event) => updateElement(selectedElement.id, { name: event.target.value || undefined })}
            />
          </label>
        </div>
      ) : null}

      {isDrawingShape(selectedElement) ? (
        <div className="mt-4 space-y-4">
          <label className="block space-y-1">
            <span className="text-xs font-medium text-zinc-600">Stroke color</span>
            <Input
              type="color"
              value={selectedElement.stroke}
              className="h-10 p-1"
              onChange={(event) => updateElement(selectedElement.id, { stroke: event.target.value })}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-zinc-600">Stroke width</span>
            <Input
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
        </div>
      ) : null}

      {selectedElement ? (
        <Button className="mt-5 w-full" variant="danger" onClick={() => removeElement(selectedElement.id)}>
          Delete selected
        </Button>
      ) : null}
    </aside>
  );
}
