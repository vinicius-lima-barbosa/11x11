export const BOARD_WIDTH = 1200;
export const BOARD_HEIGHT = 780;

export type Tool = "select" | "line" | "arrow" | "rectangle" | "circle" | "eraser";

export type TeamSide = "home" | "away";

export type Point = {
  x: number;
  y: number;
};

export type BaseBoardElement = {
  id: string;
};

export type PlayerToken = BaseBoardElement & {
  type: "player";
  team: TeamSide;
  number: number;
  name?: string;
  x: number;
  y: number;
};

export type BallToken = BaseBoardElement & {
  type: "ball";
  x: number;
  y: number;
};

export type LineShape = BaseBoardElement & {
  type: "line";
  points: [number, number, number, number];
  stroke: string;
  strokeWidth: number;
};

export type ArrowShape = BaseBoardElement & {
  type: "arrow";
  points: [number, number, number, number];
  stroke: string;
  strokeWidth: number;
};

export type RectangleShape = BaseBoardElement & {
  type: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
  stroke: string;
  strokeWidth: number;
  fill: string;
};

export type CircleShape = BaseBoardElement & {
  type: "circle";
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  stroke: string;
  strokeWidth: number;
  fill: string;
};

export type DrawingShape = LineShape | ArrowShape | RectangleShape | CircleShape;

export type BoardElement = PlayerToken | BallToken | DrawingShape;

export type BoardSnapshot = BoardElement[];

export type TacticalBoardState = {
  activeTool: Tool;
  selectedElementId: string | null;
  elements: BoardElement[];
  history: BoardSnapshot[];
  future: BoardSnapshot[];
  hasHydrated: boolean;
  setActiveTool: (tool: Tool) => void;
  addElement: (element: BoardElement) => void;
  updateElement: (id: string, patch: Partial<BoardElement>, options?: { commit?: boolean }) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  clearBoard: () => void;
  undo: () => void;
  redo: () => void;
  loadInitialBoard: () => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
};
