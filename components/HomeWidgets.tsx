'use client';
/** 首頁右欄：下一趟行程、常用路線、會員統計（資料來自瀏覽器端訂單與偏好）。 */
import Link from 'next/link';
import { useEffect } from 'react';
import { addDays, formatDateLabel, formatPrice, todayTW } from '@/lib/format';
import { useHydrated } from '@/lib/stores/local';
import { ensureSeeded, paxSummary, STATUS_META, useOrders } from '@/lib/stores/orders';
import { toggleFavorite, useFavorites } from '@/lib/stores/prefs';
import { ChevronRight, StarIcon } from './icons';
import { Journey, TrainNo, TrainTypeBadge } from './train';

export function NextTrip({ member }: { member: boolean }) {
  const hydrated = useHydrated();
  const orders = useOrders();
  useEffect(() => { if (member) ensureSeeded(); }, [member]);
  const today = todayTW();
  const next = orders
    .filter((o) => (o.status === 'pending' || o.status === 'paid') && o.date >= today)
    .sort((a, b) => (a.date + a.dep).localeCompare(b.date + b.dep))[0];

  if (!hydrated) return <section className="card h-[280px] animate-pulse" aria-busy="true" aria-label="下一趟行程載入中" />;

  if (!member || !next) {
    return (
      <section className="card flex flex-col gap-3 p-5 sm:px-6">
        <h2 className="h-sec">下一趟行程</h2>
        <p className="text-muted">{member ? '目前沒有即將出發的車票。' : '登入會員後，這裡會顯示您即將出發的車票。'}</p>
        <Link className="btn btn-ghost" href={member ? `/search?from=1000&to=4400&date=${addDays(today, 1)}` : '/login'}>
          {member ? '查詢班次' : '登入 / 註冊'}
        </Link>
      </section>
    );
  }

  const meta = STATUS_META[next.status];
  return (
    <section className="card flex flex-col gap-3.5 p-5 sm:px-6">
      <div className="sec-head"><h2 className="h-sec">下一趟行程</h2><span className={`pill ${meta.pill}`}>{meta.label}</span></div>
      <div className="flex flex-wrap items-center gap-2">
        <TrainNo no={next.trainNo} /><TrainTypeBadge type={next.trainType} />
        <span className="num text-sm font-semibold text-muted">{formatDateLabel(next.date)}</span>
      </div>
      <Journey dep={next.dep} arr={next.arr} fromName={next.fromName} toName={next.toName} durationMin={next.durationMin} />
      <div className="flex flex-wrap gap-2"><span className="tag">{next.seats}</span><span className="tag">{paxSummary(next.pax)}</span><span className="tag num">{formatPrice(next.amount)}</span></div>
      {next.status === 'pending' && <p className="text-[13px] font-semibold" style={{ color: 'var(--warn)' }}>請於 30 分鐘內完成付款，逾時將自動取消。</p>}
      <div className="flex flex-wrap gap-2">
        <Link className={`btn flex-1 ${next.status === 'pending' ? 'btn-accent' : 'btn-ghost'}`} href={`/orders?id=${next.id}`}>
          {next.status === 'pending' ? '前往付款' : '查看車票'}
        </Link>
      </div>
    </section>
  );
}

export function Favorites({ date }: { date: string }) {
  const favs = useFavorites();
  return (
    <section className="card px-5 py-5 sm:px-6">
      <div className="sec-head mb-1"><h2 className="h-sec">常用路線</h2><span className="text-[13px] text-muted">點選即查詢</span></div>
      {favs.length === 0 && <p className="py-3 text-muted">在查詢結果頁按「加入常用」即可收藏路線。</p>}
      <ul>
        {favs.map((f) => (
          <li key={`${f.fromId}-${f.toId}`} className="flex items-center gap-2 border-t border-line py-2 first:border-0">
            <button type="button" className="ibtn" style={{ color: 'var(--accent)' }} aria-label={`從常用路線移除 ${f.fromName} 到 ${f.toName}`} onClick={() => toggleFavorite(f)}>
              <StarIcon size={18} filled />
            </button>
            <Link href={`/search?from=${f.fromId}&to=${f.toId}&date=${date}`} className="flex flex-1 items-center justify-between gap-2 py-2 font-extrabold text-ink no-underline">
              {f.fromName} → {f.toName}
              <ChevronRight size={18} className="text-muted" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function MemberStats() {
  const orders = useOrders();
  const thisMonth = todayTW().slice(0, 7);
  const trips = orders.filter((o) => (o.status === 'paid' || o.status === 'done') && o.date.startsWith(thisMonth)).length;
  const spent = orders.filter((o) => o.status === 'paid' || o.status === 'done').reduce((a, o) => a + o.amount, 0);
  return (
    <section className="card grid grid-cols-2 gap-3 px-5 py-5 sm:px-6">
      <div><p className="label">本月搭乘</p><p className="num text-[26px] font-extrabold">{trips} <span className="text-sm font-semibold text-muted">趟</span></p></div>
      <div><p className="label">累積消費</p><p className="num text-[26px] font-extrabold">{formatPrice(spent)}</p></div>
    </section>
  );
}
