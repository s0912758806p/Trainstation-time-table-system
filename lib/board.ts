/** 車站看板的純函式（不依賴 React，方便單元測試） */
import type { BoardEntry } from './types';

const FALLBACK = ['順行', '逆行'] as const;

/**
 * 該方向出現次數最多的兩個終點站。優先採用對號列車的終點站（區間車班次多但多為短程，
 * 會讓臺北站顯示成「往中壢」），沒有對號列車時才用全部班次。
 */
export function directionLabel(entries: BoardEntry[], dir: 0 | 1): string {
  const inDir = entries.filter((e) => e.direction === dir && e.destName);
  const express = inDir.filter((e) => e.type !== 'qj' && e.type !== 'qjk');
  const counts = new Map<string, number>();
  for (const e of express.length ? express : inDir) {
    counts.set(e.destName, (counts.get(e.destName) ?? 0) + 1);
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([name]) => name);
  return top.length ? `往${top.join('、')}` : FALLBACK[dir];
}
