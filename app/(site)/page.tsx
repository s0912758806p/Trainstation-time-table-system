import { DepartureBoard } from '@/components/DepartureBoard';
import { Favorites, MemberStats, NextTrip } from '@/components/HomeWidgets';
import { SearchForm } from '@/components/SearchForm';
import { DEFAULT_FROM, DEFAULT_TO } from '@/lib/constants';
import { getBoard, getStations } from '@/lib/data';
import { addDays, formatDateLabel, minToTime, nowMinTW, todayTW, weekday } from '@/lib/format';
import { NOTICES, NOTICE_PILL } from '@/lib/notices';
import { getSession } from '@/lib/session';
import Link from 'next/link';

const HERO_STOPS = [['基隆', false], ['臺北', true], ['新竹', false], ['臺中', false], ['嘉義', false], ['臺南', false], ['高雄', true]] as const;

function greeting(min: number) {
  if (min < 11 * 60) return '早安';
  if (min < 18 * 60) return '午安';
  return '晚安';
}

export default async function HomePage() {
  const today = todayTW();
  const now = nowMinTW();
  const [{ data: stations }, { data: board }, session] = await Promise.all([getStations(), getBoard(DEFAULT_FROM), getSession()]);
  const member = !!session && !session.guest;
  const [, m, d] = today.split('-');

  return (
    <>
      <section className="relative overflow-hidden bg-navy pt-11 pb-[132px] text-onnavy">
        <div className="wrap">
          <p className="text-[13px] font-bold tracking-[0.14em] text-onnavy2">{Number(m)} 月 {Number(d)} 日（{weekday(today)}）・{greeting(now)}{session && !session.guest ? `，${session.name}` : ''}</p>
          <h1 className="mt-2 text-[32px] font-black tracking-wide sm:text-[40px]">今天要搭哪一班？</h1>
          <p className="mt-2 text-base text-onnavy2">查詢時刻、比較車種與票價，線上完成訂票。</p>
        </div>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-16 h-0.5 bg-white/15" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-9 hidden justify-between px-[6%] md:flex">
          {HERO_STOPS.map(([n, hot]) => (
            <span key={n} className="relative text-xs font-bold tracking-[0.1em] text-onnavy2">
              <span className={`absolute left-1/2 -top-[34px] -ml-[5px] h-2.5 w-2.5 rounded-full border-2 ${hot ? 'border-accent bg-accent' : 'border-white/50 bg-navy'}`} />
              {n}
            </span>
          ))}
        </div>
      </section>

      <div className="wrap relative -mt-24 flex flex-col gap-6">
        <section className="card px-4 pt-5 pb-5 sm:px-6" style={{ boxShadow: 'var(--shadow-lg)' }}>
          <SearchForm stations={stations} initial={{ from: DEFAULT_FROM, to: DEFAULT_TO, date: addDays(today, 1) }} />
        </section>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-6">
            <DepartureBoard stationName="臺北" entries={board} updatedAt={minToTime(now)} date={today} fullHref={`/stations/${DEFAULT_FROM}`} />

            <section className="card px-5 py-5 sm:px-6">
              <div className="sec-head mb-1"><h2 className="h-sec">營運公告</h2><Link className="btn btn-text btn-sm" href="/help">幫助中心</Link></div>
              <ul>
                {NOTICES.map((n) => (
                  <li key={n.id} className="flex items-start gap-3 border-t border-line py-3.5 first:border-0">
                    <span className={`pill ${NOTICE_PILL[n.kind]}`}>{n.kind}</span>
                    <div className="flex-1"><p className="font-bold">{n.title}</p><p className="text-sm text-muted">{n.body}</p></div>
                    <span className="num text-[13px] text-muted">{formatDateLabel(addDays(today, -n.daysAgo)).slice(0, 5)}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="flex min-w-0 flex-col gap-6">
            <NextTrip member={member} />
            <Favorites date={addDays(today, 1)} />
            {member && <MemberStats />}
          </div>
        </div>
      </div>
    </>
  );
}
