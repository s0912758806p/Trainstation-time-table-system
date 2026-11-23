import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DepartureBoard } from '@/components/DepartureBoard';
import { PinIcon } from '@/components/icons';
import { StationList } from '@/components/StationList';
import { getBoard, getStation, getStations } from '@/lib/data';
import { addDays, minToTime, nowMinTW, todayTW } from '@/lib/format';
import { DEFAULT_FACILITIES, DEFAULT_TRANSFERS, FACILITIES_BY_GRADE, TRANSFERS } from '@/lib/stationInfo';

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getStation(id);
  return { title: data ? `${data.name}車站資訊與時刻` : '車站資訊' };
}

export default async function StationPage({ params }: { params: Params }) {
  const { id } = await params;
  const [{ data: stations }, { data: station }] = await Promise.all([getStations(), getStation(id)]);
  if (!station) notFound();
  const { data: board } = await getBoard(station.id);
  const today = todayTW();
  const facilities = FACILITIES_BY_GRADE[station.grade] ?? DEFAULT_FACILITIES;
  const transfers = TRANSFERS[station.id] ?? DEFAULT_TRANSFERS;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${station.name}車站`)}`;
  const tomorrow = addDays(today, 1);

  return (
    <div className="wrap flex flex-col gap-5 pt-6">
      <h1 className="text-[26px] font-black">車站資訊</h1>
      <div className="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <StationList stations={stations} currentId={station.id} />

        <div className="flex min-w-0 flex-col gap-6">
          <section className="card flex flex-wrap items-start justify-between gap-5 p-5 sm:p-6">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 className="text-[32px] font-black">{station.name}</h2>
                <span className="text-lg font-semibold text-muted">{station.en}</span>
                <span className="pill pill-info">{station.grade}</span>
              </div>
              {station.address && <p className="flex items-center gap-1.5 text-sm text-muted"><PinIcon size={16} />{station.address}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link className="btn btn-accent" href={`/search?from=${station.id}&to=${station.id === '1000' ? '4400' : '1000'}&date=${tomorrow}`}>從{station.name}出發</Link>
              <Link className="btn btn-ghost" href={`/search?from=${station.id === '1000' ? '4400' : '1000'}&to=${station.id}&date=${tomorrow}`}>到{station.name}</Link>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-2">
            <DepartureBoard stationName={station.name} entries={board} updatedAt={minToTime(nowMinTW())} date={today} rows={5} directionLabels={['順行', '逆行']} />
            <section className="card px-5 py-5 sm:px-6">
              <h3 className="h-sec mb-1">轉乘交通</h3>
              <ul>
                {transfers.map((t) => (
                  <li key={t.name} className="flex items-center gap-3 border-t border-line py-3 first:border-0">
                    <span aria-hidden="true" className="h-3.5 w-3.5 shrink-0 rounded" style={{ background: t.color }} />
                    <div className="flex-1"><p className="font-bold">{t.name}</p><p className="text-[13px] text-muted">{t.note}</p></div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="card flex flex-col gap-3.5 px-5 py-5 sm:px-6">
            <div className="sec-head"><h3 className="h-sec">站內設施</h3><span className="text-[13px] text-muted">設施位置以現場公告為準</span></div>
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {facilities.map(([k, v]) => (
                <li key={k} className="flex flex-col gap-0.5 rounded-xl bg-subtle p-3.5"><b className="text-[15px]">{k}</b><span className="text-[13px] text-muted">{v}</span></li>
              ))}
            </ul>
            <a className="btn btn-ghost self-start" href={mapUrl} target="_blank" rel="noopener noreferrer">在 Google 地圖開啟</a>
          </section>
        </div>
      </div>
    </div>
  );
}
