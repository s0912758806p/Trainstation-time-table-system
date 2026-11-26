'use client';
/**
 * 查詢表單：依起訖站（→ /search）或依車次（→ /trains/[no]）。
 * 送出時記錄到「最近查詢」。
 */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { addDays, formatDateLabel, nextSaturday, todayTW } from '@/lib/format';
import { pushRecent, useRecent } from '@/lib/stores/prefs';
import type { Station } from '@/lib/types';
import { SearchIcon, SwapIcon } from './icons';
import { StationPicker } from './StationPicker';

const TIMES = ['00:00', '06:00', '09:00', '12:00', '15:00', '18:00'];

export function SearchForm({
  stations, initial,
}: {
  stations: Station[];
  initial: { from: string; to: string; date: string; after?: string };
}) {
  const router = useRouter();
  const recent = useRecent();
  const today = todayTW();
  const [mode, setMode] = useState<'station' | 'train'>('station');
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [date, setDate] = useState(initial.date);
  const [after, setAfter] = useState(initial.after ?? '00:00');
  const [trainNo, setTrainNo] = useState('');
  const [error, setError] = useState('');

  const quick = [
    { label: '今天', date: today },
    { label: '明天', date: addDays(today, 1) },
    { label: '週六', date: nextSaturday(today) },
  ];
  const name = (id: string) => stations.find((s) => s.id === id)?.name ?? id;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'train') {
      const no = trainNo.trim();
      if (!/^\d{1,4}$/.test(no)) return setError('請輸入 1–4 位數的車次號碼');
      router.push(`/trains/${no}?date=${date}`);
      return;
    }
    if (from === to) return setError('出發站與抵達站不能相同');
    pushRecent({ fromId: from, fromName: name(from), toId: to, toName: name(to) });
    const q = new URLSearchParams({ from, to, date });
    if (after !== '00:00') q.set('after', after);
    router.push(`/search?${q}`);
  };

  return (
    <form onSubmit={submit} aria-label="查詢班次" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="seg" role="group" aria-label="查詢方式">
          <button type="button" aria-pressed={mode === 'station'} onClick={() => setMode('station')}>依起訖站</button>
          <button type="button" aria-pressed={mode === 'train'} onClick={() => setMode('train')}>依車次</button>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="快速選擇日期">
          {quick.map((d) => (
            <button key={d.label} type="button" className="chip" aria-pressed={date === d.date} onClick={() => setDate(d.date)}>
              {d.label} <span className="num font-medium">{formatDateLabel(d.date)}</span>
            </button>
          ))}
        </div>
      </div>

      {mode === 'station' ? (
        <div className="grid grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)] items-center gap-3 lg:grid-cols-[minmax(0,1.2fr)_44px_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
          <StationPicker label="出發站" stations={stations} value={from} onChange={setFrom} />
          <button type="button" className="swap" aria-label="交換出發站與抵達站" onClick={() => { setFrom(to); setTo(from); }}><SwapIcon size={18} /></button>
          <StationPicker label="抵達站" stations={stations} value={to} onChange={setTo} />
          <label className="field col-span-3 lg:col-span-1">
            <span className="k">乘車日期</span>
            <input type="date" className="v num w-full bg-transparent outline-none" style={{ fontSize: 18 }} value={date} min={today} max={addDays(today, 27)} onChange={(e) => e.target.value && setDate(e.target.value)} />
          </label>
          <label className="field col-span-3 lg:col-span-1">
            <span className="k">出發時間</span>
            <select className="v num w-full bg-transparent outline-none" style={{ fontSize: 18 }} value={after} onChange={(e) => setAfter(e.target.value)}>
              {TIMES.map((t) => <option key={t} value={t}>{t === '00:00' ? '不限時間' : `${t} 之後`}</option>)}
            </select>
          </label>
          <button type="submit" className="btn btn-accent btn-lg col-span-3 lg:col-span-1 min-h-[68px] px-7">
            <SearchIcon /> 查詢班次
          </button>
        </div>
      ) : (
        <div className="grid items-end gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto]">
          <div>
            <label className="flabel" htmlFor="train-no">車次號碼</label>
            <input id="train-no" className="input num h-[68px] text-xl font-bold" inputMode="numeric" placeholder="例如 105、431" value={trainNo} onChange={(e) => setTrainNo(e.target.value)} />
          </div>
          <label className="field">
            <span className="k">乘車日期</span>
            <input type="date" className="v num w-full bg-transparent outline-none" style={{ fontSize: 18 }} value={date} min={today} max={addDays(today, 27)} onChange={(e) => e.target.value && setDate(e.target.value)} />
          </label>
          <button type="submit" className="btn btn-accent btn-lg min-h-[68px] px-7">查詢車次</button>
        </div>
      )}

      {error && <p role="alert" className="text-sm font-bold" style={{ color: 'var(--bad)' }}>{error}</p>}

      {recent.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="label">最近查詢</span>
          {recent.map((r) => (
            <Link key={`${r.fromId}-${r.toId}`} className="chip" href={`/search?from=${r.fromId}&to=${r.toId}&date=${date}`}>
              {r.fromName} → {r.toName}
            </Link>
          ))}
        </div>
      )}
    </form>
  );
}
