import { z } from "zod";
import type { BoardElement } from "../types/tactical-board.types";

const lineShapeSchema = z.object({
  id: z.string(),
  type: z.enum(["line", "arrow"]),
  points: z.tuple([z.number(), z.number(), z.number(), z.number()]),
  stroke: z.string(),
  strokeWidth: z.number().positive(),
});

const rectangleShapeSchema = z.object({
  id: z.string(),
  type: z.literal("rectangle"),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  stroke: z.string(),
  strokeWidth: z.number().positive(),
  fill: z.string(),
});

const circleShapeSchema = z.object({
  id: z.string(),
  type: z.literal("circle"),
  x: z.number(),
  y: z.number(),
  radiusX: z.number(),
  radiusY: z.number(),
  stroke: z.string(),
  strokeWidth: z.number().positive(),
  fill: z.string(),
});

const playerSchema = z.object({
  id: z.string(),
  type: z.literal("player"),
  team: z.enum(["home", "away"]),
  number: z.number().int().min(1).max(99),
  name: z.string().optional(),
  x: z.number(),
  y: z.number(),
});

const ballSchema = z.object({
  id: z.string(),
  type: z.literal("ball"),
  x: z.number(),
  y: z.number(),
});

export const boardElementSchema = z.discriminatedUnion("type", [
  playerSchema,
  ballSchema,
  lineShapeSchema,
  rectangleShapeSchema,
  circleShapeSchema,
]);

export const persistedBoardSchema = z.object({
  version: z.literal(1),
  elements: z.array(boardElementSchema),
});

export type PersistedBoard = z.infer<typeof persistedBoardSchema>;

export function serializeBoard(elements: BoardElement[]) {
  return JSON.stringify({
    version: 1,
    elements,
  } satisfies PersistedBoard);
}

export function parseBoard(value: string): BoardElement[] | null {
  const parsed: unknown = JSON.parse(value);
  const result = persistedBoardSchema.safeParse(parsed);
  return result.success ? result.data.elements : null;
}
