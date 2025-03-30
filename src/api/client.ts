import { message } from 'antd';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { store } from '../store';
import { logout, updateToken } from '../store/authSlice';
import authStorage from '../utils/authStorage';

// 強制使用模擬數據，無論環境
export const USE_MOCK_API = true;

// 模擬API延遲 (300-800ms)
const simulateNetworkDelay = (): Promise<void> => {
  const delay = 300 + Math.random() * 500;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

// 創建 axios 實例用於一般 API 請求
const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

// 請求攔截器
apiClient.interceptors.request.use(
  async (config) => {
    // 嘗試獲取用戶令牌
    const userToken = authStorage.getToken();

    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 響應攔截器 - 處理身份驗證錯誤
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // 處理 401 錯誤（未授權）
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 使用刷新令牌模擬獲取新的訪問令牌
        const refreshToken = authStorage.getRefreshToken();

        if (refreshToken) {
          // 模擬刷新令牌過程
          await simulateNetworkDelay();

          const token = `new-token-${Date.now()}`;
          const newRefreshToken = `new-refresh-token-${Date.now()}`;
          const expiresIn = 3600;

          // 更新令牌
          store.dispatch(
            updateToken({
              token,
              refreshToken: newRefreshToken,
              expiresIn,
            })
          );

          // 用新令牌重試原始請求
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${token}`;

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // 刷新令牌失敗，登出用戶
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    // 處理其他錯誤
    return Promise.reject(error);
  }
);

// API 請求輔助函數

/**
 * 發送 GET 請求
 */
export const fetchData = async <T>(url: string, params = {}): Promise<T> => {
  try {
    // 模擬網絡延遲
    await simulateNetworkDelay();
    const response: AxiosResponse<T> = await apiClient.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(`GET request failed for ${url}:`, error);
    throw error;
  }
};

/**
 * 發送 POST 請求
 */
export const postData = async <T>(url: string, data = {}): Promise<T> => {
  try {
    // 模擬網絡延遲
    await simulateNetworkDelay();
    const response: AxiosResponse<T> = await apiClient.post(url, data);
    return response.data;
  } catch (error) {
    console.error(`POST request failed for ${url}:`, error);
    throw error;
  }
};

/**
 * 發送 PUT 請求
 */
export const putData = async <T>(url: string, data = {}): Promise<T> => {
  try {
    // 模擬網絡延遲
    await simulateNetworkDelay();
    const response: AxiosResponse<T> = await apiClient.put(url, data);
    return response.data;
  } catch (error) {
    console.error(`PUT request failed for ${url}:`, error);
    throw error;
  }
};

/**
 * 發送 DELETE 請求
 */
export const deleteData = async <T>(url: string): Promise<T> => {
  try {
    // 模擬網絡延遲
    await simulateNetworkDelay();
    const response: AxiosResponse<T> = await apiClient.delete(url);
    return response.data;
  } catch (error) {
    console.error(`DELETE request failed for ${url}:`, error);
    throw error;
  }
};
