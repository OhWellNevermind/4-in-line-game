import { PlayerColor } from '@/logic/GameLogic';

export type CellState = 'red' | 'yellow' | 'none';

export type InitializeBoard = {
  rows: number;
  columns: number;
  playerTurn: PlayerColor;
  currentPlayerColor: PlayerColor;
};

export type SetCell = {
  row: number;
  column: number;
  type: CellState;
};

export type SetState = {
  hasWon?: boolean;
  error?: string;
  playerTurn?: PlayerColor;
  isTie?: boolean;
};

export type SetError = {
  error: string;
};
