'use client';
/** 訂票表單：票種數量、座位偏好、聯絡人 → 建立「待付款」訂單並前往完成頁。 */
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { formatDateLabel, formatPrice } from '@/lib/format';
import { createOrder, PAX_LABEL, type PaxKey, type SeatPref } from '@/lib/stores/orders';
import { halfFare } from '@/lib/trainTypes';
import type { Trip } from '@/lib/types';
import { CheckIcon, MinusIcon, PlusIcon } from './icons';
import { Journey, TrainNo, TrainTypeBadge } from './train';

const MAX = 6;
const NOTES: Record<PaxKey, string> = {
  adult: '12 歲以上',
  child: '6–12 歲；未滿 6 歲且不佔位免費',
  senior: '65 歲以上，需出示證件',
  love: '身心障礙者及必要陪伴者一人',
};
const SEATS: [SeatPref, string][] = [['any', '不指定'], ['window', '靠窗'], ['aisle', '靠走道']];

export function BookingForm({ trip, contact }: { trip: Trip; contact: { name: string; email: string } }) {
  const router = useRouter();
  const fare = trip.fare ?? 0;
  const price: Record<PaxKey, number> = { adult: fare, child: halfFare(fare), senior: halfFare(fare), love: halfFare(fare) };
  const [pax, setPax] = useState<Record<PaxKey, number>>({ adult: 1, child: 0, senior: 0, love: 0 });
  const [seat, setSeat] = useState<SeatPref>('any');
  const [name, setName] = useState(contact.name);
  const [email, setEmail] = useState(contact.email);
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const keys = Object.keys(PAX_LABEL) as PaxKey[];
  const count = keys.reduce((a, k) => a + pax[k], 0);
  const total = keys.reduce((a, k) => a + pax[k] * price[k], 0);
  const set = (k: PaxKey, d: number) => setPax((p) => ({ ...p, [k]: Math.max(0, Math.min(MAX, p[k] + d)) }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (count === 0) errs.pax = '請至少選擇 1 位乘客';
    if (!name.trim()) errs.name = '請輸入取票人姓名';
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = '請輸入有效的電子郵件';
    if (phone && !/^09\d{2}-?\d{3}-?\d{3}$/.test(phone)) errs.phone = '手機號碼格式為 09xx-xxx-xxx';
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setSubmitting(true);
    const order = createOrder({
      date: trip.date, trainNo: trip.train.no, trainType: trip.train.type, typeName: trip.train.typeName,
      fromId: trip.from.stationId, fromName: trip.from.stationName, toId: trip.to.stationId, toName: trip.to.stationName,
      dep: trip.from.dep, arr: trip.to.arr, durationMin: trip.durationMin, pax, seatPref: seat, amount: total,
      contact: { name: name.trim(), email: email.trim(), phone: phone.trim() }, reservable: true,
    });
    router.push(`/booking/done/${order.id}`);
  };

  return (
    <form onSubmit={submit} noValidate className="wrap flex flex-col gap-5 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[26px] font-black">填寫訂票資料</h1>
        <ol className="flex flex-wrap items-center gap-2 text-sm font-bold text-muted" aria-label="訂票步驟">
          <li className="flex items-center gap-2 text-ink2"><span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ok text-white"><CheckIcon size={14} /></span>選擇班次</li>
          <li aria-hidden="true" className="h-0.5 w-8 bg-line" />
          <li className="flex items-center gap-2 text-ink" aria-current="step"><span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-on-primary">2</span>乘客與座位</li>
          <li aria-hidden="true" className="h-0.5 w-8 bg-line" />
          <li className="flex items-center gap-2"><span className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-line">3</span>確認付款</li>
        </ol>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
        <div className="flex min-w-0 flex-col gap-5">
          <fieldset className="card px-5 py-4 sm:px-6" aria-describedby={errors.pax ? 'e-pax' : undefined}>
            <legend className="sr-only">乘客票種</legend>
            <div className="sec-head mb-1"><h2 className="h-sec">乘客票種</h2><span className="text-[13px] text-muted">每筆訂單最多 {MAX} 位</span></div>
            {keys.map((k, i) => (
              <div key={k} className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3.5 ${i ? 'border-t border-line' : ''}`}>
                <div>
                  <p className="font-extrabold">{PAX_LABEL[k]} <span className="num text-sm font-semibold text-muted">{formatPrice(price[k])}</span></p>
                  <p className="text-[13px] text-muted">{NOTES[k]}</p>
                </div>
                <div className="inline-flex items-center gap-1 rounded-xl border border-line p-[3px]">
                  <button id={i === 0 ? 'f-pax' : undefined} type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-[9px] bg-subtle disabled:opacity-40" aria-label={`減少${PAX_LABEL[k]}`} disabled={pax[k] === 0} onClick={() => set(k, -1)}><MinusIcon size={16} /></button>
                  <output className="num min-w-9 text-center text-lg font-extrabold" aria-live="polite" aria-label={`${PAX_LABEL[k]} ${pax[k]} 位`}>{pax[k]}</output>
                  <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-[9px] bg-subtle disabled:opacity-40" aria-label={`增加${PAX_LABEL[k]}`} disabled={count >= MAX} onClick={() => set(k, 1)}><PlusIcon size={16} /></button>
                </div>
              </div>
            ))}
            {errors.pax && <p id="e-pax" role="alert" className="text-sm font-bold" style={{ color: 'var(--bad)' }}>{errors.pax}</p>}
          </fieldset>

          <section className="card flex flex-col gap-3.5 px-5 py-5 sm:px-6">
            <h2 className="h-sec">座位偏好</h2>
            <div className="seg self-start" role="group" aria-label="座位偏好">
              {SEATS.map(([k, l]) => <button key={k} type="button" aria-pressed={seat === k} onClick={() => setSeat(k)}>{l}</button>)}
            </div>
            <p className="text-[13px] text-muted">座位由系統依偏好配置，同行乘客會盡量安排在相鄰座位。</p>
          </section>

          <section className="card flex flex-col gap-3.5 px-5 py-5 sm:px-6">
            <h2 className="h-sec">取票聯絡人</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="f-name" label="姓名" error={errors.name}><input id="f-name" className="input" autoComplete="name" placeholder="例如：王小明" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'f-name-e' : undefined} /></Field>
              <Field id="f-phone" label="手機號碼（選填）" error={errors.phone}><input id="f-phone" className="input num" autoComplete="tel" inputMode="tel" placeholder="09xx-xxx-xxx" value={phone} onChange={(e) => setPhone(e.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'f-phone-e' : undefined} /></Field>
              <div className="sm:col-span-2">
                <Field id="f-email" label="電子郵件（寄送電子車票）" error={errors.email}><input id="f-email" type="email" className="input" autoComplete="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'f-email-e' : undefined} /></Field>
              </div>
            </div>
          </section>
        </div>

        <aside className="card flex flex-col gap-4 p-5 sm:p-6 lg:sticky lg:top-20" aria-label="訂單摘要">
          <div className="flex flex-wrap items-center gap-2"><TrainNo no={trip.train.no} /><TrainTypeBadge type={trip.train.type} /><span className="num text-sm font-semibold text-muted">{formatDateLabel(trip.date)}</span></div>
          <Journey dep={trip.from.dep} arr={trip.to.arr} fromName={trip.from.stationName} toName={trip.to.stationName} durationMin={trip.durationMin} size={24} />
          <div className="divider" />
          <div className="flex flex-col gap-1.5 text-[15px]">
            {keys.filter((k) => pax[k] > 0).map((k) => (
              <div key={k} className="flex justify-between"><span>{PAX_LABEL[k]} × {pax[k]}</span><span className="num font-bold">{formatPrice(price[k] * pax[k])}</span></div>
            ))}
            {count === 0 && <p className="text-sm text-muted">請至少選擇 1 位乘客</p>}
            <div className="flex justify-between"><span>座位偏好</span><span className="font-bold">{SEATS.find(([k]) => k === seat)?.[1]}</span></div>
          </div>
          <div className="divider" />
          <div className="flex items-baseline justify-between"><span className="font-extrabold">總計</span><span className="price text-3xl" aria-live="polite">{formatPrice(total)}</span></div>
          <button type="submit" className="btn btn-accent btn-lg w-full" disabled={count === 0 || submitting}>{submitting ? '處理中…' : '確認訂票'}</button>
          <p className="text-center text-[13px] text-muted">訂位成功後請於 30 分鐘內完成付款</p>
        </aside>
      </div>
    </form>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="flabel" htmlFor={id}>{label}</label>
      {children}
      {error && <p id={`${id}-e`} className="mt-1.5 text-sm font-bold" style={{ color: 'var(--bad)' }}>{error}</p>}
    </div>
  );
}
