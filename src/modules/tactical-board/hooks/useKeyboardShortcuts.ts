"use client";

import { useEffect } from "react";
import { useTacticalBoardStore } from "../store/tactical-board.store";

export function useKeyboardShortcuts() {
  const selectedElementId = useTacticalBoardStore((state) => state.selectedElementId);
  const removeElement = useTacticalBoardStore((state) => state.removeElement);
  const undo = useTacticalBoardStore((state) => state.undo);
  const redo = useTacticalBoardStore((state) => state.redo);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isModifierPressed = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();

      if ((event.key === "Delete" || event.key === "Backspace") && selectedElementId) {
        event.preventDefault();
        removeElement(selectedElementId);
        return;
      }

      if (!isModifierPressed) {
        return;
      }

      if (key === "z" && event.shiftKey) {
        event.preventDefault();
        redo();
        return;
      }

      if (key === "z") {
        event.preventDefault();
        undo();
        return;
      }

      if (key === "y") {
        event.preventDefault();
        redo();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [redo, removeElement, selectedElementId, undo]);
}
