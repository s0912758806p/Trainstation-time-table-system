import type { Metadata } from 'next';
import Link from 'next/link';
import { BookingForm } from '@/components/BookingForm';
import { getTrip } from '@/lib/data';
import { isValidDate, todayTW } from '@/lib/format';
import { getSession } from '@/lib/session';
import { TRAIN_TYPES } from '@/lib/trainTypes';

export const metadata: Metadata = { title: '填寫訂票資料' };

type SP = Promise<{ train?: string; date?: string; from?: string; to?: string }>;

function Problem({ title, body }: { title: string; body: string }) {
  return (
    <div className="wrap pt-10">
      <div className="card mx-auto flex max-w-xl flex-col items-center gap-2 p-10 text-center">
        <h1 className="text-xl font-extrabold">{title}</h1>
        <p className="text-muted">{body}</p>
        <Link className="btn btn-ghost mt-2" href="/search">回到時刻查詢</Link>
      </div>
    </div>
  );
}

export default async function BookingPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  if (!sp.train || !sp.from || !sp.to || !isValidDate(sp.date)) return <Problem title="缺少訂票資訊" body="請先查詢班次，再從結果中選擇要訂的列車。" />;
  if (sp.date < todayTW()) return <Problem title="無法預訂過去的班次" body="請重新選擇乘車日期。" />;

  const [{ data: trip }, session] = await Promise.all([getTrip(sp.train, sp.date, sp.from, sp.to), getSession()]);
  if (!trip) return <Problem title="找不到這班列車" body="班次可能已異動，請重新查詢。" />;
  if (!TRAIN_TYPES[trip.train.type].reservable) return <Problem title="區間車不需訂位" body="區間車為自由座，可使用電子票證直接進站搭乘。" />;
  if (trip.seat === 'none' || trip.fare == null) return <Problem title="這班列車已無座位" body="請選擇其他班次。" />;

  return <BookingForm trip={trip} contact={{ name: session?.name ?? '', email: session?.email ?? '' }} />;
}
