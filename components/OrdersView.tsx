'use client';
/**
 * 我的訂單：狀態分頁、搜尋、清單＋詳情（桌機為左右兩欄，手機詳情在清單下方）。
 * 付款／取消／退票會更新 localStorage；列印使用瀏覽器列印並隱藏站台外框。
 */
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { formatDateLabel, formatDuration, formatPrice } from '@/lib/format';
import { useHydrated } from '@/lib/stores/local';
import {
  cancelOrder, ensureSeeded, paxSummary, payOrder, refundOrder, STATUS_META, useOrders,
  type Order, type OrderStatus,
} from '@/lib/stores/orders';
import { PrinterIcon } from './icons';
import { Journey, TrainNo, TrainTypeBadge } from './train';

const TABS: ('all' | OrderStatus)[] = ['all', 'pending', 'paid', 'done', 'refunded', 'cancelled'];
const tabLabel = (t: 'all' | OrderStatus) => (t === 'all' ? '全部' : STATUS_META[t].label);
const time = (iso: string) => new Date(iso).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Taipei' });

export function OrdersView() {
  const hydrated = useHydrated();
  const orders = useOrders();
  const params = useSearchParams();
  const [tab, setTab] = useState<'all' | OrderStatus>('all');
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<string | null>(params.get('id'));
  const [confirm, setConfirm] = useState<null | 'cancel' | 'refund'>(null);

  useEffect(() => { ensureSeeded(); }, []);

  const list = useMemo(() => {
    const term = q.trim().replace(/台/g, '臺');
    return orders
      .filter((o) => tab === 'all' || o.status === tab)
      .filter((o) => !term || [o.id, o.trainNo, o.fromName, o.toName].some((x) => x.includes(term)))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.date.localeCompare(a.date));
  }, [orders, tab, q]);

  const selected = list.find((o) => o.id === sel) ?? list[0];

  if (!hydrated) return <div className="wrap pt-6"><div className="card h-96 animate-pulse" aria-busy="true" /></div>;

  return (
    <div className="wrap flex flex-col gap-5 pt-6">
      <div className="flex flex-wrap items-end justify-between gap-4 no-print">
        <div><h1 className="text-[26px] font-black">我的訂單</h1><p className="mt-0.5 text-sm text-muted">查看車票、付款或退票。訂單保存在這個瀏覽器中。</p></div>
        <div className="flex w-full max-w-[420px] gap-2">
          <label htmlFor="oq" className="sr-only">搜尋訂單</label>
          <input id="oq" className="input" placeholder="搜尋訂單編號、車次或車站" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-line no-print" role="tablist" aria-label="訂單狀態">
        {TABS.map((t) => (
          <button key={t} role="tab" type="button" aria-selected={tab === t} onClick={() => { setTab(t); setSel(null); }}
            className={`min-h-11 whitespace-nowrap border-b-[3px] px-3.5 text-sm font-bold ${tab === t ? 'border-accent text-ink' : 'border-transparent text-muted'}`}>
            {tabLabel(t)}<span className="num ml-1 font-semibold">{t === 'all' ? orders.length : orders.filter((o) => o.status === t).length}</span>
          </button>
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,1fr)]">
        <section aria-label="訂單列表" className="flex min-w-0 flex-col gap-3 no-print">
          {list.map((o) => <OrderCard key={o.id} order={o} active={o.id === selected?.id} onPick={() => setSel(o.id)} />)}
          {list.length === 0 && (
            <div className="card flex flex-col items-center gap-2 p-10 text-center">
              <p className="text-lg font-extrabold">{q ? `找不到符合「${q}」的訂單` : '這個分類目前沒有訂單'}</p>
              <p className="text-muted">查詢班次後即可線上訂票，訂單會出現在這裡。</p>
              <Link className="btn btn-accent mt-2" href="/">查詢班次</Link>
            </div>
          )}
        </section>

        {selected && (
          <aside className="card flex flex-col gap-4 p-5 sm:p-6 lg:sticky lg:top-20" aria-label="訂單詳情">
            <OrderDetail order={selected} confirm={confirm} setConfirm={setConfirm} />
          </aside>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order: o, active, onPick }: { order: Order; active: boolean; onPick: () => void }) {
  const meta = STATUS_META[o.status];
  return (
    <button type="button" onClick={onPick} aria-pressed={active}
      className={`block w-full rounded-[14px] border bg-surface px-4 py-4 text-left sm:px-5 ${active ? 'border-primary shadow-[inset_0_0_0_2px_var(--primary)]' : 'border-line hover:border-muted'}`}>
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <span className="font-mono text-[13px] font-bold text-muted">{o.id}</span>
        <span className={`pill ${meta.pill}`}>{meta.label}</span>
      </div>
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4">
        <div className="flex flex-col items-start gap-1"><TrainNo no={o.trainNo} /><TrainTypeBadge type={o.trainType} /></div>
        <div>
          <p className="num text-lg font-extrabold">{o.dep} {o.fromName} → {o.arr} {o.toName}</p>
          <p className="num text-[13px] font-semibold text-muted">{formatDateLabel(o.date)}・{paxSummary(o.pax)}</p>
        </div>
        <span className="price text-lg">{formatPrice(o.amount)}</span>
      </div>
    </button>
  );
}

function OrderDetail({ order: o, confirm, setConfirm }: { order: Order; confirm: null | 'cancel' | 'refund'; setConfirm: (v: null | 'cancel' | 'refund') => void }) {
  const meta = STATUS_META[o.status];
  return (
    <>
      <div className="sec-head"><h2 className="h-sec">訂單詳情</h2><span className={`pill ${meta.pill}`}>{meta.label}</span></div>
      <div className="flex items-center gap-2"><TrainNo no={o.trainNo} /><TrainTypeBadge type={o.trainType} /><span className="num text-sm font-semibold text-muted">{formatDateLabel(o.date)}</span></div>
      <Journey dep={o.dep} arr={o.arr} fromName={o.fromName} toName={o.toName} durationMin={o.durationMin} size={24} />
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5">
        <div><dt className="label">訂單編號</dt><dd className="m-0 font-mono font-bold">{o.id}</dd></div>
        <div><dt className="label">座位</dt><dd className="m-0 font-bold">{o.seats}</dd></div>
        <div><dt className="label">票種</dt><dd className="m-0 font-bold">{paxSummary(o.pax)}</dd></div>
        <div><dt className="label">金額</dt><dd className="num m-0 font-bold">{formatPrice(o.amount)}</dd></div>
        <div><dt className="label">行車時間</dt><dd className="num m-0 font-bold">{formatDuration(o.durationMin)}</dd></div>
        {o.contact.name && <div><dt className="label">取票人</dt><dd className="m-0 font-bold">{o.contact.name}</dd></div>}
      </dl>

      {o.status === 'paid' && (
        <div className="flex items-center gap-4">
          <div role="img" aria-label="乘車條碼（展示用）" className="flex h-[132px] w-[132px] shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-line bg-subtle p-2 text-center text-xs font-bold text-muted">
            乘車條碼<br />（展示用）
          </div>
          <p className="text-[13px] text-muted">進站時將條碼對準閘門感應區即可。</p>
        </div>
      )}
      {o.status === 'pending' && <p className="text-sm font-semibold" style={{ color: 'var(--warn)' }}>請於 {time(o.payBy)} 前完成付款，逾時將自動取消。</p>}

      <div className="divider" />

      {confirm ? (
        <div role="alertdialog" aria-labelledby="confirm-t" className="flex flex-col gap-3 rounded-xl bg-subtle p-4">
          <p id="confirm-t" className="font-bold">{confirm === 'cancel' ? '確定要取消這筆訂單嗎？座位將被釋出。' : `確定要退票嗎？將退款 ${formatPrice(o.amount)}（展示用，不會實際退款）。`}</p>
          <div className="flex gap-2">
            <button type="button" className="btn btn-danger flex-1" onClick={() => { if (confirm === 'cancel') cancelOrder(o.id); else refundOrder(o.id); setConfirm(null); }}>
              {confirm === 'cancel' ? '確定取消' : '確定退票'}
            </button>
            <button type="button" className="btn btn-ghost flex-1" onClick={() => setConfirm(null)}>返回</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 no-print">
          {o.status === 'pending' && (
            <>
              <button type="button" className="btn btn-accent flex-1" onClick={() => payOrder(o.id)}>付款 {formatPrice(o.amount)}</button>
              <button type="button" className="btn btn-danger" onClick={() => setConfirm('cancel')}>取消訂單</button>
            </>
          )}
          {o.status === 'paid' && (
            <>
              <button type="button" className="btn btn-ghost flex-1" onClick={() => window.print()}><PrinterIcon size={16} />列印車票</button>
              <button type="button" className="btn btn-danger" onClick={() => setConfirm('refund')}>退票</button>
            </>
          )}
          {(o.status === 'done' || o.status === 'refunded' || o.status === 'cancelled') && (
            <Link className="btn btn-ghost flex-1" href={`/search?from=${o.fromId}&to=${o.toId}`}>再訂一次相同路線</Link>
          )}
        </div>
      )}
    </>
  );
}
