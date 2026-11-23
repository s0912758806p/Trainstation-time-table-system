'use client';
/**
 * 訂單（模擬）：存在瀏覽器 localStorage，key = ts.orders.v1。
 * - 訂位後 30 分鐘內未付款 → 讀取時自動視為「已取消」。
 * - 已付款且乘車日已過 → 視為「已完成」。
 * 接上真正的後端時，只需替換這個模組的實作。
 */
import { addDays, hash, todayTW } from '../format';
import type { TrainTypeKey } from '../types';
import { readLocal, useLocal, writeLocal } from './local';

export type OrderStatus = 'pending' | 'paid' | 'done' | 'refunded' | 'cancelled';
export type PaxKey = 'adult' | 'child' | 'senior' | 'love';
export type SeatPref = 'any' | 'window' | 'aisle';

export interface Order {
  id: string;
  status: OrderStatus;
  createdAt: string;
  payBy: string;
  date: string;
  trainNo: string;
  trainType: TrainTypeKey;
  typeName: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  dep: string;
  arr: string;
  durationMin: number;
  pax: Record<PaxKey, number>;
  seatPref: SeatPref;
  seats: string;
  amount: number;
  contact: { name: string; email: string; phone: string };
}

const KEY = 'ts.orders.v1';
const EMPTY: Order[] = [];
export const PAY_WINDOW_MIN = 30;

export const PAX_LABEL: Record<PaxKey, string> = { adult: '全票', child: '孩童票', senior: '敬老票', love: '愛心票' };

export const STATUS_META: Record<OrderStatus, { label: string; pill: string }> = {
  pending: { label: '待付款', pill: 'pill-warn' },
  paid: { label: '已付款', pill: 'pill-ok' },
  done: { label: '已完成', pill: 'pill-info' },
  refunded: { label: '已退款', pill: 'pill-accent' },
  cancelled: { label: '已取消', pill: 'pill-bad' },
};

export function paxSummary(pax: Order['pax']): string {
  return (Object.keys(PAX_LABEL) as PaxKey[])
    .filter((k) => pax[k] > 0)
    .map((k) => `${PAX_LABEL[k]} × ${pax[k]}`)
    .join('、');
}

function effective(o: Order, now = Date.now(), today = todayTW()): Order {
  if (o.status === 'pending' && new Date(o.payBy).getTime() < now) return { ...o, status: 'cancelled' };
  if (o.status === 'paid' && o.date < today) return { ...o, status: 'done' };
  return o;
}

function seed(): Order[] {
  const today = todayTW();
  const base = { contact: { name: '', email: '', phone: '' }, seatPref: 'any' as SeatPref, createdAt: new Date().toISOString(), payBy: new Date().toISOString() };
  const mk = (o: Omit<Order, 'contact' | 'seatPref' | 'createdAt' | 'payBy'>): Order => ({ ...base, ...o });
  return [
    mk({ id: `TW${addDays(today, 5).replaceAll('-', '')}001`, status: 'paid', date: addDays(today, 5), trainNo: '431', trainType: 'pym', typeName: '普悠瑪', fromId: '1000', fromName: '臺北', toId: '6000', toName: '臺東', dep: '07:15', arr: '10:37', durationMin: 202, pax: { adult: 1, child: 0, senior: 0, love: 0 }, seats: '3 車 8 號', amount: 783 }),
    mk({ id: `TW${addDays(today, -20).replaceAll('-', '')}001`, status: 'paid', date: addDays(today, -20), trainNo: '107', trainType: 'zq', typeName: '自強(3000)', fromId: '1000', fromName: '臺北', toId: '3300', toName: '臺中', dep: '08:15', arr: '09:52', durationMin: 97, pax: { adult: 1, child: 0, senior: 0, love: 0 }, seats: '4 車 22 號', amount: 375 }),
    mk({ id: `TW${addDays(today, -38).replaceAll('-', '')}001`, status: 'refunded', date: addDays(today, -38), trainNo: '401', trainType: 'tlg', typeName: '太魯閣', fromId: '1000', fromName: '臺北', toId: '7000', toName: '花蓮', dep: '06:40', arr: '08:31', durationMin: 111, pax: { adult: 2, child: 0, senior: 0, love: 0 }, seats: '2 車 5、6 號', amount: 880 }),
    mk({ id: `TW${addDays(today, -44).replaceAll('-', '')}001`, status: 'cancelled', date: addDays(today, -44), trainNo: '511', trainType: 'jg', typeName: '莒光', fromId: '1000', fromName: '臺北', toId: '4080', toName: '嘉義', dep: '07:30', arr: '11:13', durationMin: 223, pax: { adult: 0, child: 0, senior: 1, love: 0 }, seats: '—', amount: 230 }),
  ];
}

function readRaw(): Order[] {
  const stored = readLocal<Order[] | null>(KEY, null);
  if (stored) return stored;
  const seeded = seed();
  writeLocal(KEY, seeded);
  return seeded;
}

export function useOrders(): Order[] {
  const raw = useLocal<Order[]>(KEY, EMPTY);
  return raw.map((o) => effective(o));
}

/** 首次造訪時寫入示範訂單；在 useEffect 中呼叫 */
export function ensureSeeded() {
  readRaw();
}

export function getOrder(id: string): Order | undefined {
  const o = readRaw().find((x) => x.id === id);
  return o ? effective(o) : undefined;
}

function update(id: string, patch: Partial<Order>) {
  writeLocal(KEY, readRaw().map((o) => (o.id === id ? { ...o, ...patch } : o)));
}

export const payOrder = (id: string) => update(id, { status: 'paid' });
export const cancelOrder = (id: string) => update(id, { status: 'cancelled' });
export const refundOrder = (id: string) => update(id, { status: 'refunded' });

function assignSeats(trainNo: string, date: string, count: number, pref: SeatPref, reservable: boolean): string {
  if (!reservable) return '自由座';
  const h = hash(`${trainNo}|${date}|${Date.now()}`);
  const car = (h % 10) + 1;
  let first = (h % 40) + 1;
  if (pref === 'window' && first % 4 > 1) first += 2;
  if (pref === 'aisle' && first % 4 < 2) first += 2;
  const nums = Array.from({ length: count }, (_, i) => first + i);
  return `${car} 車 ${nums.join('、')} 號`;
}

export type NewOrder = Omit<Order, 'id' | 'status' | 'createdAt' | 'payBy' | 'seats'> & { reservable: boolean };

export function createOrder(input: NewOrder): Order {
  const all = readRaw();
  const prefix = `TW${input.date.replaceAll('-', '')}`;
  const seq = all.filter((o) => o.id.startsWith(prefix)).length + 1;
  const now = new Date();
  const count = Object.values(input.pax).reduce((a, b) => a + b, 0);
  const { reservable, ...rest } = input;
  const order: Order = {
    ...rest,
    id: `${prefix}${String(seq).padStart(3, '0')}`,
    status: 'pending',
    createdAt: now.toISOString(),
    payBy: new Date(now.getTime() + PAY_WINDOW_MIN * 60_000).toISOString(),
    seats: assignSeats(input.trainNo, input.date, count, input.seatPref, reservable),
  };
  writeLocal(KEY, [order, ...all]);
  return order;
}
