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

// 是否為開發環境
const IS_DEV = process.env.NODE_ENV === 'development';

// 是否使用模擬數據 (修改此標誌可在開發環境切換真實/模擬 API)
export const USE_MOCK_API = IS_DEV;

// 從環境變量獲取配置
const TDX_APP_ID = import.meta.env.VITE_TDX_APP_ID;
const TDX_APP_KEY = import.meta.env.VITE_TDX_APP_KEY;
const TDX_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://tdx.transportdata.tw/api/basic';

// 保存 TDX 令牌及其過期時間
let tdxToken = {
  accessToken: '',
  expiresAt: 0, // 時間戳，毫秒
};

// Request 選項接口
interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

/**
 * 獲取 API 授權標頭 (HMAC 認證)
 * 用於 TDX API 認證
 */
function getAuthorizationHeader() {
  const date = new Date().toUTCString();
  const shaObj = new jsSHA('SHA-1', 'TEXT');
  shaObj.setHMACKey(TDX_APP_KEY, 'TEXT');
  shaObj.update('x-date: ' + date);
  const HMAC = shaObj.getHMAC('B64');
  const Authorization = `hmac username="${TDX_APP_ID}", algorithm="hmac-sha1", headers="x-date", signature="${HMAC}"`;
  return {
    Authorization,
    'X-Date': date,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*', // 允許所有來源，解決 CORS 問題
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Date',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
  };
}

/**
 * 使用代理伺服器來解決 CORS 問題
 * 測試環境下可能需要設置 proxy 來解決 CORS 問題
 */
function createProxyUrl(path: string): string {
  // 本地開發可以使用代理伺服器，例如在 vite.config.ts 中設置
  if (IS_DEV) {
    return `/api${path}`; // 假設在 vite.config.ts 中設置了代理路徑為 /api
  }
  // 對於生產環境，直接返回完整 URL
  return `${TDX_BASE_URL}${path}`;
}

/**
 * TDX API 請求函數
 */
export async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    // 生成認證標頭
    const headers = {
      ...getAuthorizationHeader(),
      ...options.headers,
    };

    // 創建適合環境的 URL（解決 CORS 問題）
    const url = createProxyUrl(path);

    // 確保 URL 包含正確的格式參數
    const formattedUrl = url.includes('$format=')
      ? url
      : `${url}${url.includes('?') ? '&' : '?'}$format=JSON`;

    // 發送請求
    const response = await fetch(formattedUrl, {
      ...options,
      headers,
      // 添加 fetch 選項以避免 CORS 問題
      mode: 'cors',
      credentials: 'same-origin',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API 請求失敗: ${response.status}`, errorText);

      if (response.status === 429) {
        console.error(
          '遇到 API 速率限制 (429 錯誤)。在開發環境下建議使用模擬數據。'
        );
        message.error('API 呼叫頻率超過限制，請稍後再試或考慮使用模擬數據');
      }

      throw new Error(
        `API request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();

    // 請求成功，記錄結果摘要
    console.log(
      `API 請求成功: ${path}`,
      Array.isArray(data) ? `獲取 ${data.length} 項數據` : '獲取數據成功'
    );

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    message.error('獲取數據失敗，請稍後重試');
    throw error;
  }
}

// 創建 axios 實例用於一般 API 請求
const apiClient: AxiosInstance = axios.create({
  baseURL: IS_DEV ? '/api' : TDX_BASE_URL, // 開發環境使用代理
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
  withCredentials: false, // 避免 CORS 問題
});

// 請求攔截器
apiClient.interceptors.request.use(
  async (config) => {
    // 嘗試獲取用戶令牌 (僅用於應用程序內部認證)
    const userToken = authStorage.getToken();

    if (userToken) {
      // 使用用戶令牌（用於後端 API）
      config.headers.Authorization = `Bearer ${userToken}`;
    } else {
      // 使用 HMAC 認證
      const authHeaders = getAuthorizationHeader();
      config.headers.Authorization = authHeaders.Authorization;
      config.headers['X-Date'] = authHeaders['X-Date'];
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

    if (error.response) {
      console.error(
        `API 回應錯誤: ${error.response.status}`,
        error.response.data
      );
    } else if (error.request) {
      console.error('沒有收到回應:', error.request);
    } else {
      console.error('請求錯誤:', error.message);
    }

    // 處理 401 錯誤（未授權）
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 嘗試使用刷新令牌獲取新的訪問令牌
        const refreshToken = authStorage.getRefreshToken();

        if (refreshToken) {
          // 實際生產環境中應使用真實的刷新令牌 API
          const response = await axios.post(`${TDX_BASE_URL}/auth/refresh`, {
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
