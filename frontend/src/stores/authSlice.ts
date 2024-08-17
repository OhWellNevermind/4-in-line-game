import { setAsyncStorageItem } from '@/helpers/setAsyncStorageItem';
import { authApi } from '@/services/authApi';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = {
  isLoggedIn: boolean;
  userName: string;
  id: string;
};

const initialState: State = {
  isLoggedIn: false,
  userName: '',
  id: '',
};

const setUser = (state: State, action: PayloadAction<any>) => {
  state.userName = action.payload.user.name;
  state.id = action.payload.user.id;
  state.isLoggedIn = true;
  setAsyncStorageItem({
    token: action.payload.token,
    refreshToken: action.payload.refreshToken,
  });
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    refreshState: state => {
      state.isLoggedIn = false;
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(authApi.endpoints.register.matchFulfilled, setUser)
      .addMatcher(authApi.endpoints.login.matchFulfilled, setUser)
      .addMatcher(authApi.endpoints.getMe.matchFulfilled, (state, action) => {
        state.id = action.payload.user.id;
        state.isLoggedIn = true;
        state.userName = action.payload.user.name;
      });
  },
});

export const authReducer = authSlice.reducer;
export const { refreshState } = authSlice.actions;
