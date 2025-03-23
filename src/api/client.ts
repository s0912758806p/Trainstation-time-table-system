import { message } from 'antd';
import jsSHA from 'jssha';

const BASE_URL =
  import.meta.env.VITE_API_URL || 'https://ptx.transportdata.tw/MOTC/v2';
const APP_ID = import.meta.env.VITE_PTX_APP_ID || '';
const APP_KEY = import.meta.env.VITE_PTX_APP_KEY || '';

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
 * 發送HTTP請求的函數
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
