import { message } from 'antd';
import jsSHA from 'jssha';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { store } from '../store';
import { logout, updateToken } from '../store/authSlice';
import authStorage from '../utils/authStorage';

// API 基礎 URL
const BASE_URL =
  import.meta.env.VITE_API_URL || 'https://ptx.transportdata.tw/MOTC/v2';

// PTX API 認證資訊
const APP_ID = import.meta.env.VITE_PTX_APP_ID || '';
const APP_KEY = import.meta.env.VITE_PTX_APP_KEY || '';

// Request 選項接口
interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

/**
 * 取得台鐵 PTX API 認證用的 Header
 */
function getAuthorizationHeader() {
  const GMTString = new Date().toUTCString();
  const ShaObj = new jsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(APP_KEY, 'TEXT');
  ShaObj.update('x-date: ' + GMTString);
  const HMAC = ShaObj.getHMAC('B64');
  const Authorization = `hmac username="${APP_ID}", algorithm="hmac-sha1", headers="x-date", signature="${HMAC}"`;
  return {
    Authorization: Authorization,
    'X-Date': GMTString,
  };
}

/**
 * 台鐵 PTX API 請求函數
 */
export async function request<T>(
  url: string,
  options?: RequestOptions
): Promise<T> {
  try {
    const { params, ...restOptions } = options || {};

    // 構建完整URL，包括查詢參數
    let fullUrl = `${BASE_URL}${url}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      fullUrl += `?${searchParams.toString()}`;
    }

    // 添加默認請求頭和授權信息
    const headers = new Headers(restOptions?.headers);
    if (!headers.has('Content-Type') && restOptions?.method !== 'GET') {
      headers.append('Content-Type', 'application/json');
    }

    // 添加API認證資訊
    const authHeaders = getAuthorizationHeader();
    Object.entries(authHeaders).forEach(([key, value]) => {
      headers.append(key, value);
    });

    // 發送請求
    const response = await fetch(fullUrl, {
      ...restOptions,
      headers,
    });

    // 處理回應
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('API request error:', error);
    message.error('請求失敗，請稍後重試');
    throw error;
  }
}

// 創建 axios 實例用於一般 API 請求
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 請求攔截器 - 添加認證令牌
apiClient.interceptors.request.use(
  (config) => {
    const token = authStorage.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
        // 嘗試使用刷新令牌獲取新的訪問令牌
        const refreshToken = authStorage.getRefreshToken();

        if (refreshToken) {
          // 實際生產環境中應使用真實的刷新令牌 API
          const response = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const {
            token,
            refreshToken: newRefreshToken,
            expiresIn,
          } = response.data;

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
    const response: AxiosResponse<T> = await apiClient.delete(url);
    return response.data;
  } catch (error) {
    console.error(`DELETE request failed for ${url}:`, error);
    throw error;
  }
};

export default {
  apiClient,
  fetchData,
  postData,
  putData,
  deleteData,
};
