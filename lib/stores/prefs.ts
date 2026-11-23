'use client';
/** 使用者偏好（localStorage）：最近查詢、常用路線、已讀通知。 */
import { readLocal, useLocal, writeLocal } from './local';

export interface RoutePref {
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
}

const RECENT = 'ts.recent.v1';
const FAVS = 'ts.favorites.v1';
const READ = 'ts.notices-read.v1';

const NO_ROUTES: RoutePref[] = [];
const DEFAULT_FAVS: RoutePref[] = [
  { fromId: '1000', fromName: '臺北', toId: '3300', toName: '臺中' },
  { fromId: '1000', fromName: '臺北', toId: '7000', toName: '花蓮' },
  { fromId: '1210', fromName: '新竹', toId: '1000', toName: '臺北' },
];
const NO_IDS: string[] = [];

const same = (a: RoutePref, b: RoutePref) => a.fromId === b.fromId && a.toId === b.toId;

export const useRecent = () => useLocal(RECENT, NO_ROUTES);
export const useFavorites = () => useLocal(FAVS, DEFAULT_FAVS);
export const useReadNotices = () => useLocal(READ, NO_IDS);

export function pushRecent(r: RoutePref) {
  const list = readLocal(RECENT, NO_ROUTES).filter((x) => !same(x, r));
  writeLocal(RECENT, [r, ...list].slice(0, 5));
}

export function clearRecent() {
  writeLocal(RECENT, NO_ROUTES);
}

export function toggleFavorite(r: RoutePref) {
  const list = readLocal(FAVS, DEFAULT_FAVS);
  writeLocal(FAVS, list.some((x) => same(x, r)) ? list.filter((x) => !same(x, r)) : [r, ...list].slice(0, 8));
}

export function markNoticesRead(ids: string[]) {
  writeLocal(READ, Array.from(new Set([...readLocal(READ, NO_IDS), ...ids])));
}
