'use client';
import Link from 'next/link';
import { formatDateLabel, formatPrice } from '@/lib/format';
import { useHydrated } from '@/lib/stores/local';
import { paxSummary, payOrder, STATUS_META, useOrders } from '@/lib/stores/orders';
import { CheckIcon, InfoIcon } from './icons';
import { Journey, TrainNo, TrainTypeBadge } from './train';

const time = (iso: string) => new Date(iso).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Taipei' });

export function BookingDone({ id }: { id: string }) {
  const hydrated = useHydrated();
  const order = useOrders().find((o) => o.id === id);

  if (!hydrated) return <div className="wrap pt-12"><div className="card mx-auto h-80 max-w-3xl animate-pulse" aria-busy="true" /></div>;
  if (!order) {
    return (
      <div className="wrap pt-10">
        <div className="card mx-auto flex max-w-xl flex-col items-center gap-2 p-10 text-center">
          <h1 className="text-xl font-extrabold">找不到這筆訂單</h1>
          <p className="text-muted">訂單只保存在這個瀏覽器中，請到「我的訂單」查看。</p>
          <Link className="btn btn-ghost mt-2" href="/orders">我的訂單</Link>
        </div>
      </div>
    );
  }

  const meta = STATUS_META[order.status];
  const pending = order.status === 'pending';
  return (
    <div className="wrap flex max-w-[860px] flex-col gap-7 pt-12">
      <div className="flex flex-col items-center gap-2.5 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-ok-bg text-ok"><CheckIcon size={32} strokeWidth={2.6} /></span>
        <h1 className="text-3xl font-black">{order.status === 'paid' ? '付款完成！' : '訂位成功！'}</h1>
        <p className="text-muted">
          {pending ? <>座位已為您保留，請於 <b style={{ color: 'var(--warn)' }}>{time(order.payBy)}</b> 前完成付款，逾時將自動取消。</>
            : order.status === 'paid' ? '電子車票已寄送至您的信箱，也可在「我的訂單」出示乘車條碼。' : `訂單狀態：${meta.label}`}
        </p>
      </div>

      <section className="grid overflow-hidden rounded-[20px] border border-line bg-surface sm:grid-cols-[minmax(0,1fr)_220px]" aria-label="車票資訊">
        <div className="flex flex-col gap-4 p-6 sm:p-7">
          <div className="sec-head">
            <div className="flex items-center gap-2"><TrainNo no={order.trainNo} /><TrainTypeBadge type={order.trainType} /></div>
            <span className={`pill ${meta.pill}`}>{meta.label}</span>
          </div>
          <Journey dep={order.dep} arr={order.arr} fromName={order.fromName} toName={order.toName} durationMin={order.durationMin} size={34} />
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div><dt className="label">乘車日期</dt><dd className="num m-0 font-extrabold">{formatDateLabel(order.date)}</dd></div>
            <div><dt className="label">座位</dt><dd className="m-0 font-extrabold">{order.seats}</dd></div>
            <div><dt className="label">票種</dt><dd className="m-0 font-extrabold">{paxSummary(order.pax)}</dd></div>
          </dl>
        </div>
        <div className="relative flex flex-col justify-center gap-3.5 border-t-2 border-dashed border-line bg-subtle p-6 sm:border-t-0 sm:border-l-2">
          <div><p className="label">訂單編號</p><p className="font-mono text-[17px] font-bold">{order.id}</p></div>
          <div><p className="label">{pending ? '應付金額' : '金額'}</p><p className="price text-[28px]">{formatPrice(order.amount)}</p></div>
        </div>
      </section>

      <div className="flex flex-wrap justify-center gap-3">
        {pending && <button type="button" className="btn btn-accent btn-lg" onClick={() => payOrder(order.id)}>立即付款（模擬）</button>}
        <Link className="btn btn-ghost btn-lg" href={`/orders?id=${order.id}`}>查看我的訂單</Link>
        <Link className="btn btn-text btn-lg" href="/">回首頁</Link>
      </div>

      <section className="card flex items-start gap-3.5 px-6 py-5">
        <InfoIcon size={20} className="mt-0.5 shrink-0 text-link" />
        <div className="flex flex-col gap-1 text-sm text-ink2">
          <p>付款為展示用模擬流程，不會產生任何實際交易。</p>
          <p>發車前 30 分鐘以前可免費退票；之後每張收取 20% 手續費。</p>
        </div>
      </section>
    </div>
  );
}
