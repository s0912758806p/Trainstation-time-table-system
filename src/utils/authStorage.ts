/**
 * 認證數據本地存儲工具類
 * 封裝所有與身份驗證相關的本地存儲操作，提高可維護性和靈活性
 */

// 存儲鍵名
const AUTH_KEYS = {
  IS_AUTHENTICATED: 'isAuthenticated',
  USER: 'user',
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  EXPIRES_AT: 'token_expires_at',
};

// 用戶數據類型
export interface UserData {
  username: string;
  [key: string]: any; // 其他可能的用戶資料欄位
}

// 存儲用戶認證狀態
export const saveAuthState = (
  isAuthenticated: boolean,
  userData: UserData,
  token?: string,
  refreshToken?: string,
  expiresIn?: number
): void => {
  localStorage.setItem(AUTH_KEYS.IS_AUTHENTICATED, String(isAuthenticated));
  localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(userData));

  // 如果提供了令牌相關信息，也進行保存
  if (token) {
    localStorage.setItem(AUTH_KEYS.TOKEN, token);
  }

  if (refreshToken) {
    localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, refreshToken);
  }

  if (expiresIn) {
    const expiresAt = new Date().getTime() + expiresIn * 1000;
    localStorage.setItem(AUTH_KEYS.EXPIRES_AT, String(expiresAt));
  }
};

// 從本地存儲加載認證狀態
export const loadAuthState = () => {
  try {
    const isAuthenticated =
      localStorage.getItem(AUTH_KEYS.IS_AUTHENTICATED) === 'true';
    const userString = localStorage.getItem(AUTH_KEYS.USER);
    const user = userString ? JSON.parse(userString) : null;
    const token = localStorage.getItem(AUTH_KEYS.TOKEN) || undefined;
    const refreshToken =
      localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN) || undefined;
    const expiresAtString = localStorage.getItem(AUTH_KEYS.EXPIRES_AT);
    const expiresAt = expiresAtString
      ? parseInt(expiresAtString, 10)
      : undefined;

    return {
      isAuthenticated,
      user,
      token,
      refreshToken,
      expiresAt,
    };
  } catch (error) {
    console.error('Failed to load auth state from localStorage:', error);
    return {
      isAuthenticated: false,
      user: null,
      token: undefined,
      refreshToken: undefined,
      expiresAt: undefined,
    };
  }
};

// 檢查令牌是否過期
export const isTokenExpired = (): boolean => {
  const expiresAtString = localStorage.getItem(AUTH_KEYS.EXPIRES_AT);
  if (!expiresAtString) return true;

  const expiresAt = parseInt(expiresAtString, 10);
  return new Date().getTime() > expiresAt;
};

// 清除所有認證相關數據
export const clearAuthState = (): void => {
  localStorage.removeItem(AUTH_KEYS.IS_AUTHENTICATED);
  localStorage.removeItem(AUTH_KEYS.USER);
  localStorage.removeItem(AUTH_KEYS.TOKEN);
  localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(AUTH_KEYS.EXPIRES_AT);
};

// 獲取令牌
export const getToken = (): string | null => {
  return localStorage.getItem(AUTH_KEYS.TOKEN);
};

// 獲取刷新令牌
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN);
};

// 更新令牌
export const updateToken = (
  token: string,
  refreshToken?: string,
  expiresIn?: number
): void => {
  localStorage.setItem(AUTH_KEYS.TOKEN, token);

  if (refreshToken) {
    localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, refreshToken);
  }

  if (expiresIn) {
    const expiresAt = new Date().getTime() + expiresIn * 1000;
    localStorage.setItem(AUTH_KEYS.EXPIRES_AT, String(expiresAt));
  }
};

export default {
  saveAuthState,
  loadAuthState,
  clearAuthState,
  isTokenExpired,
  getToken,
  getRefreshToken,
  updateToken,
};
