"use client";

import { useEffect } from "react";
import { useTacticalBoardStore } from "../store/tactical-board.store";

const SAVE_DEBOUNCE_MS = 500;

export function useBoardPersistence() {
  useEffect(() => {
    useTacticalBoardStore.getState().loadFromLocalStorage();
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    function flushSave() {
      if (!useTacticalBoardStore.getState().hasHydrated) {
        return;
      }

      useTacticalBoardStore.getState().saveToLocalStorage();
    }

    const unsubscribe = useTacticalBoardStore.subscribe((state, previousState) => {
      if (!state.hasHydrated || state.elements === previousState.elements) {
        return;
      }

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        flushSave();
      }, SAVE_DEBOUNCE_MS);
    });

    window.addEventListener("beforeunload", flushSave);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        flushSave();
      }

      window.removeEventListener("beforeunload", flushSave);
      unsubscribe();
    };
  }, []);
}
