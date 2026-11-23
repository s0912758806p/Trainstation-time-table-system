'use client';
/**
 * 車站「即將發車」看板：依行駛方向分兩個分頁，誤點以文字與顏色同時標示。
 * 分頁標籤由該方向最常見的終點站產生（例：「往高雄、屏東」），
 * 因此在西部幹線、東部幹線或 TDX 真實資料下都不會標錯方向。
 */
import Link from 'next/link';
import { useState } from 'react';
import type { BoardEntry } from '@/lib/types';
import { TrainTypeBadge } from './train';

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

export function DepartureBoard({
  stationName, entries, updatedAt, rows = 6, fullHref, date,
}: {
  stationName: string;
  entries: BoardEntry[];
  updatedAt: string;
  rows?: number;
  fullHref?: string;
  date: string;
}) {
  const [dir, setDir] = useState<0 | 1>(0);
  const list = entries.filter((e) => e.direction === dir).slice(0, rows);
  const labels = [directionLabel(entries, 0), directionLabel(entries, 1)];

  return (
    <section className="board" aria-label={`${stationName}站即將發車`}>
      <div className="board-head">
        <div>
          <h2 className="text-lg font-extrabold">{stationName}站・即將發車</h2>
          <p className="num text-[13px]" style={{ color: 'var(--board-dim)' }}>更新於 {updatedAt}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="seg" role="group" aria-label="行駛方向">
            {labels.map((l, i) => (
              <button key={i} type="button" aria-pressed={dir === i} onClick={() => setDir(i as 0 | 1)}>{l}</button>
            ))}
          </div>
          {fullHref && <Link href={fullHref} className="btn btn-sm" style={{ color: 'var(--board-ink)', background: 'rgb(255 255 255 / .1)' }}>完整時刻表</Link>}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr><th scope="col">時間</th><th scope="col">車次</th><th scope="col">車種</th><th scope="col">終點站</th><th scope="col">月台</th><th scope="col">狀態</th></tr>
          </thead>
          <tbody>
            {list.map((e) => (
              <tr key={`${e.trainNo}-${e.time}`}>
                <td className="bt">{e.time}</td>
                <td className="bn"><Link href={`/trains/${e.trainNo}?date=${date}`} className="no-underline hover:underline" style={{ color: 'inherit' }}>{e.trainNo}</Link></td>
                <td><TrainTypeBadge type={e.type} /></td>
                <td>{e.destName}</td>
                <td className="bn">{e.platform}</td>
                <td className={e.delayMin > 0 ? 'late' : 'ontime'}>{e.delayMin > 0 ? `晚 ${e.delayMin} 分` : '準點'}</td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={6} style={{ color: 'var(--board-dim)' }}>今日此方向已無班次</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
