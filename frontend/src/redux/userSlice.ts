// src/redux/userSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';  // type-only import

interface UserState {
  isLoggedIn: boolean;
  username: string;
}

const initialState: UserState = {
  isLoggedIn: false,
  username: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login_slice: (state, action: PayloadAction<{ username: string }>) => {
      state.isLoggedIn = true;
      state.username = action.payload.username;
    },
    logout_slice: (state) => {
      state.isLoggedIn = false;
      state.username = '';
    },
  },
});

export const { login_slice, logout_slice } = userSlice.actions;
export default userSlice.reducer;
