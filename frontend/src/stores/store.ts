import appReducer from '@/stores/appSlice';
import boardReducer from '@/stores/boardSlice';
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './authSlice';
import { authApi } from '@/services/authApi';

export const store = configureStore({
  reducer: {
    app: appReducer,
    board: boardReducer,
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
