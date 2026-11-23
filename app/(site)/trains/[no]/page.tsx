import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from '@/components/icons';
import { Journey, TrainNo, TrainTypeBadge } from '@/components/train';
import { getTrain, getTrip } from '@/lib/data';
import { formatDateLabel, formatPrice, isValidDate, todayTW } from '@/lib/format';
import { halfFare, TRAIN_TYPES } from '@/lib/trainTypes';

type Params = Promise<{ no: string }>;
type SP = Promise<{ date?: string; from?: string; to?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { no } = await params;
  return { title: `${no} 次列車時刻` };
}

export default async function TrainPage({ params, searchParams }: { params: Params; searchParams: SP }) {
  const { no } = await params;
  const sp = await searchParams;
  if (!/^\d{1,4}$/.test(no)) notFound();
  const date = isValidDate(sp.date) ? sp.date : todayTW();
  const { data: train } = await getTrain(no, date);

  if (!train) {
    return (
      <div className="wrap pt-10">
        <div className="card mx-auto flex max-w-xl flex-col items-center gap-2 p-10 text-center">
          <h1 className="text-xl font-extrabold">找不到 {no} 次列車</h1>
          <p className="text-muted">{formatDateLabel(date)} 沒有這個車次，請確認車次號碼或日期。</p>
          <Link className="btn btn-ghost mt-2" href="/search">回到時刻查詢</Link>
        </div>
      </div>
    );
  }

  const stops = train.stops;
  const iFrom = sp.from ? stops.findIndex((s) => s.stationId === sp.from) : -1;
  const iTo = sp.to ? stops.findIndex((s) => s.stationId === sp.to) : -1;
  const hasSeg = iFrom >= 0 && iTo > iFrom;
  const { data: trip } = hasSeg ? await getTrip(no, date, stops[iFrom].stationId, stops[iTo].stationId) : { data: null };
  const reservable = TRAIN_TYPES[train.type].reservable;
  const services = [train.services.wheelchair && '無障礙座位', train.services.bike && '自行車車廂', train.services.nursing && '哺乳室'].filter(Boolean) as string[];
  const backHref = hasSeg ? `/search?from=${stops[iFrom].stationId}&to=${stops[iTo].stationId}&date=${date}` : '/search';

  const cls = (i: number) => {
    const c: string[] = [];
    if (i === 0) c.push('first');
    if (i === stops.length - 1) c.push('last');
    if (!hasSeg) return c.join(' ');
    if (i === iFrom) c.push('inseg', 'start');
    else if (i === iTo) c.push('end');
    else if (i > iFrom && i < iTo) c.push('inseg');
    else c.push('off');
    return c.join(' ');
  };

  return (
    <div className="wrap flex flex-col gap-5 pt-5">
      <Link className="btn btn-text btn-sm self-start px-0" style={{ color: 'var(--ink2)' }} href={backHref}><ArrowLeft size={18} />返回查詢結果</Link>

      <section className="card flex flex-wrap items-center justify-between gap-6 p-5 sm:p-6">
        <div className="flex min-w-[260px] flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <TrainNo no={train.no} className="h-8 px-2.5 text-lg" />
            <TrainTypeBadge type={train.type} name={train.typeName} className="h-8 text-sm" />
          </div>
          <h1 className="text-[26px] font-black">{train.originName} → {train.destName} {train.line && <span className="text-base font-semibold text-muted">・{train.line}</span>}</h1>
          <div className="flex flex-wrap gap-1.5">
            {services.map((s) => <span key={s} className="tag">{s}</span>)}
            <span className="tag">{formatDateLabel(date)}</span>
          </div>
        </div>
        {trip && (
          <div className="flex min-w-[min(340px,100%)] max-w-[460px] flex-1 flex-col gap-3">
            <p className="label">您的行程・{formatDateLabel(date)}</p>
            <Journey dep={trip.from.dep} arr={trip.to.arr} fromName={trip.from.stationName} toName={trip.to.stationName} durationMin={trip.durationMin}
              note={trip.stopsBetween ? `停靠 ${trip.stopsBetween} 站` : '直達'} />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p><span className="price text-2xl">{formatPrice(trip.fare)}</span> <span className="text-[13px] text-muted">全票 / 人</span></p>
              {reservable ? (
                trip.seat === 'none'
                  ? <button className="btn btn-lg" disabled>已售完</button>
                  : <Link className="btn btn-accent btn-lg" href={`/booking?train=${train.no}&date=${date}&from=${trip.from.stationId}&to=${trip.to.stationId}`}>訂這班<ArrowRight size={18} /></Link>
              ) : <span className="pill pill-info">區間車為自由座，免訂位</span>}
            </div>
          </div>
        )}
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <section className="card p-5 sm:p-6" aria-label="停靠站">
          <div className="sec-head mb-5">
            <h2 className="h-sec">停靠站與時刻</h2>
            {hasSeg && (
              <div className="flex items-center gap-3 text-[13px] font-semibold text-muted">
                <span className="inline-flex items-center gap-1.5"><span className="h-1 w-[18px] rounded-sm bg-accent" />您的區間</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-1 w-[18px] rounded-sm bg-line" />其他區間</span>
              </div>
            )}
          </div>
          <ol className="route">
            {stops.map((s, i) => {
              const isFirst = i === 0;
              const isLast = i === stops.length - 1;
              const dwell = s.depMin - s.arrMin;
              return (
                <li key={s.stationId} className={cls(i)}>
                  <span className="rt" style={i === iFrom || i === iTo ? { color: 'var(--accent)' } : undefined}>{isLast ? s.arr : s.dep}</span>
                  <span className="rail"><span className="dot" /></span>
                  <div>
                    <Link href={`/stations/${s.stationId}`} className="rn text-inherit no-underline hover:underline" style={{ color: 'inherit', fontSize: i === iFrom || i === iTo ? 17 : undefined }}>{s.stationName}</Link>
                    <p className="rm">{isFirst ? '始發站' : isLast ? '終點站' : `停 ${dwell} 分・到站 ${s.arr}`}</p>
                  </div>
                  {i === iFrom ? <span className="pill pill-accent">上車</span> : i === iTo ? <span className="pill pill-accent">下車</span> : <span />}
                </li>
              );
            })}
          </ol>
        </section>

        <div className="flex min-w-0 flex-col gap-6">
          {trip?.fare != null && (
            <section className="card p-5 sm:p-6">
              <h2 className="h-sec mb-2">票價・{trip.from.stationName} → {trip.to.stationName}</h2>
              <table className="w-full border-collapse text-[15px]">
                <tbody>
                  {[['全票', trip.fare], ['孩童票（6–12 歲）', halfFare(trip.fare)], ['敬老票（65 歲以上）', halfFare(trip.fare)], ['愛心票', halfFare(trip.fare)]].map(([k, v], i) => (
                    <tr key={k as string} className={i ? 'border-t border-line' : ''}>
                      <th scope="row" className="py-3 text-left font-normal">{k}</th>
                      <td className="num py-3 text-right font-extrabold">{formatPrice(v as number)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-[13px] text-muted">優惠票需於乘車時出示證明文件。</p>
            </section>
          )}
          <section className="card p-5 sm:p-6">
            <h2 className="h-sec mb-3">乘車提醒</h2>
            <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm text-ink2">
              <li>請於發車前 10 分鐘抵達月台，月台可能臨時異動。</li>
              {reservable && <li>訂位後需於 30 分鐘內完成付款，逾時自動取消。</li>}
              {train.services.bike && <li>自行車需另購自行車票，請至自行車車廂上下車。</li>}
              {!reservable && <li>區間車不需訂位，可使用電子票證直接進站。</li>}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
