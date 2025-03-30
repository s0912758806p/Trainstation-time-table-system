import { UserData } from '../utils/authStorage';

// API 端點
const API_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

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
 * 這個函數在實際環境中應連接到後端登入 API
 */
export async function loginApi(
  params: LoginRequestParams
): Promise<LoginResponse> {
  // 實際環境中應使用真實的 API 請求
  // return axios.post<LoginResponse>(`${API_URL}/auth/login`, params).then(res => res.data);

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
 * 在實際環境中應連接到後端刷新令牌 API
 */
export async function refreshTokenApi(
  params: RefreshTokenParams
): Promise<RefreshTokenResponse> {
  // 實際環境中應使用真實的 API 請求
  // return axios.post<RefreshTokenResponse>(`${API_URL}/auth/refresh`, params)
  //   .then(res => res.data);

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
 * 在實際環境中應連接到後端登出 API
 */
export async function logoutApi(token: string): Promise<void> {
  // 實際環境中應使用真實的 API 請求
  // return axios.post(`${API_URL}/auth/logout`, { token }).then(() => {});

  // 模擬登出過程
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
}
