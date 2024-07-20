export type TGameMode = 'pvp' | 'bot' | 'idle';
export type TBoardMode = 'headless' | 'managed';
export type TCellState = 'red' | 'yellow' | 'none';

export type TInitializeBoard = {
  rows: number;
  columns: number;
  mode: TBoardMode;
};

export type TSetCell = {
  row: number;
  column: number;
  type: TCellState;
};
