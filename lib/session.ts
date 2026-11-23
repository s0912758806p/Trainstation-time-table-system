/**
 * 模擬登入狀態：cookie `ts_session` 存放 { name, email, guest }。
 * 沒有真正的帳號系統，任何帳密都能登入；proxy.ts 依此 cookie 保護訂票與訂單頁。
 */
import 'server-only';
import { cookies } from 'next/headers';

import { SESSION_COOKIE } from './constants';

export { SESSION_COOKIE };

export interface Session {
  name: string;
  email: string;
  guest: boolean;
}

export function parseSession(raw: string | undefined): Session | null {
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as Partial<Session>;
    if (typeof s.name !== 'string' || !s.name) return null;
    return { name: s.name, email: s.email ?? '', guest: !!s.guest };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  return parseSession(jar.get(SESSION_COOKIE)?.value);
}
