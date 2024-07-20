import {
  TBoardMode,
  TCellState,
  TInitializeBoard,
  TSetCell,
} from '@/types/boardTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type BoardSliceStateType = {
  isInitialized: boolean;
  error: string;
  mode: TBoardMode;
  rows: number;
  columns: number;
  board: TCellState[][] | null;
};

const initialState: BoardSliceStateType = {
  isInitialized: false,
  error: '',
  mode: 'headless',
  rows: 0,
  columns: 0,
  board: null,
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    initialize(state, action: PayloadAction<TInitializeBoard>) {
      const { mode, rows, columns } = action.payload;
      state.isInitialized = true;
      state.error = '';
      state.mode = mode;
      state.rows = rows;
      state.columns = columns;
      state.board = Array.from({ length: rows }).map(_ =>
        Array.from({ length: rows }).map(_ => 'none'),
      );
    },
    destroy(state) {
      state.isInitialized = false;
      state.mode = 'headless';
      state.rows = 0;
      state.columns = 0;
    },

    // Headless reducers, used for online games with game data coming from server

    setRowAndCell(state, action: PayloadAction<TSetCell>) {
      if (!state.isInitialized || state.mode !== 'headless') {
        state.error = 'Not initialized or invalid mode';
        return;
      }
      const { row, column, type } = action.payload;
      if (state.rows - 1 < row || state.columns - 1 < column) {
        state.error = 'Index out of range';
        return;
      }
      state.board![row][column] = type;
    },

    // Managed reducers, used for offline bot games
  },
});

export const { initialize, destroy, setRowAndCell } = boardSlice.actions;
const boardReducer = boardSlice.reducer;
export default boardReducer;
