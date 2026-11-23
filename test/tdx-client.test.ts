import { beforeEach, describe, expect, it, vi } from 'vitest';

const ok = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });

async function load() {
  vi.resetModules(); // token 快取在模組層級，每個測試重新載入
  return import('@/lib/tdx/client');
}

describe('TDX client', () => {
  beforeEach(() => {
    vi.stubEnv('TDX_CLIENT_ID', 'id');
    vi.stubEnv('TDX_CLIENT_SECRET', 'secret');
    vi.stubEnv('USE_MOCK', 'false');
  });

  it('tdxConfigured needs both keys and respects USE_MOCK', async () => {
    const { tdxConfigured } = await load();
    expect(tdxConfigured()).toBe(true);
    vi.stubEnv('USE_MOCK', 'true');
    expect(tdxConfigured()).toBe(false);
    vi.stubEnv('USE_MOCK', 'false');
    vi.stubEnv('TDX_CLIENT_SECRET', '');
    expect(tdxConfigured()).toBe(false);
  });

  it('fetches a token once, caches it, and sends it as a bearer header', async () => {
    const fetchMock = vi.fn(async (url: string | URL) =>
      String(url).includes('/token') ? ok({ access_token: 'T', expires_in: 3600 }) : ok({ hello: 1 }));
    vi.stubGlobal('fetch', fetchMock);
    const { tdxGet } = await load();

    await expect(tdxGet('/v3/x', 60)).resolves.toEqual({ hello: 1 });
    await tdxGet('/v3/y', 60);

    const tokenCalls = fetchMock.mock.calls.filter(([u]) => String(u).includes('/token'));
    expect(tokenCalls).toHaveLength(1);
    const [apiUrl, init] = fetchMock.mock.calls[1] as unknown as [URL, RequestInit];
    expect(String(apiUrl)).toBe('https://tdx.transportdata.tw/api/basic/v3/x?%24format=JSON');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer T');
  });

  it('throws on HTTP errors so lib/data can fall back', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('no', { status: 401 })));
    const { tdxGet } = await load();
    await expect(tdxGet('/v3/x', 60)).rejects.toThrow('TDX token 401');
  });
});
