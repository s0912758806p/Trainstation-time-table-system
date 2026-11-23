import type { Metadata } from 'next';
import Link from 'next/link';
import { safeNext } from '@/lib/safeNext';
import { TrainIcon } from '@/components/icons';
import { LoginForm } from '@/components/LoginForm';
import { ThemeToggle } from '@/components/ThemeToggle';

export const metadata: Metadata = { title: '登入／註冊' };

const ROUTE = [['07:20', '臺北', true], ['08:22', '新竹', false], ['09:12', '臺中', false], ['10:44', '臺南', false], ['11:10', '高雄', true]] as const;

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; tab?: string }> }) {
  const sp = await searchParams;
  const next = safeNext(sp.next);

  return (
    <div className="grid min-h-dvh md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <section className="relative flex flex-col justify-between gap-10 overflow-hidden bg-navy px-6 py-8 text-onnavy md:px-14 md:py-12">
        <div className="flex items-center justify-between">
          <Link className="brand" href="/" aria-label="台鐵時刻 首頁">
            <span className="brand-mark h-11 w-11"><TrainIcon size={24} /></span>
            <span><b className="text-xl">台鐵時刻</b><small>TRAIN TIMETABLE</small></span>
          </Link>
          <span className="md:hidden"><ThemeToggle /></span>
        </div>
        <div className="flex max-w-[460px] flex-col gap-3.5">
          <h1 className="text-[32px] font-black leading-tight md:text-[40px]">準時出發，<br />從查詢開始。</h1>
          <p className="text-base text-onnavy2">一個帳號管理時刻查詢、線上訂票與電子車票。</p>
        </div>
        <ol aria-hidden="true" className="hidden list-none flex-col p-0 md:flex">
          {ROUTE.map(([t, n, hot], i) => (
            <li key={n} className="relative grid min-h-[52px] grid-cols-[56px_24px_1fr] items-center gap-3.5">
              <span className="text-right font-mono font-bold" style={{ color: 'var(--board-amber)' }}>{t}</span>
              <span className="relative flex h-full items-center justify-center">
                <span className={`absolute w-1 bg-white/15 ${i === 0 ? 'top-1/2 bottom-0' : i === ROUTE.length - 1 ? 'top-0 bottom-1/2' : 'inset-y-0'}`} />
                <span className={`relative rounded-full border-[3px] ${hot ? 'h-[18px] w-[18px] border-accent bg-accent' : 'h-3.5 w-3.5 border-white/50 bg-navy'}`} />
              </span>
              <span className="text-base font-bold">{n}</span>
            </li>
          ))}
        </ol>
        <p className="text-xs text-onnavy2">本系統使用模擬帳號與訂單，僅供展示，非官方訂票系統。</p>
      </section>

      <section className="flex items-center justify-center bg-surface px-6 py-12">
        <LoginForm next={next} initialTab={sp.tab === 'register' ? 'register' : 'login'} />
      </section>
    </div>
  );
}
