import { PlayerTurn } from '@/logic/GameLogic';
import {
  CellState,
  InitializeBoard,
  SetCell,
  SetState,
} from '@/types/boardTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type BoardSliceStateType = {
  isInitialized: boolean;
  error: string;
  hasWon: boolean;
  rows: number;
  columns: number;
  board: CellState[][] | null;
  playerTurn: PlayerTurn;
};

const initialState: BoardSliceStateType = {
  isInitialized: false,
  error: '',
  hasWon: false,
  rows: 0,
  columns: 0,
  board: null,
  playerTurn: 'red',
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    initialize(state, action: PayloadAction<InitializeBoard>) {
      const { rows, columns } = action.payload;
      state.isInitialized = true;
      state.error = '';
      state.hasWon = false;
      state.rows = rows;
      state.columns = columns;
      state.board = Array.from({ length: rows }).map(_ =>
        Array.from({ length: columns }).map(_ => 'none'),
      );
    },

    destroy(state) {
      state.isInitialized = false;
      state.error = '';
      state.hasWon = false;
      state.rows = 0;
      state.columns = 0;
      state.board = [];
    },

    setRowAndCell(state, action: PayloadAction<SetCell>) {
      const { row, column, type } = action.payload;
      if (state.rows <= row || state.columns <= column) {
        state.error = 'Index out of range';
        return;
      }
      state.board![row][column] = type;
      state.error = '';
    },

    setBoardState(state, action: PayloadAction<SetState>) {
      state.error = action.payload.error ?? state.error;
      state.hasWon = action.payload.hasWon ?? state.hasWon;
      state.playerTurn = action.payload.playerTurn ?? state.playerTurn;
    },
  },
});

export const { initialize, destroy, setRowAndCell, setBoardState } =
  boardSlice.actions;
const boardReducer = boardSlice.reducer;
export default boardReducer;
