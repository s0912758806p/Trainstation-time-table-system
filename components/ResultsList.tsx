'use client';
/** 查詢結果：車種／時段／服務篩選、三種排序；篩選後無結果時提供清除。 */
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { formatPrice } from '@/lib/format';
import { TRAIN_ORDER_LABEL } from '@/lib/labels';
import { TRAIN_TYPES, TRAIN_TYPE_ORDER } from '@/lib/trainTypes';
import type { Trip, TrainTypeKey } from '@/lib/types';
import { FilterIcon } from './icons';
import { Journey, SeatBadge, TrainNo, TrainTypeBadge } from './train';

type Sort = 'dep' | 'dur' | 'price';
const PERIODS = [
  { key: 'early', label: '清晨 05–09', from: 300, to: 540 },
  { key: 'am', label: '上午 09–12', from: 540, to: 720 },
  { key: 'pm', label: '下午 12–18', from: 720, to: 1080 },
  { key: 'eve', label: '晚上 18 之後', from: 1080, to: 1740 },
] as const;

export function ResultsList({ trips }: { trips: Trip[] }) {
  const [sort, setSort] = useState<Sort>('dep');
  const [types, setTypes] = useState<Set<TrainTypeKey>>(new Set());
  const [periods, setPeriods] = useState<Set<string>>(new Set());
  const [onlySeats, setOnlySeats] = useState(false);
  const [wheelchair, setWheelchair] = useState(false);
  const [bike, setBike] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const present = TRAIN_TYPE_ORDER.filter((t) => trips.some((x) => x.train.type === t));
  const toggle = <T,>(set: Set<T>, v: T, fn: (s: Set<T>) => void) => {
    const n = new Set(set);
    if (n.has(v)) n.delete(v); else n.add(v);
    fn(n);
  };
  const reset = () => { setTypes(new Set()); setPeriods(new Set()); setOnlySeats(false); setWheelchair(false); setBike(false); };

  const list = useMemo(() => {
    const filtered = trips.filter((t) => {
      if (types.size && !types.has(t.train.type)) return false;
      if (periods.size) {
        const m = t.from.depMin % 1440;
        if (!PERIODS.some((p) => periods.has(p.key) && m >= p.from && m < p.to)) return false;
      }
      if (onlySeats && t.seat === 'none') return false;
      if (wheelchair && !t.train.services.wheelchair) return false;
      if (bike && !t.train.services.bike) return false;
      return true;
    });
    if (sort === 'dur') return [...filtered].sort((a, b) => a.durationMin - b.durationMin);
    if (sort === 'price') return [...filtered].sort((a, b) => (a.fare ?? 1e9) - (b.fare ?? 1e9) || a.durationMin - b.durationMin);
    return filtered;
  }, [trips, types, periods, onlySeats, wheelchair, bike, sort]);

  const count = (fn: (t: Trip) => boolean) => trips.filter(fn).length;
  const check = (id: string, label: React.ReactNode, checked: boolean, onChange: () => void, n?: number) => (
    <label key={id} className="flex min-h-10 cursor-pointer items-center gap-2.5 text-sm font-semibold">
      <input type="checkbox" className="h-[18px] w-[18px] accent-[var(--primary)]" checked={checked} onChange={onChange} />
      {label}
      {n != null && <span className="num ml-auto text-[13px] text-muted">{n} 班</span>}
    </label>
  );

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className={`card p-5 ${showFilters ? '' : 'hidden lg:block'}`} aria-label="篩選條件">
        <div className="sec-head mb-2"><h2 className="h-sec text-base">篩選</h2><button type="button" className="btn btn-text btn-sm" onClick={reset}>清除</button></div>
        <fieldset className="flex flex-col gap-1 py-1">
          <legend className="label mb-1">車種</legend>
          {present.map((t) => check(t, <TrainTypeBadge type={t} />, types.has(t), () => toggle(types, t, setTypes), count((x) => x.train.type === t)))}
        </fieldset>
        <fieldset className="mt-3 flex flex-col gap-1 border-t border-line pt-4">
          <legend className="label mb-1 pt-4">出發時段</legend>
          {PERIODS.map((p) => check(p.key, p.label, periods.has(p.key), () => toggle(periods, p.key, setPeriods),
            count((x) => { const m = x.from.depMin % 1440; return m >= p.from && m < p.to; })))}
        </fieldset>
        <fieldset className="mt-3 flex flex-col gap-1 border-t border-line pt-4">
          <legend className="label mb-1 pt-4">服務</legend>
          {check('seat', '只顯示有座位', onlySeats, () => setOnlySeats(!onlySeats))}
          {check('wc', '無障礙座位', wheelchair, () => setWheelchair(!wheelchair))}
          {check('bike', '自行車車廂', bike, () => setBike(!bike))}
        </fieldset>
      </aside>

      <section aria-label="班次列表" className="flex min-w-0 flex-col gap-3">
        <div className="sec-head">
          <p className="font-bold" aria-live="polite">共 <span className="num">{list.length}</span> 班列車</p>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="chip lg:hidden" aria-expanded={showFilters} onClick={() => setShowFilters(!showFilters)}><FilterIcon size={16} />篩選</button>
            <div className="seg" role="group" aria-label="排序方式">
              {(['dep', 'dur', 'price'] as Sort[]).map((s) => (
                <button key={s} type="button" aria-pressed={sort === s} onClick={() => setSort(s)}>{TRAIN_ORDER_LABEL[s]}</button>
              ))}
            </div>
          </div>
        </div>

        {list.map((t) => <TripRow key={t.train.no} trip={t} />)}

        {list.length === 0 && (
          <div className="card flex flex-col items-center gap-2 p-10 text-center">
            <p className="text-lg font-extrabold">沒有符合條件的班次</p>
            <p className="text-muted">試著放寬車種或出發時段，或改查其他日期。</p>
            <button type="button" className="btn btn-ghost mt-2" onClick={reset}>清除篩選</button>
          </div>
        )}
      </section>
    </div>
  );
}

function TripRow({ trip }: { trip: Trip }) {
  const { train, from, to, date } = trip;
  const reservable = TRAIN_TYPES[train.type].reservable;
  const sold = trip.seat === 'none';
  const q = `date=${date}&from=${from.stationId}&to=${to.stationId}`;
  const tags = [train.services.wheelchair && '無障礙座位', train.services.bike && '自行車車廂', train.services.nursing && '哺乳室'].filter(Boolean) as string[];

  return (
    <article className={`card flex flex-col gap-3 px-4 py-4 sm:px-5 ${sold ? 'opacity-75' : ''}`}>
      <div className="grid items-center gap-4 md:grid-cols-[110px_minmax(0,1fr)_140px_150px] md:gap-6">
        <div className="flex items-center gap-2 md:flex-col md:items-start">
          <TrainNo no={train.no} /><TrainTypeBadge type={train.type} />
          <span className="ml-auto md:hidden"><SeatBadge seat={trip.seat} /></span>
        </div>
        <Journey dep={from.dep} arr={to.arr} fromName={from.stationName} toName={to.stationName} durationMin={trip.durationMin}
          note={trip.stopsBetween === 0 ? '直達' : `停靠 ${trip.stopsBetween} 站`} />
        <div className="flex items-center justify-between gap-1 md:flex-col md:items-end">
          <span className="price text-[22px]">{formatPrice(trip.fare)}</span>
          <span className="hidden md:inline-flex"><SeatBadge seat={trip.seat} /></span>
        </div>
        <div className="flex gap-1 md:flex-col md:items-stretch">
          {reservable ? (
            sold ? <button type="button" className="btn flex-1" disabled>已售完</button>
              : <Link className="btn btn-accent flex-1" href={`/booking?train=${train.no}&${q}`}>訂票</Link>
          ) : (
            <span className="btn btn-ghost flex-1 cursor-default text-sm" aria-disabled="true" title="區間車為自由座，持票或電子票證即可搭乘">免訂位</span>
          )}
          <Link className="btn btn-text btn-sm flex-1" href={`/trains/${train.no}?${q}`}>停靠站與詳情</Link>
        </div>
      </div>
      {tags.length > 0 && <div className="flex flex-wrap gap-1.5">{tags.map((g) => <span key={g} className="tag">{g}</span>)}</div>}
    </article>
  );
}
