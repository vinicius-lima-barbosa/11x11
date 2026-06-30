import type { BoardElement, CircleShape, Point, RectangleShape } from "../types/tactical-board.types";

export const MIN_DRAW_DISTANCE = 8;

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function distance(a: Point, b: Point) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function normalizeRectangle(start: Point, end: Point): Pick<RectangleShape, "x" | "y" | "width" | "height"> {
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  };
}

export function normalizeCircle(start: Point, end: Point): Pick<CircleShape, "x" | "y" | "radiusX" | "radiusY"> {
  return {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
    radiusX: Math.abs(end.x - start.x) / 2,
    radiusY: Math.abs(end.y - start.y) / 2,
  };
}

export function isMeaningfulShape(element: BoardElement) {
  if (element.type === "line" || element.type === "arrow") {
    const [x1, y1, x2, y2] = element.points;
    return distance({ x: x1, y: y1 }, { x: x2, y: y2 }) >= MIN_DRAW_DISTANCE;
  }

  if (element.type === "rectangle") {
    return element.width >= MIN_DRAW_DISTANCE && element.height >= MIN_DRAW_DISTANCE;
  }

  if (element.type === "circle") {
    return element.radiusX >= MIN_DRAW_DISTANCE && element.radiusY >= MIN_DRAW_DISTANCE;
  }

  return true;
}

export function moveElement(element: BoardElement, x: number, y: number): BoardElement {
  if (element.type === "line" || element.type === "arrow") {
    const [x1, y1, x2, y2] = element.points;
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    return { ...element, points: [x1 + dx, y1 + dy, x2 + dx, y2 + dy] };
  }

  return { ...element, x, y };
}
