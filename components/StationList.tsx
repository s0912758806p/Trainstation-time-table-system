'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { Region, Station } from '@/lib/types';

const REGIONS: [Region, string][] = [['north', '北部'], ['central', '中部'], ['south', '南部'], ['east', '東部']];

export function StationList({ stations, currentId }: { stations: Station[]; currentId: string }) {
  const current = stations.find((s) => s.id === currentId);
  const [region, setRegion] = useState<Region>(current?.region ?? 'north');
  const [q, setQ] = useState('');
  const term = q.trim().toLowerCase().replace(/台/g, '臺');
  const list = term
    ? stations.filter((s) => s.name.includes(term) || s.en.toLowerCase().includes(term))
    : stations.filter((s) => s.region === region);

  return (
    <aside className="card flex flex-col gap-3 p-4" aria-label="選擇車站">
      <div>
        <label className="flabel" htmlFor="sq">搜尋車站</label>
        <input id="sq" className="input" placeholder="中文或英文站名" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {!term && (
        <div className="seg grid grid-cols-4" role="group" aria-label="地區">
          {REGIONS.map(([k, l]) => <button key={k} type="button" aria-pressed={region === k} onClick={() => setRegion(k)}>{l}</button>)}
        </div>
      )}
      <ul className="flex max-h-[260px] flex-col gap-0.5 overflow-y-auto lg:max-h-[620px]">
        {list.map((s) => {
          const on = s.id === currentId;
          return (
            <li key={s.id}>
              <Link href={`/stations/${s.id}`} aria-current={on ? 'page' : undefined}
                className={`flex min-h-12 items-center justify-between gap-2 rounded-[10px] px-3 no-underline ${on ? 'bg-primary text-on-primary' : 'text-ink hover:bg-subtle'}`}>
                <span className="font-bold">{s.name} <span className="text-[13px] font-medium opacity-75">{s.en}</span></span>
                <span className="text-xs font-semibold opacity-75">{s.grade}</span>
              </Link>
            </li>
          );
        })}
        {list.length === 0 && <li className="px-3 py-6 text-center text-muted">找不到「{q}」</li>}
      </ul>
    </aside>
  );
}
