/**
 * 路由保護（Next.js 16 的 proxy，即舊版 middleware）：
 * 訂票、訂單、會員中心需要登入的會員；訪客會被導向登入頁並帶上 next 參數。
 * 時刻、車站、幫助中心為公開頁面。
 */
import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/constants';

export function proxy(req: NextRequest) {
  const raw = req.cookies.get(SESSION_COOKIE)?.value;
  let member = false;
  try {
    member = !!raw && !JSON.parse(raw).guest;
  } catch {
    member = false;
  }
  if (member) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.search = '';
  url.searchParams.set('next', req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/booking/:path*', '/orders/:path*', '/account/:path*'],
};
