"use client";

import { create } from "zustand";
import type { BoardElement, BoardSnapshot, TacticalBoardState, Tool } from "../types/tactical-board.types";
import { createInitialBoardElements } from "../utils/formations";
import { parseBoard, serializeBoard } from "../utils/board-serialization";

const STORAGE_KEY = "tactical-board:v1";
const MAX_HISTORY_ITEMS = 80;

function cloneSnapshot(elements: BoardElement[]): BoardSnapshot {
  return structuredClone(elements);
}

function getDefaultElements() {
  return createInitialBoardElements();
}

function withHistory(elements: BoardElement[], history: BoardSnapshot[]) {
  return [...history, cloneSnapshot(elements)].slice(-MAX_HISTORY_ITEMS);
}

export const useTacticalBoardStore = create<TacticalBoardState>((set, get) => ({
  activeTool: "select",
  selectedElementId: null,
  elements: getDefaultElements(),
  history: [],
  future: [],
  interactionSnapshot: null,
  hasHydrated: false,

  setActiveTool: (tool: Tool) => {
    set({
      activeTool: tool,
      selectedElementId: tool === "select" ? get().selectedElementId : null,
    });
  },

  addElement: (element: BoardElement) => {
    set((state) => ({
      elements: [...state.elements, element],
      history: withHistory(state.elements, state.history),
      future: [],
      interactionSnapshot: null,
      selectedElementId: element.id,
      activeTool: state.activeTool,
    }));
  },

  updateElement: (id, patch, options) => {
    const commit = options?.commit ?? true;

    set((state) => {
      const nextElements = state.elements.map((element) =>
        element.id === id ? ({ ...element, ...patch } as BoardElement) : element,
      );

      return {
        elements: nextElements,
        history: commit ? withHistory(state.elements, state.history) : state.history,
        future: commit ? [] : state.future,
        interactionSnapshot: commit ? null : state.interactionSnapshot,
      };
    });
  },

  beginElementInteraction: () => {
    set((state) => {
      if (state.interactionSnapshot) {
        return state;
      }

      return {
        interactionSnapshot: cloneSnapshot(state.elements),
      };
    });
  },

  commitElementInteraction: () => {
    set((state) => {
      if (!state.interactionSnapshot) {
        return state;
      }

      return {
        history: [...state.history, state.interactionSnapshot].slice(
          -MAX_HISTORY_ITEMS,
        ),
        future: [],
        interactionSnapshot: null,
      };
    });
  },

  removeElement: (id) => {
    set((state) => ({
      elements: state.elements.filter((element) => element.id !== id),
      history: withHistory(state.elements, state.history),
      future: [],
      interactionSnapshot: null,
      selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
    }));
  },

  selectElement: (id) => {
    set({ selectedElementId: id });
  },

  clearBoard: () => {
    set((state) => ({
      elements: getDefaultElements(),
      history: withHistory(state.elements, state.history),
      future: [],
      interactionSnapshot: null,
      selectedElementId: null,
      activeTool: "select",
    }));
  },

  undo: () => {
    set((state) => {
      const previous = state.history.at(-1);
      if (!previous) {
        return state;
      }

      return {
        elements: cloneSnapshot(previous),
        history: state.history.slice(0, -1),
        future: [cloneSnapshot(state.elements), ...state.future],
        selectedElementId: null,
        interactionSnapshot: null,
      };
    });
  },

  redo: () => {
    set((state) => {
      const next = state.future[0];
      if (!next) {
        return state;
      }

      return {
        elements: cloneSnapshot(next),
        history: withHistory(state.elements, state.history),
        future: state.future.slice(1),
        selectedElementId: null,
        interactionSnapshot: null,
      };
    });
  },

  loadInitialBoard: () => {
    set({
      elements: getDefaultElements(),
      history: [],
      future: [],
      interactionSnapshot: null,
      selectedElementId: null,
      hasHydrated: true,
    });
  },

  saveToLocalStorage: () => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, serializeBoard(get().elements));
  },

  loadFromLocalStorage: () => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      get().loadInitialBoard();
      return;
    }

    try {
      const elements = parseBoard(stored);

      if (!elements) {
        get().loadInitialBoard();
        return;
      }

      set({
        elements,
        history: [],
        future: [],
        interactionSnapshot: null,
        selectedElementId: null,
        hasHydrated: true,
      });
    } catch {
      get().loadInitialBoard();
    }
  },
}));
