import { UserData } from '../utils/authStorage';

/**
 * 用戶登入請求參數
 */
export interface LoginRequestParams {
  username: string;
  password: string;
}

/**
 * 登入響應數據
 */
export interface LoginResponse {
  user: UserData;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * 令牌刷新請求參數
 */
export interface RefreshTokenParams {
  refreshToken: string;
}

/**
 * 令牌刷新響應數據
 */
export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * 模擬登入 API
 */
export async function loginApi(
  params: LoginRequestParams
): Promise<LoginResponse> {
  // 模擬登入過程
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          username: params.username,
          displayName: params.username,
          email: `${params.username}@example.com`,
          permissions: ['train_schedule:read'],
        },
        token: `sample-token-${Date.now()}`,
        refreshToken: `sample-refresh-token-${Date.now()}`,
        expiresIn: 3600, // 1小時
      });
    }, 1000);
  });
}

/**
 * 刷新令牌 API
 */
export async function refreshTokenApi(
  params: RefreshTokenParams
): Promise<RefreshTokenResponse> {
  // 模擬刷新令牌過程
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: `new-token-${Date.now()}`,
        refreshToken: `new-refresh-token-${Date.now()}`,
        expiresIn: 3600, // 1小時
      });
    }, 500);
  });
}

/**
 * 登出 API
 */
export async function logoutApi(token: string): Promise<void> {
  // 模擬登出過程
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
}
