import { nanoid } from "nanoid";
import type {
  BallToken,
  BoardElement,
  PlayerToken,
  TeamSide,
} from "../types/tactical-board.types";

const HOME_COLOR_ORDER = [1, 2, 3, 4, 6, 8, 5, 10, 7, 9, 11];
const AWAY_COLOR_ORDER = [1, 2, 3, 4, 6, 8, 5, 10, 7, 9, 11];

const homePositions = [
  [140, 390],
  [300, 170],
  [300, 315],
  [300, 465],
  [300, 610],
  [500, 230],
  [500, 390],
  [500, 550],
  [710, 190],
  [760, 390],
  [710, 590],
] as const;

const awayPositions = [
  [1060, 390],
  [900, 170],
  [900, 315],
  [900, 465],
  [900, 610],
  [700, 230],
  [700, 390],
  [700, 550],
  [490, 190],
  [440, 390],
  [490, 590],
] as const;

function createPlayers(team: TeamSide): PlayerToken[] {
  const positions = team === "home" ? homePositions : awayPositions;
  const numbers = team === "home" ? HOME_COLOR_ORDER : AWAY_COLOR_ORDER;

  return positions.map(([x, y], index) => ({
    id: nanoid(),
    type: "player",
    team,
    number: numbers[index],
    x,
    y,
  }));
}

export function createInitialBoardElements(): BoardElement[] {
  const ball: BallToken = {
    id: nanoid(),
    type: "ball",
    x: 600,
    y: 390,
  };

  return [...createPlayers("home"), ...createPlayers("away"), ball];
}
