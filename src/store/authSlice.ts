import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import authStorage, { UserData } from '../utils/authStorage';

interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  token?: string;
  refreshToken?: string;
  expiresAt?: number;
}

// 從 localStorage 讀取已保存的身份驗證狀態
const initialState: AuthState = authStorage.loadAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        username: string;
        token?: string;
        refreshToken?: string;
        expiresIn?: number;
        [key: string]: any;
      }>
    ) => {
      const { username, token, refreshToken, expiresIn, ...userData } =
        action.payload;

      state.isAuthenticated = true;
      state.user = { username, ...userData };

      if (token) {
        state.token = token;
      }

      if (refreshToken) {
        state.refreshToken = refreshToken;
      }

      if (expiresIn) {
        state.expiresAt = new Date().getTime() + expiresIn * 1000;
      }

      // 保存到 localStorage
      authStorage.saveAuthState(
        true,
        state.user,
        token,
        refreshToken,
        expiresIn
      );
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = undefined;
      state.refreshToken = undefined;
      state.expiresAt = undefined;

      // 清除 localStorage
      authStorage.clearAuthState();
    },

    // 檢查並恢復會話狀態
    checkSession: (state) => {
      const savedState = authStorage.loadAuthState();

      if (savedState.isAuthenticated && savedState.user) {
        state.isAuthenticated = true;
        state.user = savedState.user;
        state.token = savedState.token;
        state.refreshToken = savedState.refreshToken;
        state.expiresAt = savedState.expiresAt;
      }
    },

    // 更新令牌
    updateToken: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken?: string;
        expiresIn?: number;
      }>
    ) => {
      const { token, refreshToken, expiresIn } = action.payload;

      state.token = token;

      if (refreshToken) {
        state.refreshToken = refreshToken;
      }

      if (expiresIn) {
        state.expiresAt = new Date().getTime() + expiresIn * 1000;
      }

      // 更新 localStorage 中的令牌
      authStorage.updateToken(token, refreshToken, expiresIn);
    },
  },
});

export const { login, logout, checkSession, updateToken } = authSlice.actions;
export default authSlice.reducer;
