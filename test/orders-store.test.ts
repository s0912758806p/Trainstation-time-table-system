import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { NewOrder } from '@/lib/stores/orders';

/** 最小的 localStorage 替身；broken = true 時模擬私密模式（存取會丟錯） */
function fakeWindow(broken = false) {
  const store = new Map<string, string>();
  const guard = () => { if (broken) throw new Error('SecurityError'); };
  return {
    store,
    window: {
      localStorage: {
        getItem: (k: string) => (guard(), store.get(k) ?? null),
        setItem: (k: string, v: string) => { guard(); store.set(k, v); },
      },
      addEventListener() {},
      removeEventListener() {},
    },
  };
}

async function setup(broken = false) {
  vi.resetModules(); // readLocal 的快照快取在模組層級
  const fake = fakeWindow(broken);
  vi.stubGlobal('window', fake.window);
  return { ...fake, orders: await import('@/lib/stores/orders'), local: await import('@/lib/stores/local') };
}

const input = (over: Partial<NewOrder> = {}): NewOrder => ({
  date: '2026-12-01', trainNo: '101', trainType: 'zq', typeName: '自強', fromId: '1000', fromName: '臺北',
  toId: '4400', toName: '高雄', dep: '08:00', arr: '11:30', durationMin: 210,
  pax: { adult: 2, child: 0, senior: 0, love: 0 }, seatPref: 'window', amount: 1686,
  contact: { name: '王小明', email: 'a@b.co', phone: '' }, reservable: true, ...over,
});

describe('orders store', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-24T02:00:00Z'));
  });
  afterEach(() => vi.useRealTimers());

  it('seeds demo orders on first visit', async () => {
    const { orders, store } = await setup();
    orders.ensureSeeded();
    const saved = JSON.parse(store.get('ts.orders.v1')!);
    expect(saved).toHaveLength(4);
  });

  it('creates pending orders with sequential ids and a 30-minute pay window', async () => {
    const { orders, store } = await setup();
    const a = orders.createOrder(input());
    const b = orders.createOrder(input());
    expect(a.id).toBe('TW20261201001');
    expect(b.id).toBe('TW20261201002');
    expect(a.status).toBe('pending');
    expect(new Date(a.payBy).getTime() - new Date(a.createdAt).getTime()).toBe(orders.PAY_WINDOW_MIN * 60_000);
    expect(a.seats).toMatch(/^\d+ 車 \d+、\d+ 號$/);
    expect(JSON.parse(store.get('ts.orders.v1')!)[0]).not.toHaveProperty('reservable');
  });

  it('commuter trains get unreserved seats', async () => {
    const { orders } = await setup();
    expect(orders.createOrder(input({ reservable: false, trainType: 'qj' })).seats).toBe('自由座');
  });

  it('unpaid orders expire after the pay window', async () => {
    const { orders } = await setup();
    const o = orders.createOrder(input());
    expect(orders.getOrder(o.id)?.status).toBe('pending');
    vi.advanceTimersByTime(31 * 60_000);
    expect(orders.getOrder(o.id)?.status).toBe('cancelled');
  });

  it('paid orders become done after the travel date', async () => {
    const { orders } = await setup();
    const o = orders.createOrder(input({ date: '2026-11-24' }));
    orders.payOrder(o.id);
    expect(orders.getOrder(o.id)?.status).toBe('paid');
    vi.setSystemTime(new Date('2026-11-26T02:00:00Z'));
    expect(orders.getOrder(o.id)?.status).toBe('done');
  });

  it('refund and cancel update the stored status', async () => {
    const { orders } = await setup();
    const a = orders.createOrder(input());
    const b = orders.createOrder(input());
    orders.refundOrder(a.id);
    orders.cancelOrder(b.id);
    expect(orders.getOrder(a.id)?.status).toBe('refunded');
    expect(orders.getOrder(b.id)?.status).toBe('cancelled');
  });

  it('paxSummary lists only non-zero passenger types', async () => {
    const { orders } = await setup();
    expect(orders.paxSummary({ adult: 2, child: 0, senior: 1, love: 0 })).toBe('全票 × 2、敬老票 × 1');
  });

  it('readLocal returns the fallback for corrupt JSON or unavailable storage', async () => {
    const { local, store } = await setup();
    store.set('k', '{not json');
    expect(local.readLocal('k', 'fallback')).toBe('fallback');

    const broken = await setup(true);
    expect(broken.local.readLocal('k', 'fallback')).toBe('fallback');
    expect(() => broken.local.writeLocal('k', 1)).not.toThrow();
  });
});
