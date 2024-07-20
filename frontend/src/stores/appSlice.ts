import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TGameMode } from '@/types/types';

type AppSliceStateType = {
  gameMode: TGameMode | null;
};
const initialState: AppSliceStateType = {
  gameMode: null,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setGameMode(state, action: PayloadAction<TGameMode | null>) {
      state.gameMode = action.payload;
    },
  },
});

export const { setGameMode } = appSlice.actions;
const appReducer = appSlice.reducer;
export default appReducer;
