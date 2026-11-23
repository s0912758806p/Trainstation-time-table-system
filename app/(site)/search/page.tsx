import type { Metadata } from 'next';
import Link from 'next/link';
import { FavoriteButton } from '@/components/FavoriteButton';
import { ArrowRight, SwapIcon } from '@/components/icons';
import { ResultsList } from '@/components/ResultsList';
import { SearchForm } from '@/components/SearchForm';
import { DEFAULT_FROM, DEFAULT_TO } from '@/lib/constants';
import { getStations, searchTrips } from '@/lib/data';
import { addDays, formatDateLabel, formatMonthDay, isValidDate, timeToMin, todayTW, weekday } from '@/lib/format';

type SP = Promise<{ from?: string; to?: string; date?: string; after?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const { from, to } = await searchParams;
  const { data: stations } = await getStations();
  const a = stations.find((s) => s.id === from)?.name;
  const b = stations.find((s) => s.id === to)?.name;
  return { title: a && b ? `${a} → ${b} 時刻表` : '時刻查詢' };
}

export default async function SearchPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const today = todayTW();
  const { data: stations } = await getStations();
  const from = stations.find((s) => s.id === sp.from);
  const to = stations.find((s) => s.id === sp.to);
  const date = isValidDate(sp.date) && sp.date >= today ? sp.date : today;
  const after = /^\d{2}:\d{2}$/.test(sp.after ?? '') ? sp.after! : '00:00';

  if (!from || !to || from.id === to.id) {
    return (
      <div className="wrap flex flex-col gap-5 pt-7">
        <h1 className="text-[26px] font-black">時刻查詢</h1>
        {sp.from && sp.to && <p role="alert" className="font-bold" style={{ color: 'var(--bad)' }}>查詢條件不完整或起訖站相同，請重新選擇。</p>}
        <section className="card p-5 sm:px-6">
          <SearchForm stations={stations} initial={{ from: from?.id ?? DEFAULT_FROM, to: to?.id ?? DEFAULT_TO, date: addDays(today, 1) }} />
        </section>
      </div>
    );
  }

  const { data: all } = await searchTrips(from.id, to.id, date);
  const minAfter = timeToMin(after);
  const trips = all.filter((t) => t.from.depMin % 1440 >= minAfter);
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  const qs = (d: string) => `/search?from=${from.id}&to=${to.id}&date=${d}${after !== '00:00' ? `&after=${after}` : ''}`;

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="wrap pt-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-3 text-[28px] font-black">
                {from.name}<ArrowRight size={22} style={{ color: 'var(--accent)' }} aria-label="到" role="img" aria-hidden={false} />{to.name}
              </h1>
              <p className="num mt-0.5 text-sm font-semibold text-muted">{formatDateLabel(date)}・{after === '00:00' ? '全天' : `${after} 之後`}・全部車種</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <FavoriteButton route={{ fromId: from.id, fromName: from.name, toId: to.id, toName: to.name }} />
              <Link className="btn btn-ghost btn-sm" href={`/search?from=${to.id}&to=${from.id}&date=${date}`}><SwapIcon size={16} />回程</Link>
              <Link className="btn btn-ghost btn-sm" href="#modify">修改查詢</Link>
            </div>
          </div>
          <nav aria-label="選擇日期" className="flex gap-2 overflow-x-auto pb-4">
            {days.map((d) => (
              <Link key={d} href={qs(d)} aria-current={d === date ? 'date' : undefined}
                className={`flex min-h-14 min-w-[84px] shrink-0 flex-col items-center justify-center rounded-xl border no-underline ${d === date ? 'border-primary bg-primary text-on-primary' : 'border-line bg-surface text-ink2'}`}>
                <b className="num text-base">{formatMonthDay(d)}</b>
                <span className="text-xs font-semibold">{d === today ? '今天' : `週${weekday(d)}`}</span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <div className="wrap flex flex-col gap-6 pt-6">
        {all.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 p-10 text-center">
            <p className="text-lg font-extrabold">{from.name}到{to.name}沒有直達班次</p>
            <p className="text-muted">兩站不在同一條路線上時需要轉乘，建議先查詢到臺北或其他轉乘站的班次。</p>
            <Link className="btn btn-ghost mt-2" href={`/search?from=${from.id}&to=1000&date=${date}`}>改查 {from.name} → 臺北</Link>
          </div>
        ) : (
          <ResultsList trips={trips} />
        )}
        <section id="modify" className="card scroll-mt-24 p-5 sm:px-6" aria-label="修改查詢">
          <h2 className="h-sec mb-3">修改查詢</h2>
          <SearchForm stations={stations} initial={{ from: from.id, to: to.id, date, after }} />
        </section>
      </div>
    </>
  );
}
