'use client';
/**
 * 以 localStorage 為後端的極簡外部狀態，配合 useSyncExternalStore 使用。
 * 讀寫都包在 try/catch：私密模式或停用儲存時，頁面仍以預設值正常運作。
 */
import { useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();
const snapshots = new Map<string, { raw: string | null; value: unknown }>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = () => cb();
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', onStorage);
  };
}

export function readLocal<T>(key: string, fallback: T): T {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    raw = null;
  }
  // 沒有資料時直接回傳呼叫端自己的 fallback，不能快取（不同呼叫端的 fallback 不同）
  if (raw == null) return fallback;
  const cached = snapshots.get(key);
  if (cached && cached.raw === raw) return cached.value as T;
  let value: T;
  try {
    value = JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
  snapshots.set(key, { raw, value });
  return value;
}

export function writeLocal<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 儲存不可用時，本次瀏覽期間無法保存
  }
  listeners.forEach((l) => l());
}

/** fallback 必須是模組層級常數，確保伺服器端快照穩定 */
export function useLocal<T>(key: string, fallback: T): T {
  return useSyncExternalStore(
    subscribe,
    () => readLocal(key, fallback),
    () => fallback,
  );
}

/** 判斷是否已在瀏覽器完成 hydration（避免讀取 localStorage 前閃爍空狀態） */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
