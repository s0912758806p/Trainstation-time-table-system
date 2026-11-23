'use server';
/**
 * 模擬登入／登出（Server Actions）：設定或清除 ts_session cookie 後 redirect，
 * Next.js 會自動以新的 cookie 重新渲染伺服器元件。
 */
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE } from '@/lib/constants';
import { safeNext } from '@/lib/safeNext';

export async function signIn(input: { name?: string; email?: string; guest?: boolean; next?: string }): Promise<{ error: string } | void> {
  const guest = !!input.guest;
  const email = (input.email ?? '').trim().slice(0, 120);
  if (!guest && !/^\S+@\S+\.\S+$/.test(email)) return { error: '請輸入有效的電子郵件' };
  const name = guest ? '訪客' : ((input.name ?? '').trim() || email.split('@')[0] || '旅客').slice(0, 40);

  (await cookies()).set(SESSION_COOKIE, JSON.stringify({ name, email: guest ? '' : email, guest }), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  // 訪客不能進入受保護頁，避免被 proxy 導回登入頁形成迴圈
  const next = safeNext(input.next);
  redirect(guest && /^\/(booking|orders|account)/.test(next) ? '/' : next);
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect('/');
}
