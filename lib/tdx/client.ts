/**
 * TDX（運輸資料流通服務）伺服器端用戶端。
 *
 * - 以 OAuth2 client_credentials 取得 access token，快取到過期前 60 秒。
 * - TDX_CLIENT_ID / TDX_CLIENT_SECRET 只在伺服器端讀取，絕不加 NEXT_PUBLIC_ 前綴。
 * - 端點路徑依 TDX v3 Rail/TRA 文件撰寫，取得金鑰後請對照 TDX Swagger 驗證；
 *   任何呼叫失敗時 lib/data 會自動改用模擬資料。
 */
import 'server-only';

const TOKEN_URL = 'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token';
const API_BASE = 'https://tdx.transportdata.tw/api/basic';

let token: { value: string; expiresAt: number } | null = null;

export function tdxConfigured(): boolean {
  return process.env.USE_MOCK !== 'true' && !!process.env.TDX_CLIENT_ID && !!process.env.TDX_CLIENT_SECRET;
}

async function getToken(): Promise<string> {
  if (token && Date.now() < token.expiresAt) return token.value;
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.TDX_CLIENT_ID ?? '',
      client_secret: process.env.TDX_CLIENT_SECRET ?? '',
    }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`TDX token ${res.status}`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  token = { value: json.access_token, expiresAt: Date.now() + (json.expires_in - 60) * 1000 };
  return token.value;
}

/**
 * 呼叫 TDX API。revalidate 為伺服器端快取秒數（時刻表 1 小時、車站 1 天、即時看板 30 秒）。
 */
export async function tdxGet<T>(path: string, revalidate: number): Promise<T> {
  const url = new URL(API_BASE + path);
  url.searchParams.set('$format', 'JSON');
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${await getToken()}`, 'Accept-Encoding': 'gzip' },
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`TDX ${res.status} ${path}`);
  return (await res.json()) as T;
}

/** TDX v3 臺鐵端點；集中在這裡，方便對照官方文件調整 */
export const TDX_PATHS = {
  stations: () => '/v3/Rail/TRA/Station',
  odTimetable: (from: string, to: string, date: string) => `/v3/Rail/TRA/DailyTrainTimetable/OD/${from}/to/${to}/${date}`,
  trainTimetable: (no: string, date: string) => `/v3/Rail/TRA/DailyTrainTimetable/TrainNo/${no}/TrainDate/${date}`,
  odFare: (from: string, to: string) => `/v3/Rail/TRA/ODFare/${from}/to/${to}`,
  liveBoard: (stationId: string) => `/v3/Rail/TRA/StationLiveBoard/Station/${stationId}`,
};
