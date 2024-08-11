import { PlayerColor } from '@/logic/GameLogic';
import {
  CellState,
  InitializeBoard,
  SetCell,
  SetState,
} from '@/types/boardTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type BoardSliceStateType = {
  isInitialized: boolean;
  isTie: boolean;
  hasWon: boolean;
  error: string;
  rows: number;
  columns: number;
  board: CellState[][] | null;
  playerTurn: PlayerColor;
  currentPlayerColor: PlayerColor;
};

const initialState: BoardSliceStateType = {
  isInitialized: false,
  isTie: false,
  hasWon: false,
  error: '',
  rows: 0,
  columns: 0,
  board: null,
  playerTurn: 'red',
  currentPlayerColor: 'red',
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
      state.isTie = false;
      state.playerTurn = action.payload.playerTurn;
      state.currentPlayerColor = action.payload.currentPlayerColor;
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
      state.isTie = action.payload.isTie ?? state.isTie;
      state.hasWon = action.payload.hasWon ?? state.hasWon;
      state.error = action.payload.error ?? state.error;
      state.playerTurn = action.payload.playerTurn ?? state.playerTurn;
    },
    changeCurrentTurn(state) {
      state.playerTurn = state.playerTurn === 'red' ? 'yellow' : 'red';
    },
  },
});

export const {
  initialize,
  destroy,
  setRowAndCell,
  setBoardState,
  changeCurrentTurn,
} = boardSlice.actions;
const boardReducer = boardSlice.reducer;
export default boardReducer;
