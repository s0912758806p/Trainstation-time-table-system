import { message } from 'antd';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://ptx.transportdata.tw/MOTC/v2';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

/**
 * 發送HTTP請求的函數
 */
export async function request<T>(url: string, options?: RequestOptions): Promise<T> {
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
    
    // 添加默認請求頭
    const headers = new Headers(restOptions?.headers);
    if (!headers.has('Content-Type') && restOptions?.method !== 'GET') {
      headers.append('Content-Type', 'application/json');
    }
    
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
