import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { SESSION_COOKIE } from '@/lib/constants';
import { parseSession } from '@/lib/session';
import { config, proxy } from '@/proxy';

const req = (path: string, session?: object | string) => {
  const value = typeof session === 'string' ? session : JSON.stringify(session);
  return new NextRequest(`http://localhost${path}`, {
    headers: session === undefined ? {} : { cookie: `${SESSION_COOKIE}=${encodeURIComponent(value)}` },
  });
};

describe('proxy route guard', () => {
  it('protects booking, orders and account', () => {
    expect(config.matcher).toEqual(['/booking/:path*', '/orders/:path*', '/account/:path*']);
  });

  it('lets members through', () => {
    const res = proxy(req('/orders', { name: '小明', email: 'a@b.co', guest: false }));
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });

  it.each([
    ['no session', undefined],
    ['guest', { name: '訪客', email: '', guest: true }],
    ['corrupt cookie', '{oops'],
  ])('redirects to login with next for %s', (_label, session) => {
    const res = proxy(req('/booking?train=101&date=2026-11-24', session as object | string | undefined));
    expect(res.status).toBe(307);
    const loc = new URL(res.headers.get('location')!);
    expect(loc.pathname).toBe('/login');
    expect(loc.searchParams.get('next')).toBe('/booking?train=101&date=2026-11-24');
  });
});

describe('parseSession', () => {
  it('accepts a valid session and rejects junk', () => {
    expect(parseSession(JSON.stringify({ name: 'A', email: 'a@b.co' }))).toEqual({ name: 'A', email: 'a@b.co', guest: false });
    expect(parseSession(undefined)).toBeNull();
    expect(parseSession('{bad')).toBeNull();
    expect(parseSession(JSON.stringify({ email: 'x' }))).toBeNull();
  });
});
