import { RootState } from '@/stores/store';

export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;

export const selectUserName = (state: RootState) => state.auth.userName;
