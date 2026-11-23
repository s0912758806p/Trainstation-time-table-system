'use client';
/** 車站「即將發車」看板：南下／北上切換，誤點以文字與顏色同時標示。 */
import Link from 'next/link';
import { useState } from 'react';
import type { BoardEntry } from '@/lib/types';
import { TrainTypeBadge } from './train';

export function DepartureBoard({
  stationName, entries, updatedAt, rows = 6, directionLabels = ['南下', '北上・東部'], fullHref, date,
}: {
  stationName: string;
  entries: BoardEntry[];
  updatedAt: string;
  rows?: number;
  directionLabels?: [string, string];
  fullHref?: string;
  date: string;
}) {
  const [dir, setDir] = useState<0 | 1>(0);
  const list = entries.filter((e) => e.direction === dir).slice(0, rows);

  return (
    <section className="board" aria-label={`${stationName}站即將發車`}>
      <div className="board-head">
        <div>
          <h2 className="text-lg font-extrabold">{stationName}站・即將發車</h2>
          <p className="num text-[13px]" style={{ color: 'var(--board-dim)' }}>更新於 {updatedAt}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="seg" role="group" aria-label="行駛方向">
            {directionLabels.map((l, i) => (
              <button key={l} type="button" aria-pressed={dir === i} onClick={() => setDir(i as 0 | 1)}>{l}</button>
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
                <td className="bn"><Link href={`/trains/${e.trainNo}?date=${date}`} className="text-inherit no-underline hover:underline" style={{ color: 'inherit' }}>{e.trainNo}</Link></td>
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
