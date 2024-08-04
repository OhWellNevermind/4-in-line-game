import { PlayerTurn } from '@/logic/GameLogic';

export type GameMode = 'pvp' | 'bot' | 'idle';
export type CellState = 'red' | 'yellow' | 'none';

export type InitializeBoard = {
  rows: number;
  columns: number;
};

export type SetCell = {
  row: number;
  column: number;
  type: CellState;
};

export type SetState = {
  hasWon?: boolean;
  error?: string;
  playerTurn?: PlayerTurn;
};

export type SetError = {
  error: string;
};
